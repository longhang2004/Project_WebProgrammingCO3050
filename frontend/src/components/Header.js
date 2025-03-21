import React from 'react'
import { Link } from 'react-router-dom';
import path from '../utils/path';
import { RiPhoneFill } from "react-icons/ri";
import { CgMail } from "react-icons/cg";

const Header = () => {
  

  return (
    <div className="w-full bg-blue-100">
      <div className=" w-main h-[110px] py-[35px]  mx-auto flex items-center justify-start">
 
        {/* logo */}
        <Link to={path.HOME}>
        <img src="https://abcmediagroup.co.uk/wp-content/uploads/2024/04/abc-logo-1-2-300x171.png" alt="logo" className="h-[80px] w-auto cursor-pointer" />
      </Link>
         <div className = "flex text-[13px] ml-auto space-x-8">
          <div className = 'flex flex-col items-center'>
          <span className = 'flex items-center gap-3'>
          <RiPhoneFill color = 'red' />
          <span className = 'font-semibold'>(+1800) 000 6606</span>
          </span>
          <span> Mon-Sat 9:00AM - 8:00PM </span>
          </div>
          <div className = 'flex flex-col items-center'>
          <span className = 'flex items-center gap-3'>
          <CgMail color = 'red' />
          <span className = 'font-semibold'>ABCSUPPORT@GMAIL.COM</span>
          </span>
          <span> Online Support 24/7 </span>
          </div>
          </div> 
      </div>
    </div>
  );
};

export default Header
