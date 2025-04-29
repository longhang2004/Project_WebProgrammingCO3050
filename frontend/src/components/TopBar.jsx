// src/components/TopBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';

function TopBar() {
  return (
    // Sử dụng màu surface-dark hoặc gray-100 tùy thiết kế
    <div className="bg-gray-100 text-text-muted text-xs border-b border-border hidden md:block">
      <div className="container mx-auto px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="tel:18001234" className="flex items-center gap-1 hover:text-primary transition-colors">
            <FaPhoneAlt />
            <span>Hotline: 1800.1234</span>
          </a>
          <Link to="/stores" className="flex items-center gap-1 hover:text-primary transition-colors">
            <FaMapMarkerAlt />
            <span>Hệ thống cửa hàng</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/order-tracking" className="flex items-center gap-1 hover:text-primary transition-colors">
            <FaTruck />
            <span>Theo dõi đơn hàng</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopBar;