// src/components/ProductList.jsx (Ví dụ cải thiện)
import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaCartPlus } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Import motion

// Giả sử bạn có ProductCard component
function ProductCard({ product }) {
    // Hàm render sao (ví dụ)
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0; // Không dùng trong ví dụ này vì rating là .1
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<FaStar key={i} className="text-yellow-400" />);
            } else {
                 // Logic cho nửa sao hoặc sao rỗng (ví dụ chỉ dùng sao rỗng)
                 stars.push(<FaRegStar key={i} className="text-gray-300" />);
            }
        }
         return <div className="flex items-center gap-0.5">{stars}</div>;
    };

    // Định dạng giá (ví dụ)
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

     // Animation cho card khi hover hoặc xuất hiện
     const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        hover: { scale: 1.03, transition: { duration: 0.2 } }
    };

    return (
         // Sử dụng motion.div thay vì div thường
        <motion.div
             className="group border border-border rounded-lg overflow-hidden bg-surface shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
             variants={cardVariants} // Áp dụng variants
             initial="hidden" // Trạng thái ban đầu (nếu muốn animation xuất hiện)
             whileInView="visible" // Kích hoạt khi vào viewport
             viewport={{ once: true, amount: 0.2 }} // Cấu hình viewport trigger
             whileHover="hover" // Animation khi hover
         >
            <Link to={`/product/${product.product_id}`} className="block overflow-hidden aspect-square"> {/* Giữ tỉ lệ vuông */}
                 {/* Sử dụng ảnh thật, có placeholder nếu ảnh lỗi hoặc chưa load */}
                 <img
                    src={product.imageurl || '/placeholder-product.png'} // URL ảnh thật hoặc placeholder
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2" // object-contain để không bị cắt
                    loading="lazy" // Lazy loading
                     onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-product.png'; }} // Fallback nếu ảnh lỗi
                 />
            </Link>
            <div className="p-3 md:p-4 flex flex-col flex-grow">
                <h3 className="text-sm font-medium text-text-main mb-1 h-10 overflow-hidden"> {/* Giới hạn 2 dòng */}
                    <Link to={`/product/${product.product_id}`} className="hover:text-primary line-clamp-2">
                        {product.name}
                    </Link>
                </h3>
                 {/* <p className="text-xs text-text-muted mb-2 line-clamp-2">{product.description}</p> */}
                 <div className="mt-auto"> {/* Đẩy giá, rating, nút xuống dưới */}
                    <p className="text-lg font-semibold text-red-600 mb-1">{formatPrice(product.price)}</p>
                     <div className="flex items-center justify-between mb-2">
                        {renderStars(product.rated_stars || 0)}
                        {/* <span className="text-xs text-text-muted">({product.reviewCount || 0})</span> */}
                     </div>
                    <button className="w-full bg-primary text-text-on-primary text-sm font-semibold py-2 rounded hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                        <FaCartPlus /> Thêm vào giỏ
                    </button>
                 </div>
            </div>
        </motion.div>
    );
}


function ProductList({ productsList }) {
    if (!productsList || productsList.length === 0) {
        return <p className="text-center text-text-muted py-4">Không có sản phẩm nào.</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {productsList.map(product => (
                <ProductCard key={product.product_id} product={product} />
            ))}
        </div>
    );
}

export default ProductList;