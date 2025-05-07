import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { loadingAuth } = useAuth(); // Chỉ cần loadingAuth từ context

  // *** JWT Change: Lấy token trực tiếp từ localStorage để kiểm tra ***
  const token = localStorage.getItem('authToken');

  if (loadingAuth) {
    // Vẫn hiển thị loading trong khi context kiểm tra trạng thái ban đầu
    return <div className="text-center text-white py-10">Đang kiểm tra xác thực...</div>;
  }

  // *** JWT Change: Điều hướng dựa trên sự tồn tại của token ***
  // Nếu không có token, điều hướng về trang login
  return token ? <Outlet /> : <Navigate to="/login" replace />;

  // Cách cũ dựa vào userInfo (vẫn có thể dùng nếu bạn muốn đảm bảo userInfo đã được load):
  // const { userInfo, loadingAuth } = useAuth();
  // if (loadingAuth) {
  //   return <div>Loading...</div>;
  // }
  // return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;