import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Tạo Context object
const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = 'authToken'; // Key để lưu token trong localStorage
const USER_INFO_KEY = 'userInfo';   // Key để lưu thông tin user

// Tạo Provider component
export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    // *** JWT Change: Đổi tên loading thành loadingAuth để rõ ràng hơn ***
    const [loadingAuth, setLoadingAuth] = useState(true);
    const navigate = useNavigate();

    // Kiểm tra localStorage khi provider được mount lần đầu
    useEffect(() => {
        // *** JWT Change: Kiểm tra cả token và userInfo ***
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const storedUserInfo = localStorage.getItem(USER_INFO_KEY);

        if (storedToken) {
            // Nếu có token, cố gắng lấy userInfo (có thể cần gọi API /profile sau này để xác thực token và lấy info mới nhất)
            if (storedUserInfo) {
                try {
                    setUserInfo(JSON.parse(storedUserInfo));
                } catch (e) {
                    console.error("AuthContext: Failed to parse user info", e);
                    localStorage.removeItem(USER_INFO_KEY); // Xóa userInfo lỗi
                    localStorage.removeItem(AUTH_TOKEN_KEY); // Xóa cả token nếu userInfo lỗi
                }
            } else {
                // Có token nhưng không có userInfo, có thể cần gọi API để lấy lại
                // Hoặc coi như chưa đăng nhập đầy đủ cho đến khi có userInfo
                // Hiện tại, nếu chỉ dựa vào token thì có thể bỏ qua bước setUserInfo ở đây
                 console.warn("AuthContext: Token found but no user info in localStorage.");
            }
        } else {
             // Nếu không có token, đảm bảo userInfo cũng là null
             setUserInfo(null);
             localStorage.removeItem(USER_INFO_KEY); // Dọn dẹp nếu chỉ còn userInfo mà không có token
        }

        setLoadingAuth(false); // Đánh dấu đã kiểm tra xong
    }, []);

    // Hàm login: cập nhật state và localStorage (userInfo)
    // Việc lưu token sẽ do LoginPage xử lý trực tiếp sau khi gọi API thành công
    const login = (userData) => {
        try {
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData));
            setUserInfo(userData);
            // navigate('/'); // Chuyển hướng có thể thực hiện ở LoginPage
        } catch (e) {
            console.error("AuthContext: Failed to save user info", e);
        }
    };

    // Hàm logout: xóa state, token và userInfo khỏi localStorage
    const logout = () => {
        // *** JWT Change: Xóa cả token và userInfo ***
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
        setUserInfo(null);
        navigate('/login'); // Chuyển về trang đăng nhập
    };

    // Hàm cập nhật thông tin user trong context và localStorage sau khi sửa profile
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
        loadingAuth, // Giữ nguyên tên này
        login,       // Hàm này giờ chỉ cập nhật userInfo state và localStorage
        logout,
        updateAuthUserInfo, // Thêm hàm này
        // *** JWT Change: Không cần thiết phải expose token ở đây, component tự lấy từ localStorage ***
        // getToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
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