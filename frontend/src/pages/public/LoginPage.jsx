// src/pages/public/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Không cần useNavigate ở đây nữa
import { useAuth } from '../../context/AuthContext'; // Import useAuth

function LoginPage() {
    const [formData, setFormData] = useState({
        username_or_email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Lấy hàm login từ context

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

            // Gọi hàm login từ Context để cập nhật state và điều hướng
            login(result.data.user);

            // Không cần xử lý localStorage hay navigate ở đây nữa

        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
            setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // --- Phần JSX của form giữ nguyên ---
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
               {/* ... Các phần khác của form ... */}
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