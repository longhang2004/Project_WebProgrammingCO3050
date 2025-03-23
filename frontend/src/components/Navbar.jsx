function Navbar() {
    return (
      <nav className="bg-primary text-white py-2 px-[100px]">
        <ul className="flex gap-6 items-center">
          <li><a href="#" className="hover:underline">Điện thoại</a></li>
          <li><a href="#" className="hover:underline">Laptop</a></li>
          <li><a href="#" className="hover:underline">Tablet</a></li>
          <li className="relative group">
            <a href="#" className="hover:underline">Khác</a>
            <ul className="absolute hidden group-hover:block bg-white text-black shadow-md rounded-md mt-1 p-2">
              <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Phụ kiện</a></li>
              <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Khuyến mãi</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    );
  }
  
  export default Navbar;