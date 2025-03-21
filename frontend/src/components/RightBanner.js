import React from 'react'

const Banner = () => {
  return (
    <div className='flex flex-col h-full justify-between gap-5'>
        <div>
            <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                <img  
                    src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right-banner-14-10.jpg  "
                    alt="rightBanner"
                    className='flex-1 object-contain object-top border-2 rounded-md shadow-xl'
                ></img>  
            </a>
        </div>
        <div>
            <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                <img  
                    src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/home-m55-10190-12-11.png"
                    alt="rightBanner"
                    className='flex-1 object-contain object-top border-2 rounded-md shadow-xl'
                ></img>  
            </a>
        </div>
        
    </div>
  )
}

export default Banner