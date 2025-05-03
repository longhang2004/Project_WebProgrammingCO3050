// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Tạo Context object
const AuthContext = createContext(null);

// Tạo Provider component
export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true); // Thêm state loading để kiểm tra localStorage ban đầu
    const navigate = useNavigate();

    // Kiểm tra localStorage khi provider được mount lần đầu
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            try {
                setUserInfo(JSON.parse(storedUserInfo));
            } catch (e) {
                console.error("AuthContext: Failed to parse user info", e);
                localStorage.removeItem('userInfo');
            }
        }
        setLoading(false); // Đánh dấu đã kiểm tra xong
    }, []);

    // Hàm login: cập nhật state và localStorage
    const login = (userData) => {
        try {
            localStorage.setItem('userInfo', JSON.stringify(userData));
            setUserInfo(userData);
            navigate('/'); // Chuyển về trang chủ sau khi login thành công
        } catch (e) {
            console.error("AuthContext: Failed to save user info", e);
        }
    };

    // Hàm logout: xóa state và localStorage
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        navigate('/login'); // Chuyển về trang đăng nhập
    };

    // Giá trị cung cấp bởi Context
    const value = {
        userInfo,
        loadingAuth: loading, // Đổi tên để tránh trùng lặp nếu component khác cũng có state loading
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tùy chỉnh để sử dụng AuthContext dễ dàng hơn
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};