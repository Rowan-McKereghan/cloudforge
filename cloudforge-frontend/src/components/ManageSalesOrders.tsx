import { useEffect, useState } from 'react';
import axios from 'axios';

import { Quote } from './ViewQuotes'

interface Props {
  approve: number;
  ship: number;
  setShip: (e: number) => void
}

export interface SalesOrder {
  id: string;
  quote: Quote;
  customerName: string;
  total: number;
  shipments: Shipment[];
}

interface Shipment {
  id: string;
  carrier: string;
  tracking: string;
  estimatedDelivery: string;
}

export default function ManageSalesOrders({approve, ship, setShip}: Props) {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');
  const [estimateDate, setEstimateDate] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/sales-orders');
      setOrders(response.data);
      setShip(ship + 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const createShipment = async () => {
    try {
      await axios.post(`http://localhost:3000/sales-orders/${selectedOrder}/shipments`, {
        carrier,
        tracking,
        estimatedDelivery: estimateDate
      });
      fetchOrders();
      alert('Shipment created and invoice generated!');
    } catch (error) {
      console.error('Shipment failed:', error);
      alert('Shipment creation failed');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [approve]);

  return (
    <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Sales Orders</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(e.target.value)}
          className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Select Sales Order</option>
          {orders.map(order => (
            <option key={order.id} value={order.id}>
              {order.customerName} - ${order.quote.total.toFixed(2)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Carrier"
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <input
          type="text"
          placeholder="Tracking Number"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            Estimated Delivery Date
          </label>
          <input
            type="date"
            value={estimateDate}
            onChange={(e) => setEstimateDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

      <button
        onClick={createShipment}
        disabled={!selectedOrder}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-800 dark:hover:bg-blue-900"
      >
        Create Shipment
      </button>

      <div className="mt-4 space-y-2">
        {orders.map(order => (
          order.shipments.map(shipment => (
            <div key={shipment.id} className="text-sm dark:text-gray-300">
              {shipment.carrier} - {shipment.tracking}
            </div>
          ))
        ))}
      </div>
    </div>
    </div>
  );
}