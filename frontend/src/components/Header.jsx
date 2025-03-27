import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';

function Header() {
  const user = /* useSelector((state) => state.user) */ null;
  const cart = /* useSelector((state) => state.cart) */ [];
  // const dispatch = useDispatch();

  return (
    <header className="flex justify-between items-center bg-primary text-white py-4 md:px-[100px]">
      <div className="flex items-center gap-2">
        <img src="https://abcmediagroup.co.uk/wp-content/uploads/2024/04/abc-logo-1-2-300x171.png" alt="Logo" className="h-10" />
        {/* <Link to={`/`} className="text-xl font-bold">ABC</Link> */}
        {/* <Link to={"/"}> */}
          <span className="text-xl font-bold">ABC</span>
        {/* </Link> */}
        
      </div>
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm"
        className="w-2/5 p-2 rounded-md text-black"
      />
      <div className="flex items-center gap-4">
        {user ? (<>
          <span>Xin chào {user.name}</span>
            <span className="flex items-center gap-1">
            🛒 ({cart.length})
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