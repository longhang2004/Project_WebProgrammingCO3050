// File: frontend/src/context/CartContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // CartContext phụ thuộc vào AuthContext

const CartContext = createContext(null);
const CART_STORAGE_KEY_GUEST = 'shoppingCart_guest'; // Key cho giỏ hàng của khách

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartInitialized, setIsCartInitialized] = useState(false);
    const { userInfo } = useAuth(); // Lấy userInfo từ AuthContext

    // --- Helper function to get token ---
    const getToken = useCallback(() => localStorage.getItem('authToken'), []);

    // --- API Callers (giữ nguyên từ phiên bản trước) ---
    const fetchCartFromDB = useCallback(async () => {
        const token = getToken();
        if (!token) return null;
        try {
            console.log("[CartContext] Fetching cart from DB...");
            const response = await fetch('http://localhost/Project_WebProgrammingCO3050/backend/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error("Error fetching cart from DB:", response.status, errData.message);
                if (response.status === 401 && userInfo) { /* User was logged in, but token expired */ }
                return null;
            }
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                console.log("[CartContext] Cart fetched from DB:", result.data);
                return result.data;
            }
            console.warn("[CartContext] Cart from DB was not successful or data is not an array:", result);
            return null;
        } catch (error) {
            console.error("[CartContext] Exception fetching cart from DB:", error);
            return null;
        }
    }, [getToken, userInfo]); // Thêm userInfo vào dependencies

    const syncCartItemToDB = useCallback(async (productId, quantity) => {
        const token = getToken();
        if (!token || !userInfo) return; // Chỉ sync khi đã đăng nhập
        console.log(`[CartContext] Syncing item to DB: pId=${productId}, qty=${quantity}`);
        try {
            const response = await fetch('http://localhost/Project_WebProgrammingCO3050/backend/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ product_id: productId, quantity: quantity })
            });
            if (!response.ok) { /* ... error handling ... */ }
            else { const result = await response.json(); console.log("[CartContext] Item sync to DB successful:", result.item); }
        } catch (error) { console.error("[CartContext] Exception syncing item to DB:", error); }
    }, [getToken, userInfo]);

    const removeItemFromDB = useCallback(async (productId) => {
        const token = getToken();
        if (!token || !userInfo) return;
        console.log(`[CartContext] Removing item from DB: pId=${productId}`);
        try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/cart/${productId}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) { /* ... error handling ... */ } else { console.log("[CartContext] Item removed from DB successfully."); }
        } catch (error) { console.error("[CartContext] Exception removing item from DB:", error); }
    }, [getToken, userInfo]);

    const clearCartInDB = useCallback(async () => {
        const token = getToken();
        if (!token || !userInfo) return;
        console.log("[CartContext] Clearing cart in DB...");
        try {
            const response = await fetch('http://localhost/Project_WebProgrammingCO3050/backend/api/cart', {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) { /* ... error handling ... */ } else { console.log("[CartContext] Cart cleared in DB successfully."); }
        } catch (error) { console.error("[CartContext] Exception clearing cart in DB:", error); }
    }, [getToken, userInfo]);


    // --- Khởi tạo và Đồng bộ Giỏ hàng ---
    useEffect(() => {
        const initializeCart = async () => {
            console.log("[CartContext] initializeCart triggered. UserInfo:", !!userInfo);
            if (userInfo) { // User ĐÃ ĐĂNG NHẬP
                console.log("[CartContext] User is logged in. Fetching DB cart...");
                const dbCart = await fetchCartFromDB();
                const guestCartString = localStorage.getItem(CART_STORAGE_KEY_GUEST);
                let guestCart = [];
                if (guestCartString) {
                    try { guestCart = JSON.parse(guestCartString); } catch (e) { /* ignore */ }
                }

                if (dbCart) {
                    // Có giỏ hàng trên DB, sử dụng nó.
                    // Nếu có giỏ hàng guest, có thể merge hoặc thông báo cho user.
                    // Hiện tại: Ưu tiên DB, xóa guest cart.
                    console.log("[CartContext] DB cart found. Merging/Overwriting guest cart (if any). Items:", dbCart);
                    setCartItems(dbCart);
                    if (guestCart.length > 0) {
                        // TODO: Implement merge logic if desired. For now, DB cart wins.
                        // Example: await Promise.all(guestCart.map(item => syncCartItemToDB(item.product_id, item.quantity)));
                        console.log("[CartContext] Guest cart existed, will be overwritten by DB cart or merged.");
                    }
                    localStorage.removeItem(CART_STORAGE_KEY_GUEST);
                } else if (guestCart.length > 0) {
                    // Không có DB cart, nhưng có guest cart -> Đồng bộ guest cart lên DB
                    console.log("[CartContext] No DB cart, syncing guest cart to DB:", guestCart);
                    setCartItems(guestCart); // Cập nhật state trước
                    await Promise.all(guestCart.map(item => syncCartItemToDB(item.product_id, item.quantity)));
                    localStorage.removeItem(CART_STORAGE_KEY_GUEST); // Xóa guest cart sau khi đồng bộ
                } else {
                    // Không có DB cart và không có guest cart
                    console.log("[CartContext] No DB cart and no guest cart.");
                    setCartItems([]);
                }
            } else { // User CHƯA ĐĂNG NHẬP (Guest)
                console.log("[CartContext] User is a guest. Loading cart from localStorage.");
                const storedCart = localStorage.getItem(CART_STORAGE_KEY_GUEST);
                if (storedCart) {
                    try {
                        const parsedCart = JSON.parse(storedCart);
                        if (Array.isArray(parsedCart)) {
                            setCartItems(parsedCart);
                        } else { setCartItems([]); }
                    } catch (e) {
                        console.error("[CartContext] Failed to parse guest cart, starting empty.", e);
                        localStorage.removeItem(CART_STORAGE_KEY_GUEST);
                        setCartItems([]);
                    }
                } else {
                    setCartItems([]);
                }
            }
            setIsCartInitialized(true);
        };
        initializeCart();
    }, [userInfo, fetchCartFromDB, syncCartItemToDB]); // Phụ thuộc vào userInfo và các hàm fetch/sync


    // *** FIX: useEffect để xử lý khi logout (userInfo trở thành null) ***
    // Theo dõi sự thay đổi của userInfo. Nếu userInfo từ có giá trị chuyển thành null (logout),
    // thì reset cartItems về mảng rỗng (cho phiên guest mới).
    // Việc này không xóa giỏ hàng trên DB của user vừa logout.
    const [prevUserInfo, setPrevUserInfo] = useState(userInfo);
    useEffect(() => {
        if (prevUserInfo && !userInfo) { // User vừa logout (từ có userInfo -> không có userInfo)
            console.log("[CartContext] User logged out. Resetting local cart state for new guest session.");
            setCartItems([]); // Reset giỏ hàng local cho phiên làm việc của khách mới
            // Không cần xóa localStorage ở đây vì useEffect dưới sẽ xử lý khi userInfo là null
        }
        setPrevUserInfo(userInfo); // Cập nhật prevUserInfo cho lần so sánh tiếp theo
    }, [userInfo, prevUserInfo]);


    // Lưu local cart (chỉ khi chưa đăng nhập và cart đã khởi tạo)
    useEffect(() => {
        if (isCartInitialized && !userInfo && cartItems !== undefined) {
            // console.log("[CartContext] Guest cart changed, saving to localStorage:", cartItems);
            localStorage.setItem(CART_STORAGE_KEY_GUEST, JSON.stringify(cartItems));
        }
    }, [cartItems, userInfo, isCartInitialized]);


    // --- Hàm Cart Actions ---
    const addToCart = (product, quantity = 1) => {
        const numericQuantity = Number(quantity);
        if (isNaN(numericQuantity) || numericQuantity < 1) return;

        setCartItems(prevItems => {
            const currentItems = Array.isArray(prevItems) ? prevItems : [];
            const existingItemIndex = currentItems.findIndex(item => item.product_id === product.product_id);
            let newCartItems;

            if (existingItemIndex > -1) {
                newCartItems = currentItems.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: (Number(item.quantity) || 0) + numericQuantity }
                        : item
                );
            } else {
                const newItem = {
                    product_id: product.product_id,
                    name: product.name,
                    price: product.price,
                    imageurl: product.imageurl,
                    quantity: numericQuantity,
                };
                newCartItems = [...currentItems, newItem];
            }
            if (userInfo) { // Nếu đã đăng nhập, đồng bộ lên DB
                const itemToSync = newCartItems.find(i => i.product_id === product.product_id);
                if(itemToSync) syncCartItemToDB(itemToSync.product_id, itemToSync.quantity);
            }
            return newCartItems;
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        const quantityNum = Number(newQuantity);
        if (isNaN(quantityNum)) return;

        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.product_id === productId
                ? { ...item, quantity: Math.max(0, quantityNum) }
                : item
            ).filter(item => item.quantity > 0);

            if (userInfo) {
                if (quantityNum > 0) {
                    syncCartItemToDB(productId, quantityNum);
                } else {
                    removeItemFromDB(productId);
                }
            }
            return updatedItems;
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));
        if (userInfo) {
            removeItemFromDB(productId);
        }
    };

    // clearCart này sẽ xóa local state và DB nếu đăng nhập, hoặc chỉ local state và localStorage nếu là guest
    const clearCart = () => {
        console.log("[CartContext] clearCart called by user action or checkout.");
        setCartItems([]); // Luôn xóa local state
        if (userInfo) {
            clearCartInDB(); // Xóa trên DB nếu đăng nhập
        } else {
            // Nếu là guest, useEffect lưu cartItems (mảng rỗng) vào localStorage sẽ tự động xóa
            // Hoặc có thể xóa trực tiếp: localStorage.removeItem(CART_STORAGE_KEY_GUEST);
        }
    };

    const cartItemCount = Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0) : 0;
    const cartTotal = Array.isArray(cartItems) ? cartItems.reduce((total, item) => total + ((Number(item.price || item.product_price) || 0) * (Number(item.quantity) || 0)), 0) : 0;

    const value = {
        cartItems,
        isCartInitialized,
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

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};