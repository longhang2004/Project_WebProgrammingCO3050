// File: frontend/src/context/CartContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'shoppingCart';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // *** FIX: Khởi tạo state trực tiếp từ localStorage ***
        // Điều này tránh một lần render không cần thiết ban đầu
        console.log("CartProvider: Initializing state from localStorage...");
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                if (Array.isArray(parsedCart)) {
                    console.log("CartProvider: Initial state loaded:", parsedCart);
                    return parsedCart;
                }
            } catch (e) {
                console.error("CartContext: Failed to parse initial cart items, starting empty.", e);
                localStorage.removeItem(CART_STORAGE_KEY); // Xóa dữ liệu lỗi
            }
        }
        console.log("CartProvider: No valid initial cart found, starting empty.");
        return []; // Trả về mảng rỗng nếu không có gì hoặc lỗi
    });
    // Không cần state loadingCart nữa vì đã khởi tạo trực tiếp
    // const [loadingCart, setLoadingCart] = useState(true);

    // Bỏ useEffect load từ localStorage vì đã làm ở useState initializer
    // useEffect(() => { ... }, []);

    // Lưu cart vào localStorage mỗi khi cartItems thay đổi
    useEffect(() => {
        // Chỉ lưu khi cartItems đã được khởi tạo (không phải undefined)
        if (cartItems !== undefined) {
            // console.log("CartProvider: Saving cart to localStorage:", cartItems); // Giảm log
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        }
    }, [cartItems]);

    // Hàm thêm sản phẩm vào giỏ
    const addToCart = (product, quantity = 1) => {
        console.log("[addToCart] Called with product:", product.name, "quantity:", quantity); // Log khi hàm được gọi

        setCartItems(prevItems => {
            // Log trạng thái trước khi cập nhật
            console.log("[addToCart] Previous cartItems:", prevItems);
            const currentItems = Array.isArray(prevItems) ? prevItems : [];
            const existingItemIndex = currentItems.findIndex(item => item.product_id === product.product_id);

            let updatedItems; // Khai báo biến để lưu kết quả

            if (existingItemIndex > -1) {
                console.log(`[addToCart] Item ${product.name} exists at index ${existingItemIndex}. Current quantity: ${currentItems[existingItemIndex].quantity}`);
                // *** FIX: Tạo mảng mới hoàn toàn thay vì sửa đổi trực tiếp ***
                updatedItems = currentItems.map((item, index) => {
                    if (index === existingItemIndex) {
                        // Tạo object mới cho item cần cập nhật
                        const newQuantity = (item.quantity || 0) + quantity; // Đảm bảo item.quantity là số
                        console.log(`[addToCart] Updating quantity for ${item.name} to ${newQuantity}`);
                        return { ...item, quantity: newQuantity };
                    }
                    return item; // Giữ nguyên các item khác
                });
            } else {
                console.log(`[addToCart] Item ${product.name} is new. Adding with quantity ${quantity}`);
                const newItem = {
                    product_id: product.product_id,
                    name: product.name,
                    price: product.price,
                    imageurl: product.imageurl,
                    quantity: quantity,
                };
                // Tạo mảng mới bằng cách thêm item mới
                updatedItems = [...currentItems, newItem];
            }

            console.log("[addToCart] Updated cartItems:", updatedItems); // Log trạng thái sau khi cập nhật
            return updatedItems; // Trả về mảng mới
        });
    };


    // Hàm cập nhật số lượng sản phẩm
    const updateQuantity = (productId, newQuantity) => {
        const quantityNum = Number(newQuantity); // Chuyển thành số
        console.log(`[updateQuantity] Called for productId: ${productId}, newQuantity: ${quantityNum}`); // DEBUG

        setCartItems(prevItems => {
            const currentItems = Array.isArray(prevItems) ? prevItems : [];
            // Chỉ cập nhật nếu quantity là số hợp lệ >= 1
            if (isNaN(quantityNum) || quantityNum < 1) {
                 console.warn(`[updateQuantity] Invalid quantity (${newQuantity}), not updating.`);
                 return currentItems; // Trả về state cũ nếu số lượng không hợp lệ
            }

            const updatedItems = currentItems.map(item =>
                item.product_id === productId
                ? { ...item, quantity: quantityNum } // Cập nhật số lượng
                : item
            );
             console.log("[updateQuantity] Updated cartItems:", updatedItems); // DEBUG
            return updatedItems;
        });
    };

    // Hàm xóa sản phẩm khỏi giỏ
    const removeFromCart = (productId) => {
         console.log(`[removeFromCart] Called for productId: ${productId}`); // DEBUG
        setCartItems(prevItems => {
            const currentItems = Array.isArray(prevItems) ? prevItems : [];
            const updatedItems = currentItems.filter(item => item.product_id !== productId);
             console.log("[removeFromCart] Updated cartItems:", updatedItems); // DEBUG
            return updatedItems;
        });
    };

    // Hàm xóa toàn bộ giỏ hàng
    const clearCart = () => {
        console.log("[clearCart] Called"); // DEBUG
        setCartItems([]); // Set về mảng rỗng
        // localStorage sẽ tự cập nhật qua useEffect
    };

    // Tính tổng số lượng sản phẩm trong giỏ
    const cartItemCount = Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0) : 0;

    // Tính tổng tiền
    const cartTotal = Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0) : 0;


    const value = {
        cartItems,
        // loadingCart, // Bỏ loadingCart
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        cartTotal,
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
    // *** FIX: Trả về context thay vì null ***
    return context;
};
