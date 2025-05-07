//frontend/src/pages/public/RegisterPage
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link để quay lại login, useNavigate để chuyển hướng

function RegisterPage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        phone_number: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        setSuccess('');

        // --- Validation cơ bản phía Client ---
        if (formData.password !== formData.confirm_password) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }
        if (formData.password.length < 6) { // Ví dụ: yêu cầu mật khẩu tối thiểu 6 ký tự
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        // Thêm các validation khác nếu cần (email hợp lệ, không bỏ trống...)

        setLoading(true);

        try {
            // Loại bỏ confirm_password trước khi gửi đi
            const { confirm_password, ...dataToSend } = formData;

            const response = await fetch('http://localhost/Project_WebProgrammingCO3050/backend/api/user/register', { // Thay đổi URL nếu cần
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                // Lấy lỗi từ backend hoặc báo lỗi chung
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            // Đăng ký thành công
            setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
            // Reset form
            setFormData({
                first_name: '', last_name: '', username: '', email: '',
                password: '', confirm_password: '', phone_number: '', address: ''
            });
            // Tùy chọn: Tự động chuyển hướng sang trang đăng nhập sau vài giây
            setTimeout(() => {
                navigate('/login'); // Chuyển hướng đến trang đăng nhập
            }, 2000); // Sau 2 giây

        } catch (err) {
            console.error('Lỗi đăng ký:', err);
            setError(err.message || 'Đã có lỗi xảy ra trong quá trình đăng ký.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Đăng Ký Tài Khoản Mới
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-center text-red-500 bg-red-100 p-2 rounded">{error}</p>}
                    {success && <p className="text-center text-green-500 bg-green-100 p-2 rounded">{success}</p>}

                    {/* Các trường input */}
                    <div className="rounded-md shadow-sm -space-y-px grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="first_name" className="sr-only">Tên</label>
                            <input id="first_name" name="first_name" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Tên" value={formData.first_name} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="sr-only">Họ</label>
                            <input id="last_name" name="last_name" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Họ" value={formData.last_name} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="username" className="sr-only">Tên đăng nhập</label>
                            <input id="username" name="username" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Tên đăng nhập" value={formData.username} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="email" className="sr-only">Địa chỉ email</label>
                            <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Địa chỉ email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="phone_number" className="sr-only">Số điện thoại</label>
                            <input id="phone_number" name="phone_number" type="tel" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Số điện thoại" value={formData.phone_number} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="address" className="sr-only">Địa chỉ</label>
                            <input id="address" name="address" type="text" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Mật khẩu</label>
                            <input id="password" name="password" type="password" autoComplete="new-password" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="confirm_password" className="sr-only">Xác nhận mật khẩu</label>
                            <input id="confirm_password" name="confirm_password" type="password" autoComplete="new-password" required className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Xác nhận mật khẩu" value={formData.confirm_password} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={loading} className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                        </button>
                    </div>
                </form>

                <div className="text-sm text-center">
                    <span className="text-gray-400">Đã có tài khoản? </span>
                    <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;