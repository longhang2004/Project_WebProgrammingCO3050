import { useState } from 'react';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md py-3 px-4 md:px-[100px]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">Brand Logo</div>
        
        <ul className="hidden md:flex gap-8 items-center">
          <li><a href="#" className="hover:text-blue-200 transition duration-200">Điện thoại</a></li>
          <li><a href="#" className="hover:text-blue-200 transition duration-200">Laptop</a></li>
          <li><a href="#" className="hover:text-blue-200 transition duration-200">Tablet</a></li>
          <li className="relative">
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
          </li>
        </ul>
        
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;