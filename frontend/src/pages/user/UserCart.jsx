import { useSelector, useDispatch } from 'react-redux';
import { UPDATE_QUANTITY, CLEAR_CART } from '../store/actions';

function Cart() {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();

  // Tăng số lượng
  const handleIncrease = (id) => {
    const product = cart.find(item => item.id === id);
    dispatch({ type: UPDATE_QUANTITY, payload: { id, quantity: product.quantity + 1 } });
  };

  // Giảm số lượng
  const handleDecrease = (id) => {
    const product = cart.find(item => item.id === id);
    if (product.quantity > 1) {
      dispatch({ type: UPDATE_QUANTITY, payload: { id, quantity: product.quantity - 1 } });
    }
  };

  // Nhập thủ công số lượng
  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value, 10);
    if (quantity > 0) {
      dispatch({ type: UPDATE_QUANTITY, payload: { id, quantity } });
    }
  };

  // Xóa giỏ hàng
  const handleClearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  // Xử lý thanh toán (chưa triển khai)
  const handleCheckout = () => {
    console.log('Chuyển đến trang thanh toán');
  };

  return (
    <div className="px-[100px] my-8">
      <h2 className="text-2xl font-bold mb-4">Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          {cart.map(product => (
            <div key={product.id} className="flex items-center justify-between p-4 border-b">
              <img src={product.image} alt={product.name} className="w-20 h-20 object-cover" />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
              </div>
              <div className="w-24 text-center">
                <p>{product.price} VND</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDecrease(product.id)} 
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  className="w-12 text-center border rounded"
                />
                <button 
                  onClick={() => handleIncrease(product.id)} 
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              <div className="w-24 text-center">
                <p>{product.price * product.quantity} VND</p>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-8">
            <button 
              onClick={handleClearCart} 
              className="bg-red-500 text-white px-6 py-2 rounded"
            >
              Xoá giỏ hàng
            </button>
            <button 
              onClick={handleCheckout} 
              className="bg-green-500 text-white px-6 py-2 rounded"
            >
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;