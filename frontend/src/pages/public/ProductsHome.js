import React from 'react'
import { Sidebar, Banner, RightBanner, ProductPhone, ProductTablet, ProductHeadphone, ProductLaptop, ProductCharger, ProductKeyboard, ProductMouse, ProductPowerBank, ProductSmartWatch, YourNeed} from '../../components/index'

const Home = () => {
  return (
    <>
      <div className="flex flex-row w-main">
        {/* Sidebar */}
        <div className='flex flex-col w-[20%] flex-auto'>
          <Sidebar />
        </div>
        {/* Slider banner */}
        <div className='flex flex-col pl-4 pr-4 w-[50%] flex-auto'>
          <Banner />
        </div>
        {/* Right Banner */}
        <div className='flex flex-col  w-[30%] flex-auto'>
          <RightBanner />
        </div>
      </div>
      <div className='py-10 w-main'>
        <YourNeed />
      </div>
      <div className='flex flex-col py-10 mt-10 w-main'>
        <ProductPhone />
        <ProductLaptop />
        <ProductTablet />
        <ProductHeadphone />
        <ProductCharger />
        <ProductKeyboard />
        <ProductPowerBank />
        <ProductSmartWatch />
        <ProductMouse />
      </div>
    </>
  )
}

export default Home