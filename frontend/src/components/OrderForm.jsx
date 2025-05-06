import { useState, useEffect } from 'react';
import api from '../api/api';

function OrderForm({ order, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    status: 'pending',
    payment_status: 'pending',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || 'pending',
        payment_status: order.payment_status || 'pending',
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/order/${order.order_id}`, formData);
      onSave();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-lg mx-auto">
      <h3 className="text-xl font-bold mb-4">Edit Order</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Order Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Status</label>
          <select
            name="payment_status"
            value={formData.payment_status}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default OrderForm;