// src/components/ProductList.jsx
import React from "react";
import { Link } from "react-router-dom"; // Đảm bảo đã import Link

// Hàm định dạng tiền tệ (ví dụ)
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return amount; // Trả về nguyên gốc nếu không phải số
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

function ProductList({ productsList }) { // Nhận productsList làm prop
  if (!productsList || productsList.length === 0) {
    return <p className="text-center text-white py-10">Không có sản phẩm nào để hiển thị.</p>;
  }

  return (
    // Bỏ md:px-[100px] và my-8 vì đã có ở component cha (ProductByType)
    // Điều chỉnh số cột cho phù hợp với màn hình
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {productsList.map((product) => (
        // Bọc toàn bộ card sản phẩm bằng Link hoặc chỉ các phần cần click
        // Sử dụng product.product_id để tạo URL động
        <div key={product.product_id} className="border border-gray-700 rounded-lg overflow-hidden shadow-md bg-gray-800 flex flex-col hover:shadow-lg hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-1">
          {/* Link bao quanh ảnh và tên */}
          <Link to={`/product/${product.product_id}`} className="block group">
            <div className="aspect-square overflow-hidden bg-white"> {/* Đảm bảo ảnh vuông vắn */}
                <img
                  src={product.imageurl || '/placeholder-image.png'} // Dùng ảnh thật hoặc placeholder
                  alt={product.name}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" // Thêm hiệu ứng zoom nhẹ khi hover
                  onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.png'; }} // Xử lý ảnh lỗi
                />
            </div>
            <div className="p-3 flex-grow flex flex-col justify-between">
              <div> {/* Nhóm tên và đánh giá */}
                <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200" title={product.name}> {/* Giới hạn 2 dòng, đổi màu khi hover */}
                  {product.name}
                </h3>
                {/* Có thể thêm đánh giá sao ở đây nếu có */}
                {product.rated_stars > 0 && (
                  <div className="flex items-center text-yellow-400 text-xs mb-1">
                    <span>{'★'.repeat(Math.floor(product.rated_stars))}</span>
                    <span className="text-gray-500">{'☆'.repeat(5 - Math.floor(product.rated_stars))}</span>
                    {/* <span className="ml-1 text-gray-400">({product.rated_stars.toFixed(1)})</span> */}
                  </div>
                )}
              </div>
               {/* Giá sản phẩm */}
              <p className="text-red-500 font-bold text-base mt-1">
                {product.price ? formatCurrency(product.price) : 'Liên hệ'}
              </p>
            </div>
          </Link>
          {/* Nút có thể để ngoài Link nếu cần xử lý khác */}
          {/* <div className="p-3 pt-0">
             <Link
               to={`/product/${product.product_id}`}
               className="block w-full bg-blue-600 text-white text-center px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition duration-200"
             >
               Xem chi tiết
             </Link>
          </div> */}
        </div>
      ))}
    </div>
  );
}

export default ProductList;
