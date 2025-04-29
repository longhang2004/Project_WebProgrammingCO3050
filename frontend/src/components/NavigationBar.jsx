// src/components/NavigationBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Import icons
import { FaSearch, FaShoppingCart, FaUserCircle, FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Placeholder data (Giống như trong Header cũ của bạn)
const placeholderUser = { name: 'Long' };
const placeholderCart = [];

function NavigationBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isMobileCategoryDropdownOpen, setIsMobileCategoryDropdownOpen] = useState(false);

    const user = placeholderUser; // Sử dụng placeholder hoặc lấy từ Redux/Context
    const cart = placeholderCart; // Sử dụng placeholder hoặc lấy từ Redux/Context

    const location = useLocation(); // Hook để lấy location hiện tại
    const dropdownRef = useRef(null); // Ref cho dropdown desktop
    const mobileDropdownRef = useRef(null); // Ref cho dropdown mobile
    const mobileMenuRef = useRef(null); // Ref cho mobile menu tổng

    // Đóng menu/dropdown khi click ra ngoài hoặc chuyển trang
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsCategoryDropdownOpen(false);
        setIsMobileCategoryDropdownOpen(false);
    }, [location]); // Đóng khi chuyển trang

    // Đóng dropdown khi click ra ngoài (cho desktop)
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    // Đóng mobile menu/dropdown khi click ra ngoài
    useEffect(() => {
        function handleClickOutsideMobile(event) {
            // Đóng mobile menu tổng nếu click ra ngoài nó
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
                setIsMobileMenuOpen(false);
            }
            // Đóng dropdown con trong mobile menu nếu click ra ngoài nó
            if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target) && !event.target.closest('.mobile-category-button')) {
                setIsMobileCategoryDropdownOpen(false);
            }
        }
        if (isMobileMenuOpen) { // Chỉ lắng nghe khi mobile menu mở
            document.addEventListener("mousedown", handleClickOutsideMobile);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideMobile);
        };
    }, [mobileMenuRef, mobileDropdownRef, isMobileMenuOpen]); // Thêm isMobileMenuOpen vào dependency


    const toggleMobileMenu = (e) => {
        e.stopPropagation(); // Ngăn sự kiện nổi bọt lên document listener ngay lập tức
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // Reset dropdown con khi đóng menu chính
        if (isMobileMenuOpen) {
            setIsMobileCategoryDropdownOpen(false);
        }
    };

    const toggleCategoryDropdown = (e) => {
        e.stopPropagation();
        setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    };

    const toggleMobileCategoryDropdown = (e) => {
        e.stopPropagation();
        setIsMobileCategoryDropdownOpen(!isMobileCategoryDropdownOpen);
    };

    // Danh sách mục dropdown
    const categoryDropdownItems = [
        { name: 'Phụ kiện', path: '/accessories' },
        { name: 'Khuyến mãi', path: '/promotions' },
        { name: 'Tin tức', path: '/blog' }, // Ví dụ thêm mục khác
    ];

    return (
        <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Left Section: Logo and potentially brand name */}
                <div className="flex items-center flex-shrink-0">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
                        <img src="https://abcmediagroup.co.uk/wp-content/uploads/2024/04/abc-logo-1-2-300x171.png" alt="Logo" className="h-10" />
                        {/* <span className="text-2xl font-bold hidden sm:inline">ABC Shop</span> */}
                    </Link>
                </div>

                {/* Center Section: Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-6 lg:gap-8 font-medium">
                    <li><Link to="/" className="hover:text-blue-200 transition duration-200">Trang chủ</Link></li>
                    <li><Link to="/phone" className="hover:text-blue-200 transition duration-200">Điện thoại</Link></li>
                    <li><Link to="/laptop" className="hover:text-blue-200 transition duration-200">Laptop</Link></li>
                    <li><Link to="/tablet" className="hover:text-blue-200 transition duration-200">Tablet</Link></li>
                    {/* Category Dropdown */}
                    <li className="relative" ref={dropdownRef}>
                        <button
                            className="flex items-center hover:text-blue-200 transition duration-200 focus:outline-none"
                            onClick={toggleCategoryDropdown}
                            aria-haspopup="true"
                            aria-expanded={isCategoryDropdownOpen}
                        >
                            Danh mục khác
                            {isCategoryDropdownOpen ? <FaChevronUp className="ml-1 w-3 h-3" /> : <FaChevronDown className="ml-1 w-3 h-3" />}
                        </button>
                        {/* Dropdown Menu with Animation */}
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 mt-3 w-48 bg-white text-gray-800 shadow-xl rounded-md overflow-hidden transition-all duration-300 ease-in-out transform origin-top z-30
                            ${isCategoryDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                        >
                            <ul className="py-2">
                                {categoryDropdownItems.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            to={item.path}
                                            className="block px-4 py-2 text-sm hover:bg-blue-50 transition duration-200"
                                            onClick={() => setIsCategoryDropdownOpen(false)} // Close on click
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                    <li><Link to="/about" className="hover:text-blue-200 transition duration-200">Giới thiệu</Link></li>
                    <li><Link to="/faq" className="hover:text-blue-200 transition duration-200">Hỏi đáp</Link></li>
                </ul>

                {/* Right Section: Search, User, Cart, Mobile Toggle */}
                <div className="flex items-center gap-3 md:gap-4">
                    {/* Search */}
                    <div className="hidden sm:flex items-center bg-white/20 rounded-full px-3 py-1 focus-within:bg-white/30 transition-colors duration-300">
                        <FaSearch className="text-white/70 mr-2" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="bg-transparent text-white placeholder-white/70 text-sm focus:outline-none w-24 md:w-32 lg:w-40"
                        />
                    </div>

                    {/* User Actions */}
                    {user ? (
                        <>
                            <Link to="/profile" className="hover:text-blue-200 transition duration-200 p-1 rounded-full hover:bg-white/10" title="Tài khoản">
                                {/* <img src='/avt.png' className='h-7 w-7 rounded-full object-cover' alt="User Avatar"/> */}
                                <FaUserCircle className="h-6 w-6" />
                            </Link>
                            <Link to="/cart" className="relative hover:text-blue-200 transition duration-200 p-1 rounded-full hover:bg-white/10" title="Giỏ hàng">
                                <FaShoppingCart className="h-6 w-6" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        </>
                    ) : (
                        <button className="bg-white text-blue-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200">
                            Đăng nhập
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white focus:outline-none mobile-menu-button"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Panel */}
            <div
                ref={mobileMenuRef} // Gắn ref vào đây
                className={`absolute top-full left-0 right-0 bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg md:hidden overflow-y-auto transition-all duration-300 ease-in-out z-40
                           ${isMobileMenuOpen ? 'max-h-[calc(100vh-64px)] opacity-100' : 'max-h-0 opacity-0'}`} // Adjust max-h based on nav height (approx 64px)
            >
                <div className="px-4 pt-4 pb-6 space-y-3">
                    {/* Mobile Search */}
                    <div className="flex sm:hidden items-center bg-white/20 rounded-md px-3 py-2 focus-within:bg-white/30 transition-colors duration-300 w-full">
                        <FaSearch className="text-white/70 mr-2" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="bg-transparent text-white placeholder-white/70 text-sm focus:outline-none w-full"
                        />
                    </div>
                    <Link to="/" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Trang chủ</Link>
                    <Link to="/phone" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Điện thoại</Link>
                    <Link to="/laptop" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Laptop</Link>
                    <Link to="/tablet" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Tablet</Link>

                    {/* Mobile Category Dropdown */}
                    <div ref={mobileDropdownRef}>
                        <button
                            className="mobile-category-button flex justify-between items-center w-full py-2 rounded hover:bg-white/10 px-3 transition duration-200 focus:outline-none"
                            onClick={toggleMobileCategoryDropdown}
                            aria-haspopup="true"
                            aria-expanded={isMobileCategoryDropdownOpen}
                        >
                            <span>Danh mục khác</span>
                            {isMobileCategoryDropdownOpen ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
                        </button>
                        {/* Mobile Dropdown Submenu with Animation */}
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out pl-4 ${isMobileCategoryDropdownOpen ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                        >
                            <ul className="py-1 space-y-1">
                                {categoryDropdownItems.map((item) => (
                                    <li key={'mobile-' + item.name}>
                                        <Link
                                            to={item.path}
                                            className="block py-1.5 px-2 text-sm rounded hover:bg-white/10 transition duration-200"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <Link to="/about" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Giới thiệu</Link>
                    <Link to="/faq" className="block py-2 rounded hover:bg-white/10 px-3 transition duration-200">Hỏi đáp</Link>

                    {/* Divider */}
                    {user && <hr className="border-white/20 my-3" />}

                    {/* Mobile User Actions (Nếu chưa đăng nhập thì hiện nút Đăng nhập) */}
                    {!user && (
                        <button className="w-full bg-white text-blue-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-colors duration-200 mt-2">
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavigationBar;


// // src/components/NavigationBar.jsx
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaChevronDown } from 'react-icons/fa';

// const categories = [ /* ... data categories ... */ ];

// function NavigationBar() {
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   return (
//     // Nền màu primary, chữ màu text-on-primary
//     <nav className="bg-primary text-text-on-primary shadow-md hidden md:block sticky top-0 z-40">
//       <div className="container mx-auto px-4">
//         {/* Chữ màu text-on-primary, hover có thể đổi nhẹ màu nền hoặc chữ */}
//         <ul className="flex items-center justify-center gap-6 lg:gap-8 text-sm font-medium">
//           {categories.map((category) => (
//             <li
//               key={category.name}
//               // Thêm padding để dễ hover, có thể thêm hiệu ứng nền khi hover cả li
//               className={`py-3 relative group ${category.highlight ? 'text-yellow-300 font-bold' : ''}`} // Highlight màu vàng trên nền xanh
//               onMouseEnter={() => category.subCategories && setActiveDropdown(category.name)}
//               onMouseLeave={() => category.subCategories && setActiveDropdown(null)}
//             >
//               <Link to={category.path} className="flex items-center gap-1 group-hover:text-white/80 transition-colors">
//                 {category.name}
//                 {category.subCategories && <FaChevronDown className="w-3 h-3" />}
//               </Link>
//               {/* Dropdown nền surface, chữ text-main */}
//               {category.subCategories && activeDropdown === category.name && (
//                 <div className="absolute left-0 top-full mt-0 w-48 bg-surface shadow-lg rounded-b-md border border-border border-t-0 z-50">
//                   <ul className="py-2">
//                     {category.subCategories.map((sub) => (
//                       <li key={sub.name}>
//                         <Link
//                           to={sub.path}
//                           // Chữ text-main, hover dùng nền surface-accent
//                           className="block px-4 py-2 text-sm text-text-main hover:bg-surface-accent transition-colors"
//                           onClick={() => setActiveDropdown(null)}
//                         >
//                           {sub.name}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </li>
//           ))}
//           <li><Link to="/blog" className="py-3 hover:text-white/80 transition-colors">Tin Công Nghệ</Link></li>
//           <li><Link to="/contact" className="py-3 hover:text-white/80 transition-colors">Liên hệ</Link></li>
//         </ul>
//       </div>
//     </nav>
//   );
// }

// export default NavigationBar;