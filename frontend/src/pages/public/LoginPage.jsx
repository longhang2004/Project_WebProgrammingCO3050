// File: frontend/src/pages/public/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
    const [formData, setFormData] = useState({
        username_or_email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, userInfo } = useAuth(); // Lấy thêm userInfo để kiểm tra is_admin sau khi login
    const navigate = useNavigate();
    const location = useLocation(); // Để lấy state 'from' nếu có

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost/Project_WebProgrammingCO3050/backend/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            // --- Đăng nhập thành công ---
            console.log('Login successful:', result.data);

            if (result.data.token) {
                 localStorage.setItem('authToken', result.data.token);
                 console.log("Token saved to localStorage");
            } else {
                 console.error("Login response missing token!");
                 throw new Error("Authentication token not received from server.");
            }

            // Gọi hàm login từ Context để cập nhật userInfo state và localStorage
            // Hàm login trong context sẽ set userInfo, bao gồm cả is_admin
            login(result.data.user);

            // *** FIX: Chuyển hướng dựa trên vai trò admin và state 'from' ***
            const isAdmin = result.data.user?.is_admin; // Lấy is_admin từ kết quả API
            const from = location.state?.from?.pathname || (isAdmin ? "/admin/dashboard" : "/");
            // Ưu tiên state 'from' (nếu người dùng bị redirect từ trang admin về login)
            // Nếu không có 'from', admin thì vào dashboard, user thường thì về trang chủ

            console.log("Redirecting after login. Is Admin:", isAdmin, "Redirecting to:", from);
            navigate(from, { replace: true }); // Dùng replace để không lưu trang login vào history


        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
            setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
             localStorage.removeItem('authToken');
             localStorage.removeItem('userInfo'); // Đảm bảo xóa cả userInfo nếu login lỗi
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
           <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
             <div>
               <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                 Đăng Nhập Tài Khoản
               </h2>
             </div>
             <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
               <input type="hidden" name="remember" defaultValue="true" />
               {error && <p className="text-center text-red-500 bg-red-100 p-2 rounded">{error}</p>}
               <div className="rounded-md shadow-sm -space-y-px">
                 <div>
                   <label htmlFor="username_or_email" className="sr-only">Tên đăng nhập hoặc Email</label>
                   <input
                     id="username_or_email"
                     name="username_or_email"
                     type="text"
                     autoComplete="username"
                     required
                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm rounded-t-md"
                     placeholder="Tên đăng nhập hoặc Email"
                     value={formData.username_or_email}
                     onChange={handleChange}
                   />
                 </div>
                 <div>
                   <label htmlFor="password" className="sr-only">Mật khẩu</label>
                   <input
                     id="password"
                     name="password"
                     type="password"
                     autoComplete="current-password"
                     required
                     className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm rounded-b-md"
                     placeholder="Mật khẩu"
                     value={formData.password}
                     onChange={handleChange}
                   />
                 </div>
               </div>
               <div>
                 <button type="submit" disabled={loading} className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                   {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                 </button>
               </div>
             </form>
              <div className="text-sm text-center">
                <span className="text-gray-400">Chưa có tài khoản? </span>
                <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
                    Đăng ký ngay
                </Link>
            </div>
           </div>
         </div>
    );
}

export default LoginPage;
