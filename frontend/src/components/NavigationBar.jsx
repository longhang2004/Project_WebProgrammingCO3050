// src/components/NavigationBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUserCircle, FaBars, FaTimes, FaChevronDown, FaChevronUp, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import useCart

function NavigationBar() {
    // ... (các state và refs khác giữ nguyên) ...
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isMobileCategoryDropdownOpen, setIsMobileCategoryDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const { userInfo, logout, loadingAuth } = useAuth();
    const { cartItemCount } = useCart(); // Lấy số lượng từ CartContext

    const location = useLocation();
    const categoryDropdownRef = useRef(null);
    const profileDropdownRef = useRef(null);
    const mobileDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // ... (useEffect và các hàm toggle giữ nguyên) ...
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsCategoryDropdownOpen(false);
        setIsMobileCategoryDropdownOpen(false);
        setIsProfileDropdownOpen(false);
    }, [location]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target) && !event.target.closest('.category-button')) {
                setIsCategoryDropdownOpen(false);
            }
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target) && !event.target.closest('.profile-button')) {
                setIsProfileDropdownOpen(false);
            }
            if (isMobileMenuOpen) {
                if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
                    setIsMobileMenuOpen(false);
                }
                if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target) && !event.target.closest('.mobile-category-button')) {
                    setIsMobileCategoryDropdownOpen(false);
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = (e) => { e.stopPropagation(); setIsMobileMenuOpen(!isMobileMenuOpen); if (isMobileMenuOpen) setIsMobileCategoryDropdownOpen(false); };
    const toggleCategoryDropdown = (e) => { e.stopPropagation(); setIsCategoryDropdownOpen(!isCategoryDropdownOpen); setIsProfileDropdownOpen(false); };
    const toggleProfileDropdown = (e) => { e.stopPropagation(); setIsProfileDropdownOpen(!isProfileDropdownOpen); setIsCategoryDropdownOpen(false); };
    const toggleMobileCategoryDropdown = (e) => { e.stopPropagation(); setIsMobileCategoryDropdownOpen(!isMobileCategoryDropdownOpen); };

    const handleLogout = () => {
        setIsProfileDropdownOpen(false);
        logout();
    };

    const categoryDropdownItems = [
        { name: 'Phụ kiện', path: '/accessories' },
        { name: 'Khuyến mãi', path: '/promotions' },
        { name: 'Tin tức', path: '/blog' },
    ];


    if (loadingAuth) { // Vẫn giữ kiểm tra loadingAuth
        return <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50 h-[64px]"></nav>;
    }

    return (
        <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* ... (Logo và Nav links giữ nguyên) ... */}
                <div className="flex items-center flex-shrink-0">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
                        <img src="https://abcmediagroup.co.uk/wp-content/uploads/2024/04/abc-logo-1-2-300x171.png" alt="Logo" className="h-10" />
                    </Link>
                </div>
                <ul className="hidden md:flex items-center gap-6 lg:gap-8 font-medium">
                    <li><Link to="/" className="hover:text-blue-200 transition duration-200">Trang chủ</Link></li>
                    <li><Link to="/phone" className="hover:text-blue-200 transition duration-200">Điện thoại</Link></li>
                    <li><Link to="/laptop" className="hover:text-blue-200 transition duration-200">Laptop</Link></li>
                    {/* <li><Link to="/tablet" className="hover:text-blue-200 transition duration-200">Tablet</Link></li> */}
                    <li className="relative" ref={categoryDropdownRef}>
                        <button
                            className="category-button flex items-center hover:text-blue-200 transition duration-200 focus:outline-none"
                            onClick={toggleCategoryDropdown} aria-haspopup="true" aria-expanded={isCategoryDropdownOpen}
                        >
                            Danh mục khác {isCategoryDropdownOpen ? <FaChevronUp className="ml-1 w-3 h-3" /> : <FaChevronDown className="ml-1 w-3 h-3" />}
                        </button>
                        <div className={`absolute left-1/2 -translate-x-1/2 mt-3 w-48 bg-white text-gray-800 shadow-xl rounded-md overflow-hidden transition-all duration-300 ease-in-out transform origin-top z-30 ${isCategoryDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <ul className="py-2"> {categoryDropdownItems.map((item) => (<li key={item.name}><Link to={item.path} className="block px-4 py-2 text-sm hover:bg-blue-50 transition duration-200" onClick={() => setIsCategoryDropdownOpen(false)}>{item.name}</Link></li>))} </ul>
                        </div>
                    </li>
                    <li><Link to="/about" className="hover:text-blue-200 transition duration-200">Giới thiệu</Link></li>
                    <li><Link to="/faq" className="hover:text-blue-200 transition duration-200">Hỏi đáp</Link></li>
                    <li><Link to="/contact" className="hover:text-blue-200 transition duration-200">Liên hệ</Link></li>
                </ul>

                <div className="flex items-center gap-3 md:gap-4">
                    <div className="hidden sm:flex items-center bg-white/20 rounded-full px-3 py-1 focus-within:bg-white/30 transition-colors duration-300">
                        <FaSearch className="text-white/70 mr-2" />
                        <input type="text" placeholder="Tìm kiếm..." className="bg-transparent text-white placeholder-white/70 text-sm focus:outline-none w-24 md:w-32 lg:w-40" />
                    </div>
                    {userInfo ? (
                        <div className="relative" ref={profileDropdownRef}>
                            <button onClick={toggleProfileDropdown} className="profile-button p-1 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white" title="Tài khoản" aria-haspopup="true" aria-expanded={isProfileDropdownOpen}>
                                <img src={userInfo.imageurl || '/avt.png'} alt="Avatar" className='h-7 w-7 rounded-full object-cover' />
                            </button>
                            <div className={`absolute right-0 mt-3 w-48 bg-white text-gray-800 shadow-xl rounded-md overflow-hidden transition-all duration-300 ease-in-out transform origin-top-right z-30 ${isProfileDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-900 truncate">{userInfo.username || `${userInfo.first_name} ${userInfo.last_name}`}</p>
                                    <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                                </div>
                                <ul className="py-1">
                                    <li><Link to="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-blue-50 transition duration-200" onClick={() => setIsProfileDropdownOpen(false)}><FaUserEdit className="mr-2" /> Hồ sơ cá nhân</Link></li>
                                    <li><button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition duration-200"><FaSignOutAlt className="mr-2" /> Đăng xuất</button></li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login"> <button className="bg-white text-blue-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200"> Đăng nhập </button> </Link>
                    )}

                    {/* Cart Icon - CẬP NHẬT SỐ LƯỢNG */}
                    <Link to="/cart" className="relative hover:text-blue-200 transition duration-200 p-1 rounded-full hover:bg-white/10" title="Giỏ hàng">
                        <FaShoppingCart className="h-6 w-6" />
                        {/* Hiển thị số lượng nếu lớn hơn 0 */}
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white focus:outline-none mobile-menu-button" onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={isMobileMenuOpen}>
                        {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Panel */}
            {/* ... (Giữ nguyên cấu trúc mobile menu, phần user action đã được cập nhật ở lần trước) ... */}
            <div ref={mobileMenuRef} className={`absolute top-full left-0 right-0 bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg md:hidden overflow-y-auto transition-all duration-300 ease-in-out z-40 ${isMobileMenuOpen ? 'max-h-[calc(100vh-64px)] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pt-4 pb-6 space-y-3">
                    <div className="flex sm:hidden items-center bg-white/20 rounded-md px-3 py-2 focus-within:bg-white/30 transition-colors duration-300 w-full"> <FaSearch className="text-white/70 mr-2" /> <input type="text" placeholder="Tìm kiếm sản phẩm..." className="bg-transparent text-white placeholder-white/70 text-sm focus:outline-none w-full" /> </div>
                    <Link to="/" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Trang chủ</Link>
                    <Link to="/phone" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Điện thoại</Link>
                    <Link to="/laptop" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Laptop</Link>
                    {/* <Link to="/tablet" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Tablet</Link> */}
                    <div ref={mobileDropdownRef}>
                        <button className="mobile-category-button flex justify-between items-center w-full py-2 rounded hover:bg-white/10 px-3 transition duration-200 focus:outline-none" onClick={toggleMobileCategoryDropdown} aria-haspopup="true" aria-expanded={isMobileCategoryDropdownOpen}>
                            <span>Danh mục khác</span> {isMobileCategoryDropdownOpen ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out pl-4 ${isMobileCategoryDropdownOpen ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <ul className="py-1 space-y-1"> {categoryDropdownItems.map((item) => (<li key={'mobile-' + item.name}><Link to={item.path} className="block py-1.5 px-2 text-sm rounded hover:bg-white/10 transition duration-200">{item.name}</Link></li>))} </ul>
                        </div>
                    </div>
                    <Link to="/about" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Giới thiệu</Link>
                    <Link to="/faq" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Hỏi đáp</Link>
                    <Link to="/contact" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Liên hệ</Link>
                    <hr className="border-white/20 my-3" />
                    {userInfo ? (
                        <>
                            <Link to="/profile" className="flex items-center py-2 rounded hover:bg-white/10 px-3 transition duration-200"> <FaUserEdit className="mr-2" /> Hồ sơ cá nhân </Link>
                            <button onClick={handleLogout} className="flex items-center w-full text-left py-2 rounded text-red-300 hover:bg-red-500/30 px-3 transition duration-200"> <FaSignOutAlt className="mr-2" /> Đăng xuất </button>
                        </>
                    ) : (
                        <Link to="/login" className="block w-full"> <button className="w-full bg-white text-blue-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200 mt-2"> Đăng nhập / Đăng ký </button> </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavigationBar;
