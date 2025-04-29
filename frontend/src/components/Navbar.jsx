//navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md py-3 px-4 md:px-[100px]">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-blue-200 transition duration-200">Trang chủ</Link>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          <li><Link to="/phone" className="hover:text-blue-200 transition duration-200">Điện thoại</Link></li>
          <li><Link to="/laptop" className="hover:text-blue-200 transition duration-200">Laptop</Link></li>
          <li><Link to="/about" className="hover:text-blue-200 transition duration-200">Giới thiệu</Link></li> {/* Thêm Link Giới thiệu */}
          <li><Link to="/faq" className="hover:text-blue-200 transition duration-200">Hỏi đáp</Link></li>   {/* Thêm Link Hỏi đáp */}
          <li><Link to="#" className="hover:text-blue-200 transition duration-200">Tablet</Link></li>
          {/* <li className="relative">
            <button 
              className="flex items-center hover:text-blue-200 transition duration-200 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Khác
              <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {isDropdownOpen && (
              <ul className="absolute right-0 bg-white text-gray-800 shadow-lg rounded-md mt-2 py-2 w-48 z-10 animate-fadeIn">
                <li><a href="#" className="block px-4 py-2 hover:bg-blue-50 transition duration-200">Phụ kiện</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-blue-50 transition duration-200">Khuyến mãi</a></li>
              </ul>
            )}
          </li> */}
        </ul>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu with Animation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="transform transition-transform duration-300 ease-in-out pt-4 pb-2 px-4"></div>
          <ul className="flex flex-col space-y-3">
            <li><Link to="/phone" className="block py-2 hover:text-blue-200 transition duration-200">Điện thoại</Link></li>
            <li><Link to="/laptop" className="block py-2 hover:text-blue-200 transition duration-200">Laptop</Link></li>
            <li><Link to="#" className="block py-2 hover:text-blue-200 transition duration-200">Tablet</Link></li>
            {/* <li>
              <button 
                className="flex items-center py-2 hover:text-blue-200 transition duration-200 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Khác
                <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {isDropdownOpen && (
                <ul className="bg-blue-700 rounded-md mt-1 py-2 pl-4">
                  <li><a href="#" className="block py-2 hover:text-blue-200 transition duration-200">Phụ kiện</a></li>
                  <li><a href="#" className="block py-2 hover:text-blue-200 transition duration-200">Khuyến mãi</a></li>
                </ul>
              )}
            </li> */}
          </ul>
      </div>
    </nav>
  );
}

export default Navbar;