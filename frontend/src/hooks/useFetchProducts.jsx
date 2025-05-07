// src/hooks/useFetchProducts.js
import { useState, useEffect, useCallback } from 'react';

// Hàm fetch gốc (hoặc import nếu đã tách file)
const fetchProductsAPI = async (endpoint, page = 1, perPage = 5) => {
    const apiUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/product/${endpoint}?page=${page}&per_page=${perPage}`;
    console.log(`Workspaceing: ${apiUrl}`);
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData?.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Kiểm tra kỹ cấu trúc data trả về từ API của bạn
        if (data.success && Array.isArray(data.data?.data)) {
             // Đảm bảo có trường imageurl hoặc gán giá trị mặc định nếu thiếu
             return data.data.data.map(product => ({
                ...product,
                imageurl: product.imageurl || 'placeholder-image.jpg' // Thay bằng URL placeholder thực tế
            }));
        } else if (data.success && data.data === null) { // API trả về null khi không có sản phẩm
             return []; // Trả về mảng rỗng
        }
         else {
            throw new Error(data.message || 'Invalid data structure from API');
        }
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
};

export const useFetchProducts = (endpoint, page = 1, perPage = 5) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProductsAPI(endpoint, page, perPage);
            setProducts(data);
        } catch (err) {
            setError(err.message);
             setProducts([]); // Reset sản phẩm khi có lỗi
        } finally {
            setLoading(false);
        }
    }, [endpoint, page, perPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]); // Chỉ gọi lại khi callback thay đổi

    return { products, loading, error, refetch: fetchData }; // Trả về cả hàm refetch nếu cần
};