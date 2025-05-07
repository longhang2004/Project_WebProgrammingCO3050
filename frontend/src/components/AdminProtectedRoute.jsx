// File: frontend/src/components/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { userInfo, loadingAuth } = useAuth();

  if (loadingAuth) {
    // Hiển thị loading trong khi context kiểm tra trạng thái ban đầu
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="text-xl font-semibold text-gray-700">Đang kiểm tra quyền truy cập...</div>
        </div>
    );
  }

  // Kiểm tra xem user đã đăng nhập và có phải là admin không
  if (!userInfo) {
    // Nếu chưa đăng nhập, chuyển hướng về trang login, lưu lại trang admin họ muốn vào
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  if (!userInfo.is_admin) {
    // Nếu đăng nhập nhưng không phải admin, chuyển hướng về trang chủ hoặc trang "Không có quyền"
    // console.warn("AdminProtectedRoute: User is not an admin. Redirecting.");
    return <Navigate to="/" replace />; // Hoặc đến trang /unauthorized
  }

  // Nếu là admin, cho phép truy cập
  // Nếu `children` được truyền vào (như trường hợp của AdminLayout), render `children`.
  // Nếu không, render `<Outlet />` cho các nested routes.
  return children ? children : <Outlet />;
};

export default AdminProtectedRoute;
