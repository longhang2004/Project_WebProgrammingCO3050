// src/components/MobileMenu.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaChevronDown, FaChevronUp, FaUserCircle, FaShoppingCart, FaPhoneAlt, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';
import SearchBar from './SearchBar'; // Tái sử dụng SearchBar

// Lấy lại cấu trúc categories từ NavigationBar hoặc import từ file chung
const categories = [
    { name: 'Điện thoại', path: '/phone', subCategories: [{ name: 'iPhone', path: '/phone/iphone' }, { name: 'Samsung', path: '/phone/samsung' }] },
    { name: 'Laptop', path: '/laptop', subCategories: [{ name: 'MacBook', path: '/laptop/macbook' }, { name: 'Laptop Gaming', path: '/laptop/gaming' }] },
    { name: 'Tablet', path: '/tablet' },
    { name: 'Phụ kiện', path: '/accessories', subCategories: [{ name: 'Sạc, cáp', path: '/accessories/cables' }, { name: 'Tai nghe', path: '/accessories/headphones' }] },
    { name: 'Khuyến mãi', path: '/deals', highlight: true },
];

// Placeholder
const placeholderUser = { name: 'Long' }; // null nếu chưa đăng nhập
const placeholderCartItemCount = 3; // 0 nếu giỏ hàng trống


function MobileMenu({ isOpen, onClose }) {
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
    const user = placeholderUser;
    const cartItemCount = placeholderCartItemCount;

    const toggleMobileDropdown = (categoryName) => {
        setOpenMobileDropdown(openMobileDropdown === categoryName ? null : categoryName);
    };

    // Ngăn cuộn trang nền khi menu mở
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);


    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose} // Đóng khi click vào overlay
                aria-hidden="true"
            ></div>

            {/* Mobile Menu Panel */}
            <div
                className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-menu-title"
            >
                {/* Header Menu */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    {user ? (
                        <Link to="/profile" onClick={onClose} className="flex items-center gap-2 text-sm font-medium text-blue-600">
                            <FaUserCircle className="h-5 w-5" />
                            <span>{user.name}</span>
                        </Link>
                    ) : (
                        <Link to="/login" onClick={onClose} className="text-sm font-medium text-blue-600 hover:underline">Đăng nhập / Đăng ký</Link>
                    )}
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Đóng menu">
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>

                {/* Content Menu */}
                <div className="p-4 overflow-y-auto h-[calc(100%-57px)]"> {/* 57px là chiều cao header menu ước tính */}
                    {/* Search Bar */}
                    <div className="mb-4">
                        <SearchBar />
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1 mb-6">
                        {categories.map((category) => (
                            <div key={'mobile-' + category.name}>
                                {category.subCategories ? (
                                    <>
                                        <button
                                            onClick={() => toggleMobileDropdown(category.name)}
                                            className={`flex justify-between items-center w-full py-2 px-3 rounded text-left text-gray-700 hover:bg-gray-100 ${category.highlight ? 'text-red-600 font-bold' : ''}`}
                                            aria-expanded={openMobileDropdown === category.name}
                                        >
                                            <span>{category.name}</span>
                                            {openMobileDropdown === category.name ? <FaChevronUp className="w-3 h-3 text-gray-500" /> : <FaChevronDown className="w-3 h-3 text-gray-500" />}
                                        </button>
                                        {/* Submenu */}
                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out pl-6 ${openMobileDropdown === category.name ? 'max-h-96' : 'max-h-0'}`}>
                                            <ul className="py-1 space-y-1">
                                                {category.subCategories.map((sub) => (
                                                    <li key={'mobile-sub-' + sub.name}>
                                                        <Link to={sub.path} onClick={onClose} className="block py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded px-2">
                                                            {sub.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={category.path}
                                        onClick={onClose}
                                        className={`block py-2 px-3 rounded text-gray-700 hover:bg-gray-100 ${category.highlight ? 'text-red-600 font-bold' : ''}`}
                                    >
                                        {category.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                        <Link to="/blog" onClick={onClose} className="block py-2 px-3 rounded text-gray-700 hover:bg-gray-100">Tin Công Nghệ</Link>
                        <Link to="/contact" onClick={onClose} className="block py-2 px-3 rounded text-gray-700 hover:bg-gray-100">Liên hệ</Link>
                    </nav>

                    {/* Utility Links (từ TopBar) */}
                    <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                        <Link to="/cart" onClick={onClose} className="flex items-center gap-2 py-1.5 text-gray-600 hover:text-blue-600">
                            <FaShoppingCart className="w-4 h-4" />
                            <span>Giỏ hàng ({cartItemCount})</span>
                        </Link>
                        <a href="tel:18001234" className="flex items-center gap-2 py-1.5 text-gray-600 hover:text-blue-600">
                            <FaPhoneAlt className="w-4 h-4" />
                            <span>Hotline: 1800.1234</span>
                        </a>
                        <Link to="/stores" onClick={onClose} className="flex items-center gap-2 py-1.5 text-gray-600 hover:text-blue-600">
                            <FaMapMarkerAlt className="w-4 h-4" />
                            <span>Hệ thống cửa hàng</span>
                        </Link>
                        <Link to="/order-tracking" onClick={onClose} className="flex items-center gap-2 py-1.5 text-gray-600 hover:text-blue-600">
                            <FaTruck className="w-4 h-4" />
                            <span>Theo dõi đơn hàng</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MobileMenu;