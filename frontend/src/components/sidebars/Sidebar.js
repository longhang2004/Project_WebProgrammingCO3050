import React from 'react';
import { MdLaptopWindows } from 'react-icons/md';
import { FaTabletAlt, FaHeadphonesAlt, FaKeyboard } from 'react-icons/fa';
import { IoMdPhonePortrait } from "react-icons/io";

const Sidebar = () => {
  const menuItems = [
    { name: 'Điện thoại', path: '/phone', icon: <IoMdPhonePortrait className="text-xl text-blue-500" /> },
    { name: 'Máy tính xách tay', path: '/laptop', icon: <MdLaptopWindows className="text-xl text-blue-500" /> },
    { name: 'Máy tính bảng', path: '/tablet', icon: <FaTabletAlt className="text-xl text-blue-500" /> },
    { name: 'Đồng hồ thông minh', path: '/smartwatch', icon: <MdLaptopWindows className="text-xl text-blue-500" /> },
    { name: 'Tai nghe', path: '/headphone', icon: <FaHeadphonesAlt className="text-xl text-blue-500" /> },
  ];

  return (
    <div className="flex flex-col justify-between h-full border-2 rounded-md shadow-xl">
      {menuItems.map((item, index) => (
        <a
          key={index}
          href={item.path}
          className="flex items-center px-5 py-2 mb-2 text-lg hover:bg-gray-100 hover:text-blue-500"
        >
          {item.icon}
          <span className="ml-3">{item.name}</span>
        </a>
      ))}
    </div>
  );
};

export default Sidebar;