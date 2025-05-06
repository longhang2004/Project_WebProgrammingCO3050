import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/api';
import Sidebar from '../../components/Sidebar';
import ProductListAdmin from '../../components/ProductListAdmin';
import ProductForm from '../../components/ProductForm';
import UserForm from '../../components/UserForm';
import OrderForm from '../../components/OrderForm';
import Modal from '../../components/Modal';

function AdminPage({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const location = useLocation();

  // Xử lý chỉnh sửa sản phẩm
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/product/${productId}`);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Xử lý chỉnh sửa người dùng
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Xử lý xóa người dùng
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/user/${userId}`);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Xử lý chỉnh sửa đơn hàng
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  // Xử lý xóa đơn hàng
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.delete(`/order/${orderId}`);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  // Xử lý lưu (sản phẩm, người dùng, hoặc đơn hàng)
  const handleSave = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setSelectedUser(null);
    setSelectedOrder(null);
    window.location.reload();
  };

  // Xác định nội dung hiển thị dựa trên route
  const isProductRoute = location.pathname === '/admin/products' || location.pathname === '/admin';
  const content = isProductRoute ? (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Create New Product
      </button>
      <ProductListAdmin onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
    </>
  ) : (
    children && React.cloneElement(children, {
      onEdit: children.type === UserList ? handleEditUser : handleEditOrder,
      onDelete: children.type === UserList ? handleDeleteUser : handleDeleteOrder,
    })
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-4">
          {content}
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            {selectedProduct && (
              <ProductForm
                product={selectedProduct}
                onSave={handleSave}
                onCancel={() => setModalOpen(false)}
              />
            )}
            {selectedUser && (
              <UserForm
                user={selectedUser}
                onSave={handleSave}
                onCancel={() => setModalOpen(false)}
              />
            )}
            {selectedOrder && (
              <OrderForm
                order={selectedOrder}
                onSave={handleSave}
                onCancel={() => setModalOpen(false)}
              />
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;