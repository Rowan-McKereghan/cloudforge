import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// API Endpoints
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

app.get('/materials', async (req, res) => {
  const materials = await prisma.material.findMany({
    include: { inventory: true }
  });
  res.json(materials);
});

app.post('/materials', async (req, res) => {
  try {
    const { name, grade, length, width, thickness, 
      defaultPrice, lengthUnits, widthUnits,  thicknessUnits, priceUnits} = req.body;

    const newMaterial = await prisma.material.create({
      data: {
        name,
        grade,
        length: parseFloat(length),
        width: parseFloat(width),
        thickness: parseFloat(thickness),
        defaultPrice: parseFloat(defaultPrice),
        lengthUnits,
        widthUnits,
        thicknessUnits,
        priceUnits
      }
    });

    const newInventory = await prisma.inventory.create({
      data: {
        onHand: 0,
        allocated: 0,
        materialId: newMaterial.id
      }
    });

    res.status(201).json({ material: newMaterial, inventory: newInventory });
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
          inventory: { connect: { id: updatedInventory.id } },
          quantity: quantity,
          vendor: vendor,
          date: new Date()
        }
      });
    }

    res.json(updatedInventory);
  } catch (error) {
    res.status(500).json({ error: 'Inventory update failed' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});