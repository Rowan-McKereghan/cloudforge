// components/CreateQuote.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Material } from './App';
import { Link } from 'react-router-dom';
import ViewQuotes from './components/ViewQuotes';
import ManageSalesOrders from './components/ManageSalesOrders';
import ManageInvoices from './components/ManageInvoices';


interface QuoteItem {
  materialId: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Props {
  getAndSetMats: () => void
}

export default function QuoteBuilder({getAndSetMats}: Props) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [total, setTotal] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [approve, setApprove] = useState(0);
  const [ship, setShip] = useState(0);


  // Fetch initial data
  useEffect(() => {
    axios.get(import.meta.env.LIVE_URL + '/materials').then(res => setMaterials(res.data));
  }, []);

  // Calculate total when items change
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setTotal(Number(newTotal.toFixed(2)));
  }, [items]);

  const addItem = () => {
    setItems([...items, {
      materialId: materials[0]?.id || '',
      quantity: 1,
      price: materials[0]?.defaultPrice || 0,
      notes: ''
    }]);
  };

  const submitQuote = async () => {
    const quoteData = {
      customerName: selectedCustomer,
      items: items.map(item => ({
        materialId: item.materialId,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes
      })),
      total
    };

    try {
      await axios.post(import.meta.env.LIVE_URL + '/quotes', quoteData);
      setToggle(!toggle);
      // Reset form or redirect
    } catch (error) {
      console.error('Quote submission failed:', error);
    }
  };

  return (
    <div>
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6">Metal Service Center Dashboard</h1>
          
        <nav className="mb-8">
        <Link to={'/'}>
            <button className="mr-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
                Product Catalog
            </button>
        </Link>
        <Link to={'/quotes'}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900">
            Quotes
            </button>
        </Link>
        </nav>
      
      {/* Customer Selection */}
      <div className="w-full mb-6">
      <label className="block text-sm mb-1 dark:text-gray-300">
              Customer
            </label>
            <input
              type="text"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
      </div>

      {/* Quote Items */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium dark:text-white">Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-800"
          >
            Add Item
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 mb-4">
            {/* Material Selection */}
            <div className="col-span-4">
              <select
                value={item.materialId}
                onChange={(e) => {
                  const newItems = [...items];
                  const selectedMat = materials.find(m => m.id === e.target.value);
                  newItems[index].materialId = e.target.value;
                  newItems[index].price = selectedMat?.defaultPrice || 0;
                  setItems(newItems);
                }}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {materials.map(material => (
                  <option key={material.id} value={material.id}>
                    {material.name} ({material.grade})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="col-span-2">
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={item.quantity}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].quantity = Number(e.target.value);
                  setItems(newItems);
                }}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Price */}
            <div className="col-span-3">
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.price}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].price = Number(e.target.value);
                  setItems(newItems);
                }}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <input
                type="text"
                value={item.notes || ''}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].notes = e.target.value;
                  setItems(newItems);
                }}
                placeholder="Notes"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Remove Button */}
            <div className="col-span-1">
              <button
                type="button"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
                className="text-red-600 hover:text-red-800 dark:text-red-400"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Expiration & Total */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        
        <div className="text-right">
          <p className="text-lg font-semibold dark:text-white">
            Total: ${total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Submission */}
      <button
        type="button"
        onClick={submitQuote}
        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900"
      >
        Create Quote
      </button>
    </div>
    <ViewQuotes buttonClick={toggle} getAndSetMats={getAndSetMats} 
    approve={approve} setApprove={setApprove}/>
    <ManageSalesOrders approve={approve} ship={ship} setShip={setShip}/>
    <ManageInvoices ship={ship}/>
    </div>
  );
}