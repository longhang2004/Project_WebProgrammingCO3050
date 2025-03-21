import React, {memo} from 'react'
import { IoMailUnread } from "react-icons/io5";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
const Footer = () => {
    return (
      <div className="w-full">
        <div className="w-full bg-blue-100">
          <div className="w-main h-[103px] mx-auto flex items-center justify-start">
            <div className="flex items-center justify-between w-main">
              <div className="flex flex-col flex-1">
                <span className="text-[20px] text-gray-300">ƯU ĐÃI VỚI THÀNH VIÊN</span>
                <small className="text-[13px] text-gray-400">Đăng kí ngay và nhận tin tức ưu đãi hấp dẫn hàng tuần </small>
              </div>
              <div className="flex items-center flex-1">
                <input
                  className="p-4 pr-0 rounded-l-full w-full bg-[#F2F2F2] outline-none text-black-400
                    placeholder:text-sm placeholder:text-[#6E6E6E] placeholder:italic placeholder:opacity-50"
                  // type="text"
                  placeholder="Địa chỉ email"
                />
                <div className="h-[56px] w-[56px] bg-[#F2F2F2] rounded-r-full flex items-center justify-center text-black-200">
                <IoMailUnread size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="w-full bg-gray-300">
  <div className="w-main h-[307px] mx-auto flex items-start justify-start text-2E2E2E text-[13px]">
    <div className='flex-1'>
      <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px] mt-[65px]'>VỀ CHÚNG TÔI</h3> {/* Thêm mt-[20px] */}
      <span>
        <span>Địa chỉ: </span>
        <span className='opacity-50'>666 Lý Thường Kiệt, Quận 10, Tp.Hồ Chí Minh</span>
      </span>
      <br />
      <span>
        <span>Số điện thoại: </span>
        <span className='opacity-50'>(+1800) 000 6606</span>
      </span>
      <br />
      <span>
        <span>Email: </span>
        <span className='opacity-50'>abcsupport@gmail.com</span>
      </span>
    </div>
    <div className='flex-1'>
      <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px] mt-[65px]'>THÔNG TIN</h3>
      <span className="block mb-[5px]">
              <a href="/mua-hang-tra-gop-online" className="hover:underline">Mua hàng trả góp Online</a>
            </span>
            <span className="block mb-[5px]">
              <a href="/mua-hang-tra-gop-the-tin-dung" className="hover:underline">Mua hàng trả góp bằng thẻ tín dụng</a>
            </span>
            <span className="block mb-[5px]">
              <a href="/chinh-sach-giao-hang" className="hover:underline">Chính sách giao hàng</a>
            </span>
            <span className="block mb-[5px]">
              <a href="/tra-diem-ABCmember" className="hover:underline">Tra điểm ABCmember</a>
            </span>
            <span className="block mb-[5px]">
              <a href="/xem-uu-dai-ABCmember" className="hover:underline">Xem ưu đãi ABCmember</a>
            </span>
    </div>
    <div className='flex-1'>
      <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px] mt-[65px]'>THƯƠNG HIỆU NỔI BẬT</h3>
      <span className="block mb-[5px]">
              <a href="https://www.samsung.com/vn/" className="hover:underline">Samsung</a>
            </span>
            <span className="block mb-[5px]">
              <a href="https://www.oppo.com/vn/" className="hover:underline">Oppo</a>
            </span>
            <span className="block mb-[5px]">
              <a href="https://www.apple.com/vn/" className="hover:underline">Apple</a>
            </span>
            <span className="block mb-[5px]">
              <a href="https://www.mi.com/vn/" className="hover:underline">Xiaomi</a>
            </span>
            <span className="block mb-[5px]">
              <a href="https://www.sony.com/vn/" className="hover:underline">Sony</a>
            </span>
    </div>
    <div className='flex-1'>
        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px] mt-[65px]'>
          ABC - GIAO HÀNG TẬN NƠI
        </h3>
        <div className="social-links">
          <span className="mb-[5px] flex items-center">
            <a href="https://www.facebook.com" target="_blank" className="flex items-center hover:underline">
              <i className="mr-2 fab fa-facebook"></i> {<FaFacebookSquare />} <span className="ml-2">Facebook</span>
            </a>
          </span>
          <span className="mb-[5px] flex items-center">
            <a href="https://www.instagram.com" target="_blank" className="flex items-center hover:underline">
              <i className="mr-2 fab fa-instagram"></i>{<FaInstagramSquare />}  <span className="ml-2">Instagram</span>
            </a>
          </span>
          <span className="mb-[5px] flex items-center">
            <a href="https://www.twitter.com" target="_blank" className="flex items-center hover:underline">
              <i className="mr-2 fab fa-twitter"></i>{<FaTwitterSquare />}  <span className="ml-2">Twitter</span>
            </a>
          </span>
          <span className="mb-[5px] flex items-center">
            <a href="https://www.tiktok.com" target="_blank" className="flex items-center hover:underline">
              <i className="mr-2 fab fa-tiktok"></i> {<AiFillTikTok />} <span className="ml-2">TikTok</span>
            </a>
          </span>
        </div>
      </div>
        </div>
      </div>
    </div>
    );
  };
  
  export default memo(Footer);