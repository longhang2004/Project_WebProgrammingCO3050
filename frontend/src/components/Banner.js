import React, { useRef } from 'react';
import Slider from "react-slick";

const Banner = () => {
  const sliderRef = useRef(null); 

  const settings = {
    dots: true,         
    infinite: true,     
    speed: 500,         
    slidesToShow: 1,    
    slidesToScroll: 1,  
    autoplay: true,         // Tự động chuyển đổi
    autoplaySpeed: 2000,    // Tốc độ tự động chuyển đổi (ms)
  };

  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index); 
  };

  return (
    <div className='flex flex-col flex-auto'>
      <div className='w-full relative'>
        <Slider {...settings} ref={sliderRef}>
          <div>
            <img  
              src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/sliding-home-iphone-16-pro-km-moi.jpg"
              alt="banner 1"
              className='w-full object-contain object-top'
            />
          </div>
          <div>
            <img  
              src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/home-oppo-find-x8-gia-moi-20-11.jpg"
              alt="banner 2"
              className='w-full object-contain object-top'
            />
          </div>
          <div>
            <img  
              src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/ipad-mini-7-sliding-home-20-11.jpg"
              alt="banner 3"
              className='w-full object-contain object-top'
            />
          </div>
          <div>
            <img  
              src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/home-huawei-watch-d2-01-11.jpg"
              alt="banner 4"
              className='w-full object-contain object-top'
            />
          </div>
        </Slider>

        <div className='w-full overflow-hidden mt-4'>
          <div className='w-full h-full flex flex-col items-center justify-between rounded-b-md shadow-xl p-4 relative'>
            <div className='flex flex-row justify-between w-full z-10'>
              <span 
                onClick={() => goToSlide(0)} 
                className="cursor-pointer text-black-500 hover:text-black-700 border-t-2 border-transparent hover:border-blue-500 focus:outline-none focus:border-blue-500 p-2"
              >
                MỚI NHẤT
              </span>
              <span 
                onClick={() => goToSlide(1)} 
                className="cursor-pointer text-black-500 hover:text-black-700 border-t-2 border-transparent hover:border-blue-500 focus:outline-none focus:border-blue-500 p-2"
              >
                ĐẶT TRƯỚC
              </span>
              <span 
                onClick={() => goToSlide(2)} 
                className="cursor-pointer text-black-500 hover:text-black-700 border-t-2 border-transparent hover:border-blue-500 focus:outline-none focus:border-blue-500 p-2"
              >
                LÊN ĐỜI
              </span>
              <span 
                onClick={() => goToSlide(3)} 
                className="cursor-pointer text-black-500 hover:text-black-700 border-t-2 border-transparent hover:border-blue-500 focus:outline-none focus:border-blue-500 p-2"
              >
                MUA NGAY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;