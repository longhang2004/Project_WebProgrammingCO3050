import { useState, useEffect } from 'react';
import api from '../api/api';

function ProductListAdmin({ onEdit, onDelete }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await api.get(`/product?page=${page}&per_page=${perPage}`);
      setProducts(response.data.products);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Tìm kiếm sản phẩm theo tên
  const searchProducts = async () => {
    if (!searchTerm) {
      fetchProducts();
      return;
    }
    try {
      const response = await api.get(`/product/search?name=${searchTerm}`);
      setProducts(response.data.products);
      setTotalPages(1);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, perPage]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Products Management</h2>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full max-w-md"
        />
        <button
          onClick={searchProducts}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id} className="hover:bg-gray-100">
              <td className="p-2 border">{product.product_id}</td>
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">${product.price}</td>
              <td className="p-2 border">{product.stock}</td>
              <td className="p-2 border">{product.type}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.product_id)}
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
          <option value={12}>12 per page</option>
          <option value={24}>24 per page</option>
          <option value={36}>36 per page</option>
        </select>
      </div>
    </div>
  );
}

export default ProductListAdmin;