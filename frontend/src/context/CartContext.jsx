// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'shoppingCart';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);

    // Load cart từ localStorage khi provider mount
    useEffect(() => {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("CartContext: Failed to parse cart items", e);
                localStorage.removeItem(CART_STORAGE_KEY);
            }
        }
        setLoadingCart(false);
    }, []);

    // Lưu cart vào localStorage mỗi khi cartItems thay đổi
    useEffect(() => {
        // Chỉ lưu khi đã load xong lần đầu
        if (!loadingCart) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        }
    }, [cartItems, loadingCart]);

    // Hàm thêm sản phẩm vào giỏ
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            // Kiểm tra xem sản phẩm đã có trong giỏ chưa (dựa trên product_id)
            const existingItemIndex = prevItems.findIndex(item => item.product_id === product.product_id);

            if (existingItemIndex > -1) {
                // Nếu đã có, cập nhật số lượng
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                // Đảm bảo số lượng không âm (mặc dù ở đây chỉ cộng)
                if (updatedItems[existingItemIndex].quantity <= 0) {
                     updatedItems[existingItemIndex].quantity = 1;
                }
                return updatedItems;
            } else {
                // Nếu chưa có, thêm mới vào giỏ với số lượng ban đầu
                // Chỉ lấy những thông tin cần thiết của product để lưu vào giỏ
                const newItem = {
                    product_id: product.product_id,
                    name: product.name,
                    price: product.price, // Nên lấy giá chính xác tại thời điểm thêm
                    imageurl: product.imageurl,
                    quantity: quantity,
                    // Thêm các thuộc tính khác nếu cần (ví dụ: màu sắc, bộ nhớ đã chọn)
                    // color: selectedColor,
                    // storage: selectedStorage,
                };
                return [...prevItems, newItem];
            }
        });
        // Có thể thêm thông báo đã thêm thành công ở đây
        console.log(`Added ${quantity} of ${product.name} to cart.`);
        // Ví dụ: alert(`${product.name} đã được thêm vào giỏ hàng!`);
    };

    // Hàm cập nhật số lượng sản phẩm
    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.product_id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item // Đảm bảo số lượng >= 1
            );
            return updatedItems;
        });
    };

    // Hàm xóa sản phẩm khỏi giỏ
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));
    };

    // Hàm xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([]);
        // localStorage cũng sẽ tự động được cập nhật bởi useEffect
    };

    // Tính tổng số lượng sản phẩm trong giỏ
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Tính tổng tiền
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);


    const value = {
        cartItems,
        loadingCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItemCount, // Số lượng item hiển thị trên icon
        cartTotal,     // Tổng tiền
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Hook tùy chỉnh
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
