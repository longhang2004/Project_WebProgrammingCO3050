import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

function Header() {
  const user = /* useSelector((state) => state.user) */ {
    name: 'Long'
  };
  const cart = /* useSelector((state) => state.cart) */ [];
  // const dispatch = useDispatch();

  return (
    <header className="flex justify-between items-center bg-primary text-white py-4 md:px-[100px] px-[10px]">
      <div className="flex items-center gap-2">
        <img src="https://abcmediagroup.co.uk/wp-content/uploads/2024/04/abc-logo-1-2-300x171.png" alt="Logo" className="h-10" />
        {/* <Link to={`/`} className="text-xl font-bold ">ABC</Link> */}
        {/* <Link to={"/"}> */}
          {/* <span className="text-xl font-bold">ABC</span> */}
        {/* </Link> */}
        
      </div>
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm"
        className="w-2/5 p-2 rounded-md text-black bg-blue-950"
      />
      <div className="flex items-center gap-4">
        {user ? (<>
          <span className="hidden sm:block">Xin chào <span className='font-bold'>{user.name}</span>!</span>
          <span>
            <Link to={"/profile"}>
                <img src='../../public/avt.png' className='max-h-8 hover:bg-blue-900 p-1 rounded-lg'/>
            </Link>
          </span>
          <span className="flex items-center gap-1">
            <Link to={"/cart"} className="flex items-center gap-1">
              <img src='../../public/giohangwhite.png' className='max-h-10 hover:bg-blue-900 p-1 rounded-lg'/> ({cart.length})
            </Link>
          </span>
        </>
          
        ) : (
          <button
            // onClick={() => dispatch({ type: 'LOGIN', payload: { name: 'User' } })}
            className="bg-white text-primary px-4 py-2 rounded-md"
          >
            Đăng nhập
          </button>
        )}
        
      </div>
    </header>
  );
}

export default Header;