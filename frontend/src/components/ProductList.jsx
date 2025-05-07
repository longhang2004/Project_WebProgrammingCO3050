// File: frontend/src/components/ProductList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart } from 'react-icons/fa';
// *** FIX: Import hàm formatCurrencyVND từ utils ***
import { formatCurrencyVND } from '../utils/currency'; // Giả sử bạn đã tạo file này

// Component hiển thị một sản phẩm trong danh sách
const ProductCard = ({ product }) => {
    if (!product) {
        return null; // Hoặc một placeholder card
    }

    const displayRating = product.rated_stars ? parseFloat(product.rated_stars) : 0;
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 >= 0.5; // Không dùng ở đây, chỉ làm tròn xuống
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Điều chỉnh nếu dùng half-star

    // *** FIX: Sử dụng formatCurrencyVND cho giá sản phẩm ***
    const displayPrice = formatCurrencyVND(product.price);

    return (
        // *** STYLE CHANGE: Thêm bg-white, text-gray-800, shadow-lg ***
        <div className="group bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col h-full border border-gray-200">
            <Link to={`/product/${product.product_id}`} className="block">
                <div className="w-full h-48 md:h-56 overflow-hidden">
                    <img
                        src={product.imageurl || 'https://placehold.co/600x400/e2e8f0/a0aec0?text=Sản+phẩm'}
                        alt={product.name || 'Hình ảnh sản phẩm'}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2" // Thêm padding để ảnh không sát viền
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/e2e8f0/a0aec0?text=Lỗi+Ảnh'; }}
                    />
                </div>
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                {/* *** STYLE CHANGE: Đổi màu chữ thành text-gray-800 hoặc đậm hơn *** */}
                <h3 className="text-md font-semibold text-gray-800 mb-1 h-12 line-clamp-2">
                    <Link to={`/product/${product.product_id}`} className="hover:text-blue-600 transition-colors">
                        {product.name || 'Tên sản phẩm không xác định'}
                    </Link>
                </h3>

                {/* Giá sản phẩm */}
                <p className="text-lg font-bold text-red-600 mb-2">
                    {displayPrice}
                </p>

                {/* Đánh giá sao */}
                <div className="flex items-center text-yellow-400 mb-3">
                    {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
                    {/* Nếu muốn hiển thị sao rỗng cho phần còn lại */}
                    {[...Array(5 - fullStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
                    <span className="ml-2 text-xs text-gray-500">({displayRating > 0 ? displayRating.toFixed(1) : 'Chưa có đánh giá'})</span>
                </div>

                {/* Thông tin thêm (tùy chọn) */}
                {/* <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description || 'Mô tả ngắn gọn...'}</p> */}

                {/* Nút thêm vào giỏ hàng - nên để ở cuối cùng */}
                <div className="mt-auto pt-3 border-t border-gray-200">
                     <button
                        // onClick={() => addToCart(product)} // Cần truyền hàm addToCart từ props nếu muốn dùng ở đây
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                        <FaShoppingCart className="mr-2" /> Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    );
};


// Component danh sách sản phẩm
function ProductList({ productsList, isLoading, error }) {
    if (isLoading) {
        // Hiển thị skeleton loading nếu cần
        return <div className="text-center py-10 text-gray-500">Đang tải sản phẩm...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">Lỗi tải sản phẩm: {error}</div>;
    }

    if (!productsList || productsList.length === 0) {
        return <div className="text-center py-10 text-gray-500">Không có sản phẩm nào để hiển thị.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {productsList.map(product => (
                <ProductCard key={product.product_id} product={product} />
            ))}
        </div>
    );
}

export default ProductList;
