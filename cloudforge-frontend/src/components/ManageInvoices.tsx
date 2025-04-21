import { useEffect, useState } from 'react';
import axios from 'axios';

import { SalesOrder } from './ManageSalesOrders';

interface Props {
  ship: number;
}

interface Invoice {
  id: string;
  number: string;
  total: number;
  dueDate: string;
  status: string;
  salesOrder: SalesOrder;
  payments: Payment[];
}

interface Payment {
  amount: number;
  method: string;
  paidAt: string;
}

export default function ManageInvoices({ship}: Props) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [invoiceIndex, setInvoiceIndex] = useState(0);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/invoices');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const makePayment = async (invoiceId: string) => {
    try {
      await axios.post(`http://localhost:3000/invoices/${invoiceId}/payments`, {
        amount: parseFloat(paymentAmount)
      });
      fetchInvoices();
      setPaymentAmount('');
      alert('Payment recorded!');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment processing failed');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [ship]);

  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Invoices</h2>
      
      <div className="space-y-4">
        {invoices.map((invoice, index) => (
          <div key={invoice.id} className="border rounded-lg p-4 dark:border-gray-600">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium dark:text-white">
                  Invoice #{invoice.number} - ${invoice.total.toFixed(2)}
                </h3>
                <p className="text-sm dark:text-gray-400">
                  Due: {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 text-sm rounded ${
                invoice.status === 'PAID' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
              }`}>
                {invoice.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex gap-4">
                <input
                  type="number"
                  value={index === invoiceIndex ? paymentAmount : ''}
                  onChange={(e) => 
                    {
                      setInvoiceIndex(index);
                      setPaymentAmount(e.target.value)
                    }
                  }
                  placeholder="Payment amount"
                  className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  onClick={() => makePayment(invoice.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900"
                >
                  Record Payment
                </button>
              </div>
            </div>

            <div className="text-sm dark:text-gray-300 mb-4">
              {invoice.payments.map(payment => (
                <div key={payment.paidAt}>
                  ${payment.amount.toFixed(2)} paid on {new Date(payment.paidAt).toLocaleDateString()}
                </div>
              ))}
            </div>

            <div key={invoice.salesOrder.quote.id} className="border rounded-lg p-4 dark:border-gray-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium dark:text-white">
                    {invoice.salesOrder.quote.customerName} - ${invoice.salesOrder.quote.total.toFixed(2)}
                  </h3>
                </div>
                <div className="mb-4">
                {invoice.salesOrder.quote.items.map(item => (
                  <div key={item.material.id} className="text-sm dark:text-gray-300">
                    {item.material.name + " (" + item.material.grade + ")"}: {item.quantity} × ${item.price.toFixed(2)} per {item.material.priceUnits}

                  </div>
                ))}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}