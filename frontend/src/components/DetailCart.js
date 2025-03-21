import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
// import { apiFetchUserCart, apiDeleteProductFromUserCart, apiChangeUserCartProductQuantity } from '../apis/cart';
// import { apiGetCurrent } from '../apis/user'
import '../css/Cart.css';
import { MdOutlineDelete } from "react-icons/md";

const DetailCart = () => {
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  // Lấy thông tin người dùng hiện tại
  // const fetchCurrentUser = async () => {
  //   try {
  //     const results = await apiGetCurrent();
  //     if (results.success) {
  //       setCurrentUser(results.rs);
  //     } else {
  //       setError(results.message);
  //     }
  //   } catch (err) {
  //     setError('Lỗi khi tải thông tin người dùng');
  //   }
  // };

  // Lấy danh sách sản phẩm trong giỏ hàng
  // const fetchCartProducts = async (userId) => {
  //   try {
  //     const response = await apiFetchUserCart(userId);
  //     if (response.success) {
  //       setCart(response.cartData);
  //     } else {
  //       setError(response.message || 'Không thể tải giỏ hàng');
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch cart products:', error);
  //     setError('Lỗi kết nối đến server');
  //   }
  // };

  // Xử lý khi component được render
  // useEffect(() => {
  //   fetchCurrentUser();
  // }, []);

  // useEffect(() => {
  //   if (currentUser?._id) {
  //     fetchCartProducts(currentUser._id);
  //   }
  // }, [currentUser]);

  // Xóa sản phẩm khỏi giỏ hàng
  // const handleRemoveItem = async (productId) => {
  //   try {
  //     await apiDeleteProductFromUserCart({ userId: currentUser._id, productId });
  //     setCart((prevCart) => prevCart.filter((item) => item.productId._id !== productId));
  //   } catch (error) {
  //     console.error('Failed to remove item:', error);
  //   }
  //   window.location.reload();
  // };

  // Cập nhật số lượng sản phẩm
  const handleChangeQuantity = async (productId, newQuantity) => {
    try {
      // await apiChangeUserCartProductQuantity({
      //   userId: currentUser._id,
      //   productId,
      //   quantity: newQuantity,
      // });

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.productId.stock)) }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
    window.location.reload();
  };

  // Tính tổng giá trị giỏ hàng
  const calculateTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.productId.price * item.quantity, 0);
  }, [cart]);

  // Định dạng tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
<div className="cart-container">
      <Link to="/" className="btn-back-home">
    &larr; Quay về trang chủ
  </Link>

      <h1 className="cart-title">Giỏ hàng của bạn</h1>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="error-message">{error}</p>}

      {/* Kiểm tra nếu giỏ hàng trống */}
      {cart.length === 0 ? (
        <p className="empty-cart-message">Giỏ hàng trống.</p>
      ) : (
        <ul className="cart-items-list">
        {cart.map((item, index) => (
          <li key={index} className="cart-item">
            <div className="cart-item-details">
              {/* Phần bên trái: Ảnh */}
              <div className="cart-item-left">
           
                <img
                  src={item.productId.imageLink}
                  alt={item.productId.name}
                  className="cart-item-image"
                />
              </div>
      
              {/* Phần bên giữa: Tên và Giá */}
              <div className="cart-item-middle">
                <h3 className="cart-item-name">{item.productId.name}</h3>
                <p className="cart-item-price">Giá: {formatCurrency(item.productId.price)}</p>
              </div>
      
              {/* Phần bên phải: Nút xóa và Số lượng */}
              <div className="cart-item-right">
                {/* Điều chỉnh số lượng sản phẩm */}
                <div className="cart-item-quantity">
                  <button
                    onClick={() => handleChangeQuantity(item.productId._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="quantity-button"
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    onClick={() => handleChangeQuantity(item.productId._id, item.quantity + 1)}
                    disabled={item.quantity >= item.productId.stock}
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>
      
                {/* Nút xóa sản phẩm */}
                <button
                  className="btn-remove"
                  onClick={() => handleRemoveItem(item.productId._id)}
                >
                  <MdOutlineDelete />

                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      )}

          {/* Tóm tắt giỏ hàng */}
          <div className="cart-summary">
        <p className="cart-total">
          <strong>Tạm tính:</strong> {formatCurrency(calculateTotal)}
        </p>

        {/* Nút thanh toán */}
        <Link to="/checkout">
          <button className="btn-checkout">Mua ngay</button>
        </Link>
      </div>
    </div>
  );
};

export default DetailCart;