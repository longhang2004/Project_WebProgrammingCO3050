// File: frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// *** FIX: Không cần import useCart hoặc useContext(CartContext) ở đây nữa ***

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = 'authToken';
const USER_INFO_KEY = 'userInfo';

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const navigate = useNavigate();

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
                 console.warn("AuthContext: Token found but no user info in localStorage. User might need to re-login or info fetched.");
                 // Nếu bạn có API để lấy user info từ token, có thể gọi ở đây
            }
        } else {
             // Đảm bảo userInfo là null nếu không có token
             setUserInfo(null);
             localStorage.removeItem(USER_INFO_KEY); // Dọn dẹp nếu chỉ có userInfo mà không có token
        }
        setLoadingAuth(false);
    }, []);

    const login = (userData) => {
        try {
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData));
            setUserInfo(userData);
            // CartContext sẽ tự động phản ứng với sự thay đổi của userInfo
        } catch (e) {
            console.error("AuthContext: Failed to save user info", e);
        }
    };

    const logout = () => {
        console.log("AuthContext: logout initiated");
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
        setUserInfo(null); // CartContext sẽ theo dõi sự thay đổi này
        // Không gọi clearCart() trực tiếp từ đây nữa
        navigate('/login');
    };

    const updateAuthUserInfo = (updatedUserData) => {
         try {
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(updatedUserData));
            setUserInfo(updatedUserData);
        } catch (e) {
            console.error("AuthContext: Failed to update user info", e);
        }
    };

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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};