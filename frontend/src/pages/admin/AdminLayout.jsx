// File: frontend/src/pages/admin/AdminLayout.jsx
import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaFileAlt, FaSignOutAlt, FaComments, FaQuestionCircle, FaStarHalfAlt } from 'react-icons/fa'; // Thêm FaStarHalfAlt

const AdminLayout = () => {
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!userInfo) {
        console.log("AdminLayout: userInfo is null, ProtectedRoute should handle redirection.");
        return null;
    }

    if (!userInfo.is_admin) {
        console.warn("AdminLayout: User is not an admin. Redirecting to home.");
        navigate('/');
        return null;
    }

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
        { name: 'Sản phẩm', path: '/admin/products', icon: FaBoxOpen },
        { name: 'Đơn hàng', path: '/admin/orders', icon: FaShoppingCart }, // Đã có
        { name: 'Người dùng', path: '/admin/users', icon: FaUsers },       // Đã có
        { name: 'Bài viết', path: '/admin/posts', icon: FaFileAlt },         // Đã có
        // *** FIX: Sửa tên và thêm icon cho Đánh giá SP ***
        { name: 'Đánh giá SP', path: '/admin/reviews', icon: FaStarHalfAlt }, // Thay FaComments bằng FaStarHalfAlt cho rõ hơn
        // { name: 'Bình luận Blog', path: '/admin/comments', icon: FaComments }, // Tạm thời ẩn
        // { name: 'Hỏi & Đáp', path: '/admin/qna', icon: FaQuestionCircle },
    ];

    return (
        <div className="min-h-screen flex bg-gray-100 text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-gray-100 p-4 space-y-6 fixed h-full shadow-lg flex flex-col">
                <div className="text-center py-4 border-b border-gray-700">
                    <Link to="/admin/dashboard" className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">
                        Admin Panel
                    </Link>
                </div>
                <nav className="space-y-2 flex-grow">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            // Thêm 'end' cho dashboard để không bị active khi ở trang con
                            end={item.path === '/admin/dashboard'}
                            className={({ isActive }) =>
                                `flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${
                                    isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'
                                }`
                            }
                        >
                            <item.icon className="mr-3 flex-shrink-0" />
                            <span className="truncate">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="mt-auto">
                     <button
                        onClick={handleLogout}
                        className="flex items-center w-full py-2.5 px-4 rounded transition duration-200 bg-red-600 hover:bg-red-700 text-white"
                    >
                        <FaSignOutAlt className="mr-3" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-6 md:p-8 overflow-y-auto">
                <header className="bg-white shadow rounded-lg p-4 mb-6 sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-gray-700">
                        Xin chào, {userInfo.first_name || userInfo.username || 'Admin'}!
                    </h1>
                </header>
                <div className="bg-white shadow rounded-lg p-6 min-h-[calc(100vh-12rem)]">
                    <Outlet />
                </div>
                 <footer className="text-center text-sm text-gray-500 mt-8 py-4 border-t border-gray-300">
                    © {new Date().getFullYear()} Admin Panel.
                </footer>
            </main>
        </div>
    );
};

export default AdminLayout;
