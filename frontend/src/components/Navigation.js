import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import path from '../utils/path';
// import { getCurrent } from '../store/user/asyncActions'
import { useSelector, useDispatch } from 'react-redux'
import { IoLogOut } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
// import { logout } from '../store/user/userSlice'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { useSearchParams } from 'react-router-dom';
import { MdLaptopWindows, MdMouse } from "react-icons/md";
import { IoIosPhonePortrait } from "react-icons/io";
import { FaTabletAlt, FaHeadphonesAlt, FaKeyboard } from "react-icons/fa";
import { IoBatteryCharging } from "react-icons/io5";
import { AiOutlineUsb } from "react-icons/ai";
import { BiSolidDevices } from "react-icons/bi";

const categories = [
  { name: 'Điện thoại', path: '/phone', icon: <IoIosPhonePortrait className="text-blue-500"/> },
  { name: 'Máy tính xách tay', path: '/laptop' ,icon: <MdLaptopWindows className="text-blue-500"/> },
  { name: 'Máy tính bảng', path: '/tablet', icon: <FaTabletAlt  className="text-blue-500"/> },
  { name: 'Đồng hồ thông minh', path: '/smartwatch', icon: <MdLaptopWindows className="text-blue-500"/> },
  { name: 'Pin dự phòng', path: '/powerbank', icon: <IoBatteryCharging  className="text-blue-500"/> },
  { name: 'Tai nghe', path: '/headphone', icon: <FaHeadphonesAlt  className="text-blue-500"/> },
  { name: 'Bộ sạc', path: '/charger' ,icon: <AiOutlineUsb className="text-blue-500"/> },
  { name: 'Ốp bảo vệ', path: '/case', icon: <BiSolidDevices className="text-blue-500" /> },
  { name: 'Chuột', path: '/mouse' ,icon: <MdMouse className="text-blue-500"/>},
  { name: 'Bàn phím', path: '/keyboard', icon: <FaKeyboard className="text-blue-500"/> }
];

const Navigation = () => {
  const [showProducts, setShowProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();  
  const dispatch = useDispatch();
  const menuRef = useRef(null); // Tạo tham chiếu đến menu
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [current, setCurrent] = useState({});
  // const { isLoggedIn, current }  = useSelector(state => state.user)
  const [searchParams, setSearchParams] = useSearchParams(); // Use searchParams to manage query parameters in URL
  
  // useEffect(() => { 
  //   const setTimeoutId = setTimeout(() => { 
  //     if (isLoggedIn) dispatch(getCurrent())
  //   }, 300)
  //   return () => { 
  //     clearTimeout(setTimeoutId)
  //   }
  // }, [dispatch, isLoggedIn])

  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      setSearchQuery(query); // If a query exists, populate the searchQuery state
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ query: searchQuery }); // Update the URL query params with search term
      navigate(`/searchResult?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleProducts = () => {
    setShowProducts(!showProducts);
  };

  const handleCategoryClick = (path) =>  {
    navigate(path);
    window.location.reload(); // Tải lại trang
    setShowProducts(false); // Đóng menu sau khi chọn
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowProducts(false);
    }
  };
  useEffect(() => {
    if (showProducts) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProducts]);

  const handleLogin = () => {
    navigate(path.LOGIN); // Điều hướng đến trang đăng nhập
  };

  const handleOrderLookup = () => {
    if (isLoggedIn) {
      navigate('/member/order-history'); 
    } else {
      navigate(path.LOGIN); // Nếu chưa đăng nhập, điều hướng đến trang đăng nhập
    }
  };
  const handleCartClick = () => {
    if (!isLoggedIn) {
      navigate(path.LOGIN);
    } else {
      navigate('/detail-cart');
    }
  };
  const userButtonClasses = "flex items-center gap-2 rounded-md bg-slate-500 bg-opacity-20 px-1 py-2 hover:text-gray-200 text-xs";
  return (
    <div className="w-full bg-blue-200">
      <div className="w-main h-[48px] py-2 mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
        <Link to={path.HOME} className="hover:text-gray-200">
          Trang chủ
        </Link>
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center space-x-1 hover:text-gray-200"
              onClick={toggleProducts}
            >
              <span>Sản phẩm</span>
              <ChevronDown size={20} />
            </button>
          {showProducts && (
            <div className="absolute left-0 z-50 w-64 mt-2 bg-white rounded-md shadow-lg">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-2 space-x-2 text-gray-800 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCategoryClick(category.path)}
                >
                  <span className="text-xl">{category.icon}</span> 
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          )}
          </div>
          <div
            className="cursor-pointer hover:text-gray-200"
            onClick={handleOrderLookup}
          >
            Kiểm tra đơn hàng
          </div>
        </div>
      <div className="flex items-center justify-center flex-grow">
        <div className="flex items-center p-1 space-x-2 bg-white border border-white rounded-full">
            <input
              placeholder="Tìm kiếm sản phẩm"
              className="px-4 py-1 text-gray-800 rounded-full outline-none w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            <IoMdSearch
              size={20}
              className="text-gray-800 cursor-pointer"
              onClick={(e) => handleSearch(e)}
            />
        </div>
      </div>
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-200">
            <IoChatbubbleEllipsesOutline color='red' size={20} className="h-6 text--800" />
            <span className="text-base">Liên hệ</span> {/* Sử dụng text-base thay vì text-sm */}
          </div>
          <div className="relative cursor-pointer hover:text-gray-200" onClick={handleCartClick}>
            <IoCartOutline size={25}/>
            <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-600 rounded-full -top-2 -right-2">
              { isLoggedIn ? current?.cart?.reduce((total, item) => total + item.quantity, 0) : 0 }
            </span>
          </div>
          {isLoggedIn ? (
          <Menu as="div" className="relative z-10 inline-block text-left">
            <MenuButton className={userButtonClasses}>
              <FaRegUserCircle className="text-xl" />
              <span className="text-sm">{`${current?.firstname}`}</span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </MenuButton>
            <MenuItems
              className="absolute right-0 w-48 mt-2 bg-white border rounded-md shadow-lg"
            >
              <div className="py-1">
              {current?.role === 'admin' && (
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => { navigate(`${path.ADMIN}/${path.MANAGE_USERS}`) }}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } block w-full text-left px-4 py-2 text-sm`}
                      >
                        <RiAdminFill className="w-5 h-5 mr-2 text-gray-500" />
                        Trang admin
                      </button>
                    )}
                  </MenuItem>
              )}
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => { navigate(`${path.MEMBER}/${path.PERSONAL}`) }}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } block w-full text-left px-4 py-2 text-sm`}
                      >
                        <MdManageAccounts className="w-5 h-5 mr-2 text-gray-500" />
                        Thông tin tài khoản
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        type="button"
                        // onClick={ () => { dispatch(logout()) } }
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } block w-full text-left px-4 py-2 text-sm border-t`}
                      >
                        <IoLogOut className="w-5 h-5 mr-2 text-gray-500" />
                        Đăng xuất
                      </button>
                    )}
                  </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        ) : (
          <button
            className={userButtonClasses}
            onClick={handleLogin}
          >
            <FaRegUserCircle className="text-xl" />
            <span className="px-0.5 text-sm">Đăng nhập</span>
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;