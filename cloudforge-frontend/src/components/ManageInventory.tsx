// components/ManageInventory.tsx
import { useState } from 'react';
import axios from 'axios';
import { Material } from '../App';

interface Props {
  materials: Material[];
  onInventoryUpdated: () => void;
}

interface Purchase {
  id: string;
  quantity: number;
  vendor?: string;
  date: string;
}

export default function ManageInventory({ materials, onInventoryUpdated }: Props) {
  const [quantity, setQuantity] = useState('');
  const [vendor, setVendor] = useState('');
  const [operation, setOperation] = useState<'add' | 'remove'>('add');
  const [materialIndex, setMaterialIndex] = useState('0');
  const purchases: Purchase[] = materials[parseInt(materialIndex)]?.inventory?.purchases || [];
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    var materialId = materials[parseInt(materialIndex)].id;
    
    try { 
      await axios.put(`http://localhost:3000/inventory/${materialId}`, {
        operation,
        quantity: parseFloat(quantity),
        vendor: operation === 'add' ? vendor : undefined
      });
      
      setQuantity('');
      setVendor('');
      onInventoryUpdated();
    } catch (error) {
      console.error('Inventory update error:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
      <h3 className="font-medium mb-2 dark:text-white">Manage Inventory</h3>
      <form onSubmit={handleSubmit} className="flex gap-4 items-end">
        <select
        value={materialIndex}
        onChange={(e) => setMaterialIndex(e.currentTarget.value)}
        className="py-2 px-4 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
        {materials.map((material, index) => (
            <option key={material.id} value={index.toString()}>
                {material.name}
            </option>
        ))}
        </select>
        <select 
          value={operation}
          onChange={(e) => setOperation(e.target.value as 'add' | 'remove')}
          className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="add">Receive Stock</option>
          <option value="remove">Adjust Stock</option>
        </select>

        <div>
          <label className="block text-sm mb-1 dark:text-gray-300">
            {operation === 'add' ? 'Quantity Received' : 'Quantity to Remove'}
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-2 border rounded w-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {operation === 'add' && (
          <div>
            <label className="block text-sm mb-1 dark:text-gray-300">
              Vendor
            </label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900"
        >
          {operation === 'add' ? 'Receive' : 'Adjust'}
        </button>
      </form>
      <div className="mt-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          {showHistory ? 'Hide Purchase History' : 'Show Purchase History'}
        </button>

        {showHistory && (
          <div className="mt-2 max-h-48 overflow-y-auto">
            <h4 className="font-medium mb-2 dark:text-white">Purchase History</h4>
            {purchases.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No purchase history available</p>
            ) : (
              <div className="space-y-2">
                {purchases.map((purchase) => (
                  <div 
                    key={purchase.id}
                    className="p-2 bg-white dark:bg-gray-700 rounded border dark:border-gray-600"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 dark:text-gray-200">
                        {new Date(purchase.date).toLocaleDateString()}
                      </span>
                      <span className="font-medium dark:text-white">
                        +{purchase.quantity}
                      </span>
                    </div>
                    {purchase.vendor && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Vendor: {purchase.vendor}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-2 text-sm dark:text-gray-300">
        Current On Hand: {materials[parseInt(materialIndex)]?.inventory?.onHand || '0'}
      </div>
    </div>
  );
}