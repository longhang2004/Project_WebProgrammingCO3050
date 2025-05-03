// src/pages/user/UserCart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Import useCart
import { useAuth } from '../../context/AuthContext'; // Import useAuth để lấy thông tin user khi checkout
import { FaTrashAlt, FaShoppingBag, FaSpinner } from 'react-icons/fa'; // Icons

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

function UserCart() {
    const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, cartItemCount } = useCart();
    const { userInfo } = useAuth(); // Lấy thông tin người dùng hiện tại
    const navigate = useNavigate();
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');
    const [checkoutSuccess, setCheckoutSuccess] = useState('');

    const handleQuantityChange = (productId, newQuantity) => {
        const quantity = parseInt(newQuantity, 10);
        if (!isNaN(quantity) && quantity >= 1) {
            updateQuantity(productId, quantity);
        } else if (newQuantity === '') {
             // Cho phép xóa input nhưng không cập nhật nếu rỗng
        } else {
            updateQuantity(productId, 1); // Đặt lại là 1 nếu nhập không hợp lệ
        }
    };

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        setCheckoutError('');
        setCheckoutSuccess('');

        if (!userInfo) {
            setCheckoutError('Vui lòng đăng nhập để tiến hành thanh toán.');
            setCheckoutLoading(false);
            // Có thể điều hướng đến trang đăng nhập
            // navigate('/login?redirect=/cart');
            return;
        }

        if (cartItems.length === 0) {
             setCheckoutError('Giỏ hàng của bạn đang trống.');
             setCheckoutLoading(false);
             return;
         }

        // Chuẩn bị dữ liệu gửi lên API /api/order
        const orderData = {
            user_id: userInfo.user_id,
            // Lấy địa chỉ từ user profile hoặc yêu cầu nhập mới
            shipping_address: userInfo.address || 'Vui lòng cập nhật địa chỉ',
            // Chọn phương thức thanh toán (ở đây ví dụ là 'credit_card')
            payment_method: 'credit_card',
            // Danh sách các sản phẩm trong đơn hàng
            order_items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                // Không cần gửi giá ở đây, backend sẽ tự tính lại dựa trên product_id
            })),
        };

        try {
            const response = await fetch('http://localhost/Project_WebProgrammingCO3050/backend/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Thêm Authorization nếu API yêu cầu
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            // --- Thanh toán (Tạo đơn hàng) thành công ---
            setCheckoutSuccess(`Đặt hàng thành công! Mã đơn hàng của bạn là: ${result.data.order_id}.`);
            clearCart(); // Xóa giỏ hàng sau khi đặt hàng thành công
            // Có thể chuyển hướng đến trang cảm ơn hoặc chi tiết đơn hàng
            // setTimeout(() => navigate(`/order/${result.data.order_id}`), 3000);

        } catch (err) {
            console.error('Lỗi đặt hàng:', err);
            setCheckoutError(err.message || 'Đã có lỗi xảy ra khi đặt hàng.');
        } finally {
            setCheckoutLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Giỏ Hàng Của Bạn</h1>

                {checkoutError && <p className="mb-4 text-center text-red-400 bg-red-900/50 p-3 rounded">{checkoutError}</p>}
                {checkoutSuccess && <p className="mb-4 text-center text-green-400 bg-green-900/50 p-3 rounded">{checkoutSuccess}</p>}

                {cartItems.length === 0 && !checkoutSuccess ? (
                    <div className="text-center py-10 bg-gray-800 rounded-lg shadow">
                        <FaShoppingBag className="text-6xl text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">Giỏ hàng của bạn đang trống.</p>
                        <Link to="/" className="text-blue-400 hover:underline font-semibold">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : !checkoutSuccess && (
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
                                    {/* Thông tin sản phẩm (Mobile + Desktop) */}
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
                                            {/* Hiển thị thêm lựa chọn (màu, size...) nếu có */}
                                            {/* <p className="text-xs text-gray-400">Màu: {item.color}</p> */}
                                        </div>
                                    </div>

                                    {/* Đơn giá (Mobile + Desktop) */}
                                    <div className="col-span-2 md:col-span-1 text-left md:text-center text-sm">
                                        <span className="md:hidden font-semibold text-gray-400 mr-2">Đơn giá: </span>
                                        {formatCurrency(item.price)}
                                    </div>

                                    {/* Số lượng (Mobile + Desktop) */}
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

                                    {/* Thành tiền (Mobile + Desktop) */}
                                    <div className="col-span-1 md:col-span-1 text-right text-sm font-semibold">
                                         <span className="md:hidden font-semibold text-gray-400 mr-2">Tổng: </span>
                                        {formatCurrency(item.price * item.quantity)}
                                    </div>

                                    {/* Nút xóa (Mobile + Desktop) */}
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
                                    <span className="text-xl text-red-500 ml-2">{formatCurrency(cartTotal)}</span>
                                </p>
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
