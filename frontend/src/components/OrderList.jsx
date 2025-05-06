import { useState, useEffect } from 'react';
import api from '../api/api';

function OrderList({ onEdit, onDelete }) {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      const response = await api.get(`/order?page=${page}&per_page=${perPage}`);
      setOrders(response.data.orders);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, perPage]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Orders Management</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">User ID</th>
            <th className="p-2 border">Total Price</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Payment Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id} className="hover:bg-gray-100">
              <td className="p-2 border">{order.order_id}</td>
              <td className="p-2 border">{order.user_id}</td>
              <td className="p-2 border">${order.total_price}</td>
              <td className="p-2 border">{order.status}</td>
              <td className="p-2 border">{order.payment_status}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => onEdit(order)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(order.order_id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Next
        </button>
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="p-2 border rounded"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={30}>30 per page</option>
        </select>
      </div>
    </div>
  );
}

export default OrderList;