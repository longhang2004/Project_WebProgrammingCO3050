// src/components/MainHeader.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';

const placeholderUser = { name: 'Long' };
const placeholderCartItemCount = 3;

function MainHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = placeholderUser;
  const cartItemCount = placeholderCartItemCount;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Nền surface (trắng), viền border */}
      <header className="bg-surface shadow-sm py-4 border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <Link to="/" aria-label="Trang chủ">
              <img src="logo-placeholder.png" alt="Shop Logo" className="h-10 md:h-12" />
            </Link>
          </div>

          <div className="flex-grow mx-4 hidden md:flex justify-center">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            {/* Sử dụng màu text-main hoặc text-link */}
            <Link to={user ? "/profile" : "/login"} className="flex items-center gap-1 text-text-main hover:text-primary transition-colors" title={user ? user.name : "Tài khoản"}>
              <FaUserCircle className="h-6 w-6" />
              <span className="text-xs hidden lg:inline">{user ? `Chào, ${user.name}` : 'Đăng nhập'}</span>
            </Link>

            <Link to="/cart" className="relative flex items-center gap-1 text-text-main hover:text-primary transition-colors" title="Giỏ hàng">
              <FaShoppingCart className="h-6 w-6" />
              <span className="text-xs hidden lg:inline">Giỏ hàng</span>
              {cartItemCount > 0 && (
                // Màu nhấn accent cho badge
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Màu text-main cho icon menu */}
            <button
              className="md:hidden text-text-main focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Mở menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-3 md:hidden">
          <SearchBar />
        </div>
      </header>
      {/* MobileMenu sẽ cần được cập nhật màu sắc tương tự */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}

export default MainHeader;