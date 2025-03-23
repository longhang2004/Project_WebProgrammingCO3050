import { useSelector, useDispatch } from 'react-redux';

function Header() {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <header className="flex justify-between items-center bg-primary text-white py-4 px-[100px]">
      <div className="flex items-center gap-2">
        <img src="logo.png" alt="Logo" className="h-10" />
        <span className="text-xl font-bold">ABC</span>
      </div>
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm"
        className="w-2/5 p-2 rounded-md text-black"
      />
      <div className="flex items-center gap-4">
        {user ? (
          <span>Xin chào {user.name}</span>
        ) : (
          <button
            onClick={() => dispatch({ type: 'LOGIN', payload: { name: 'User' } })}
            className="bg-white text-primary px-4 py-2 rounded-md"
          >
            Đăng nhập
          </button>
        )}
        <span className="flex items-center gap-1">
          🛒 ({cart.length})
        </span>
      </div>
    </header>
  );
}

export default Header;