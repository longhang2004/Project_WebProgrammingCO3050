// File: frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext'; // *** FIX: Import useCart ***

// Tạo Context object
const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = 'authToken';
const USER_INFO_KEY = 'userInfo';

// Tạo Provider component
export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const navigate = useNavigate();
    const { clearCart } = useCart(); // *** FIX: Lấy hàm clearCart từ CartContext ***

    // Kiểm tra localStorage khi provider được mount lần đầu
    useEffect(() => {
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const storedUserInfo = localStorage.getItem(USER_INFO_KEY);

        if (storedToken) {
            if (storedUserInfo) {
                try {
                    setUserInfo(JSON.parse(storedUserInfo));
                } catch (e) {
                    console.error("AuthContext: Failed to parse user info", e);
                    localStorage.removeItem(USER_INFO_KEY);
                    localStorage.removeItem(AUTH_TOKEN_KEY);
                }
            } else {
                 console.warn("AuthContext: Token found but no user info in localStorage.");
                 // Consider fetching user info based on token here if needed
            }
        } else {
             setUserInfo(null);
             localStorage.removeItem(USER_INFO_KEY);
        }

        setLoadingAuth(false);
    }, []);

    // Hàm login
    const login = (userData) => {
        try {
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData));
            setUserInfo(userData);
        } catch (e) {
            console.error("AuthContext: Failed to save user info", e);
        }
    };

    // Hàm logout
    const logout = () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
        setUserInfo(null);
        clearCart(); // *** FIX: Gọi clearCart() để xóa giỏ hàng khi logout ***
        navigate('/login');
    };

    // Hàm cập nhật thông tin user
    const updateAuthUserInfo = (updatedUserData) => {
         try {
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(updatedUserData));
            setUserInfo(updatedUserData);
        } catch (e) {
            console.error("AuthContext: Failed to update user info", e);
        }
    };


    // Giá trị cung cấp bởi Context
    const value = {
        userInfo,
        loadingAuth,
        login,
        logout,
        updateAuthUserInfo,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tùy chỉnh
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};