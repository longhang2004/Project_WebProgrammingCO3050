// File: frontend/src/pages/user/UserCart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FaTrashAlt, FaShoppingBag, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { formatCurrencyVND, USD_TO_VND_RATE } from '../../utils/currency';


function UserCart() {
    const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, cartItemCount } = useCart();
    const { userInfo, logout } = useAuth(); // Lấy logout để xử lý token hết hạn
    const navigate = useNavigate();
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');
    const [checkoutSuccess, setCheckoutSuccess] = useState('');

    const handleQuantityChange = (productId, newQuantity) => {
        const quantity = parseInt(newQuantity, 10);
        if (!isNaN(quantity) && quantity >= 1) {
            updateQuantity(productId, quantity);
        } else if (newQuantity === '') {
             // Allow clearing the input, but don't update if empty
        } else {
            updateQuantity(productId, 1); // Reset to 1 if invalid input
        }
    };

    // *** CHECKOUT: Cập nhật hàm này ***
    const handleCheckout = async () => {
        setCheckoutLoading(true);
        setCheckoutError('');
        setCheckoutSuccess('');

        // 1. Kiểm tra đăng nhập (qua token)
        const token = localStorage.getItem('authToken');
        if (!token) {
            setCheckoutError('Vui lòng đăng nhập để tiến hành thanh toán.');
            setCheckoutLoading(false);
            navigate('/login?redirect=/cart'); // Chuyển hướng về login
            return;
        }

        // 2. Kiểm tra giỏ hàng có trống không
        if (!cartItems || cartItems.length === 0) {
             setCheckoutError('Giỏ hàng của bạn đang trống.');
             setCheckoutLoading(false);
             return;
         }

        // 3. Chuẩn bị dữ liệu đơn hàng
        // Lấy thông tin user từ context để điền địa chỉ mặc định
        const defaultShippingAddress = userInfo?.address || '';
        const paymentMethod = 'cod'; // Mặc định COD hoặc lấy từ form nếu có

        const orderData = {
            // user_id sẽ được lấy từ token ở backend
            shipping_address: defaultShippingAddress, // Cần có form để người dùng nhập/xác nhận
            payment_method: paymentMethod, // Cần có lựa chọn phương thức
            order_items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                // Không cần gửi giá, backend sẽ tự lấy và tính toán
            })),
        };

         // 4. Gọi API tạo đơn hàng
         console.log("Submitting order data:", orderData); // DEBUG
         try {
            const response = await fetch('http://localhost/Project_WebProgrammingCO3050/backend/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Gửi token
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();
            console.log("Checkout API Response:", response.status, result); // DEBUG

            if (!response.ok || !result.success) {
                 // Xử lý lỗi cụ thể từ backend
                 if (response.status === 401) {
                     setCheckoutError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                     logout(); // Logout user
                     navigate('/login');
                 } else if (response.status === 409) { // Lỗi hết hàng (Conflict)
                     setCheckoutError(`Lỗi đặt hàng: ${result.message}`); // Hiển thị lỗi hết hàng
                 } else if (response.status === 400) { // Lỗi dữ liệu không hợp lệ
                     setCheckoutError(`Lỗi dữ liệu: ${result.message}`);
                 }
                 else {
                     throw new Error(result.message || `HTTP error! status: ${response.status}`);
                 }
                 return; // Dừng lại nếu có lỗi
            }

            // --- Thanh toán (Tạo đơn hàng) thành công ---
            setCheckoutSuccess(`Đặt hàng thành công! Mã đơn hàng của bạn là: ${result.data.order_id}.`);
            clearCart(); // Xóa giỏ hàng sau khi đặt hàng thành công
            // Tùy chọn: Chuyển hướng đến trang cảm ơn hoặc chi tiết đơn hàng
            // setTimeout(() => navigate(`/order/success/${result.data.order_id}`), 3000);

        } catch (err) {
            console.error('Lỗi đặt hàng:', err);
            // Hiển thị lỗi chung nếu các lỗi cụ thể chưa được xử lý
            if (!checkoutError) {
                setCheckoutError(err.message || 'Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
            }
        } finally {
            setCheckoutLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Giỏ Hàng Của Bạn</h1>

                {/* Hiển thị lỗi hoặc thành công */}
                {checkoutError && (
                    <div className="mb-4 text-center text-red-400 bg-red-900/50 p-3 rounded border border-red-700 flex items-center justify-center gap-2">
                         <FaExclamationTriangle /> {checkoutError}
                    </div>
                )}
                 {checkoutSuccess && (
                    <div className="mb-4 text-center text-green-400 bg-green-900/50 p-3 rounded border border-green-700">
                        <p>{checkoutSuccess}</p>
                        <Link to="/" className="text-blue-400 hover:underline mt-2 inline-block">Tiếp tục mua sắm</Link>
                    </div>
                 )}


                {/* Kiểm tra giỏ hàng trống */}
                {(!cartItems || cartItems.length === 0) && !checkoutSuccess ? (
                    <div className="text-center py-10 bg-gray-800 rounded-lg shadow">
                        <FaShoppingBag className="text-6xl text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">Giỏ hàng của bạn đang trống.</p>
                        <Link to="/" className="text-blue-400 hover:underline font-semibold">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : !checkoutSuccess && ( // Chỉ hiển thị giỏ hàng nếu chưa checkout thành công
                    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        {/* Header của bảng giỏ hàng */}
                        <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 border-b border-gray-700 font-semibold text-sm text-gray-400">
                            <div className="col-span-2">Sản phẩm</div>
                            <div className="text-center">Đơn giá</div>
                            <div className="text-center">Số lượng</div>
                            <div className="text-right">Thành tiền</div>
                            <div className="text-right">Xóa</div>
                        </div>

                        {/* Danh sách sản phẩm trong giỏ */}
                        <div className="divide-y divide-gray-700">
                            {cartItems.map(item => (
                                <div key={item.product_id} className="grid grid-cols-6 gap-4 items-center px-4 py-4 md:px-6">
                                    {/* Thông tin sản phẩm */}
                                    <div className="col-span-6 md:col-span-2 flex items-center gap-3">
                                        <img
                                            src={item.imageurl || '/placeholder-image.png'}
                                            alt={item.name}
                                            className="w-16 h-16 object-contain bg-white rounded flex-shrink-0"
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.png'; }}
                                        />
                                        <div>
                                            <Link to={`/product/${item.product_id}`} className="font-semibold text-sm hover:text-blue-400 line-clamp-2">
                                                {item.name}
                                            </Link>
                                        </div>
                                    </div>
                                    {/* Đơn giá */}
                                    <div className="col-span-2 md:col-span-1 text-left md:text-center text-sm">
                                        <span className="md:hidden font-semibold text-gray-400 mr-2">Đơn giá: </span>
                                        {formatCurrencyVND(item.price)}
                                    </div>
                                    {/* Số lượng */}
                                    <div className="col-span-2 md:col-span-1 text-left md:text-center">
                                        <span className="md:hidden font-semibold text-gray-400 mr-2">SL: </span>
                                        <div className="inline-flex items-center border border-gray-600 rounded">
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded-l text-lg"
                                                aria-label="Giảm số lượng"
                                            >-</button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.product_id, e.target.value)}
                                                min="1"
                                                className="w-10 text-center bg-gray-700 border-l border-r border-gray-600 py-0.5 text-sm focus:outline-none"
                                                aria-label={`Số lượng cho ${item.name}`}
                                            />
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded-r text-lg"
                                                aria-label="Tăng số lượng"
                                            >+</button>
                                        </div>
                                    </div>
                                    {/* Thành tiền */}
                                    <div className="col-span-1 md:col-span-1 text-right text-sm font-semibold">
                                         <span className="md:hidden font-semibold text-gray-400 mr-2">Tổng: </span>
                                         {formatCurrencyVND(item.price * item.quantity)}
                                    </div>
                                    {/* Nút xóa */}
                                    <div className="col-span-1 md:col-span-1 text-right">
                                        <button
                                            onClick={() => removeFromCart(item.product_id)}
                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                            title={`Xóa ${item.name}`}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tổng kết và nút */}
                        <div className="px-6 py-4 border-t border-gray-700 md:flex md:justify-between md:items-center">
                            <div className="mb-4 md:mb-0">
                                <button
                                    onClick={clearCart}
                                    className="text-sm text-gray-400 hover:text-red-500 hover:underline"
                                >
                                    Xóa toàn bộ giỏ hàng
                                </button>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold mb-2">
                                    Tổng cộng ({cartItemCount} sản phẩm):
                                    <span className="text-xl text-red-500 ml-2">{formatCurrencyVND(cartTotal)}</span>
                                </p>
                                {/* *** CHECKOUT: Nút này gọi handleCheckout *** */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={checkoutLoading}
                                    className={`inline-flex items-center justify-center w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800 ${checkoutLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {checkoutLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaShoppingBag className="mr-2" />}
                                    {checkoutLoading ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserCart;
