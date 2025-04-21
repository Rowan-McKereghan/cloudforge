import express from 'express';
import cors from 'cors';
import { InvoiceStatus, PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// MATERIALS & INVENTORY ENDPOINTS (existing)
app.get('/materials', async (req, res) => {
  const materials = await prisma.material.findMany({
    include: { 
      inventory: {
        include: {
          purchases: {
            orderBy: { date: 'desc' }
          }
        }
      }
    }
  });
  res.json(materials);
});

app.post('/materials', async (req, res) => {
  try {
    const materialData = req.body;
    const newMaterial = await prisma.material.create({
      data: {
        ...materialData,
        length: parseFloat(materialData.length),
        width: parseFloat(materialData.width),
        thickness: parseFloat(materialData.thickness),
        defaultPrice: parseFloat(materialData.defaultPrice),
        inventory: {
          create: { 
            onHand: 0,
            allocated: 0 }
        }
      }
    });
      

    res.status(201).json({ material: newMaterial });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create material' });
  }
});

app.get('/inventory', async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: { material: true }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

app.put('/inventory/:materialId', async (req, res) => {
  try {
    const { materialId } = req.params;
    const { operation, quantity, vendor } = req.body;

    // Update inventory
    const updatedInventory = await prisma.inventory.update({
      where: { materialId },
      data: {
        onHand: {
          [operation === 'add' ? 'increment' : 'decrement']: quantity
        }
      }
    });

    // Record purchase history
    if(operation === 'add') {
      await prisma.purchaseHistory.create({
        data: {
          inventoryId: updatedInventory.id,
          quantity,
          vendor,
          date: new Date()
        }
      });
    }

    res.json(updatedInventory);
  } catch (error) {
    res.status(500).json({ error: 'Inventory update failed' });
  }
});


// QUOTE ENDPOINTS
app.get('/quotes', async (req, res) => {
  const quotes = await prisma.quote.findMany({
    include: { items: {include: {material: true}}  }
  });
  res.json(quotes);
});

app.post('/quotes', async (req, res) => {
  try {
    const { customerName, items } = req.body;
    
    const total = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.price), 0);

    const quote = await prisma.quote.create({
      data: {
        customerName,
        total,
        items: {
          create: items.map((item: any) => ({
            materialId: item.materialId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes
          }))
        }
      },
      include: { items: {include: {material: true}} }
    });

    res.status(201).json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quote' + error });
  }
});

// SALES ORDER ENDPOINTS
app.post('/quotes/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    const quote = await prisma.quote.findFirstOrThrow({
      where: { id },
      include: { items: {include: {material: true} } }
    });

    // Check inventory status
    for (const item of quote.items) {
      const inventory = await prisma.inventory.findUnique({
        where: { materialId: item.materialId }
      });

      if (!inventory || inventory.onHand < item.quantity) {
        throw new Error(`Insufficient stock for material ${item.materialId}`);
      }
    }
    
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { status: 'APPROVED' },
      include: { items: {include: {material: true} } }
    });

    // Create sales order and allocate inventory
    const salesOrder = await prisma.$transaction(async (prisma) => {
      const so = await prisma.salesOrder.create({
        data: {
          quoteId: id,
          customerName: updatedQuote.customerName
        }
      });

      // Allocate inventory
      for (const item of updatedQuote.items) {
        const inventory = await prisma.inventory.findUnique({
          where: { materialId: item.materialId }
        });

        if (!inventory || inventory.onHand < item.quantity) {
          throw new Error(`Insufficient stock for material ${item.materialId}`);
        }

        await prisma.inventory.update({
          where: { materialId: item.materialId },
          data: {
            onHand: { decrement: item.quantity },
            allocated: { increment: item.quantity }
          }
        });
      }

      return so;
    });

    res.status(201).json(salesOrder);
  } catch (error) {
    res.status(500).json({ error: 'Quote approval failed' });
  }
});

// SHIPMENT ENDPOINTS
app.get('/sales-orders', async (req, res) => {
  const sales_orders = await prisma.salesOrder.findMany({
    include: { shipments: true, invoice: true, quote: true }  
  });
  res.json(sales_orders);
});

app.post('/sales-orders/:id/shipments', async (req, res) => {
  try {
    const { id } = req.params;
    const { estimatedDelivery, carrier, tracking } = req.body;

    const shipment = await prisma.$transaction(async (prisma) => {
      const shipment = await prisma.shipment.create({
        data: {
          salesOrderId: id,
          carrier,
          tracking,
          estimatedDelivery: new Date(estimatedDelivery),
        }
      });

      const salesOrder = await prisma.salesOrder.findUniqueOrThrow({
        where: { id },
        include: { 
          quote: {
            include: {
              items: {
                include: {
                  material: true
                }
              } // Add this
            }
          } 
        }
      });

      // Update allocated inventory
      for (const item of salesOrder.quote.items) {
        const inv = await prisma.inventory.findUniqueOrThrow({
          where: { materialId: item.materialId },
        })

        if (item.quantity > inv.allocated) {
          throw new Error(`Insufficient allocated stock for material ${item.materialId}`);
        }

        await prisma.inventory.update({
          where: { materialId: item.materialId },
          data: { allocated: { decrement: item.quantity } }
        });
      }

      // Generate invoice if first shipment
      const existingInvoice = await prisma.invoice.findFirst({
        where: { salesOrderId: id }
      });

      if(existingInvoice) {
        throw new Error(`Invoice already exists! ` + existingInvoice.number);
      }

      await prisma.invoice.create({
        data: {
          salesOrderId: id,
          number: `INV-${Date.now()}`,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          subtotal: salesOrder?.quote.total || 0,
          taxRate: 0, // Add default tax rate
          discount: 0, // Add default discount
          total: salesOrder?.quote.total || 0,
        }
      });

      return shipment;
    });

    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Shipment creation failed' + error });
  }
});

// INVOICE ENDPOINTS
app.get('/invoices', async (req, res) => {
  const quotes = await prisma.invoice.findMany({
    include: { payments: true, shipments: true, salesOrder: {
      include: {quote: {include: {items: {include: {material: true}}}}}
    }}  }
);
  res.json(quotes);
});


app.post('/invoices/:id/payments', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, method, reference } = req.body;
    
    const payment = await prisma.payment.create({
      data: {
        invoiceId: id,
        amount: parseFloat(amount),
        method,
        reference
      }
    });

    const invoice = await prisma.invoice.findUniqueOrThrow({
      where: {id},
      include: {payments: true}
    });

    let sum = 0;
    for (const payment of invoice.payments) {
      sum += payment.amount;
    }

    if(sum >= invoice.total) {
      await prisma.invoice.update({
        where: {id},
        data: {
          status: 'PAID'
        }
      })
    }
    else if (invoice.status === 'ISSUED'){
      await prisma.invoice.update({
        where: {id},
        data: {
          status: 'PARTIALLY_PAID'
        }
      })
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});