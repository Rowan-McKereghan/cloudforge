import { useEffect, useState } from 'react';
import axios from 'axios';

import { Material } from '../App';

interface Props {
    buttonClick: boolean
    getAndSetMats: () => void
    approve: number
    setApprove: (e: number) => void
}

export interface Quote {
  id: string;
  customerName: string;
  total: number;
  status: string;
  items: QuoteItem[];
}

interface QuoteItem {
    material: Material;
    quantity: number;
    price: number;
    notes?: string;
  }

export default function ViewQuotes({buttonClick, getAndSetMats, approve, setApprove}: Props) {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const fetchQuotes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/quotes');
      setQuotes(response.data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const approveQuote = async (quoteId: string) => {
    try {
      await axios.post(`http://localhost:3000/quotes/${quoteId}/approve`);
      fetchQuotes();
      getAndSetMats();
      setApprove(approve + 1);
      alert('Quote approved and sales order created!');
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Approval failed - check inventory levels');
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [buttonClick]);

  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Quotes</h2>
      
      <div className="space-y-4">
        {quotes.map(quote => (
          <div key={quote.id} className="border rounded-lg p-4 dark:border-gray-600">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium dark:text-white">
                  {quote.customerName} - ${quote.total.toFixed(2)}
                </h3>
              </div>
              <span className={`px-2 py-1 text-sm rounded ${
                quote.status === 'APPROVED' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
              }`}>
                {quote.status}
              </span>
            </div>
            
            <div className="mb-4">
              {quote.items.map(item => (
                <div key={item.material.id} className="text-sm dark:text-gray-300">
                  {item.material.name + " (" + item.material.grade + ")"}: {item.quantity} × ${item.price.toFixed(2)} per {item.material.priceUnits}
                </div>
              ))}
            </div>

            {quote.status === 'DRAFT' && (
              <button
                onClick={() => approveQuote(quote.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900"
              >
                Approve Quote
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}