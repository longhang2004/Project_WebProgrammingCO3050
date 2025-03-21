import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import { apiFetchProductByName } from '../apis';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Get search query from URL
  const searchQuery = searchParams.get('query') || '';
  // const fetchProducts = async () => {
  //   if (!searchQuery) return;
    
  //   try {
  //     const result = await apiFetchProductByName(searchQuery);
  //     if (result.success === false) {
  //       setError(result.message);
  //       setProducts([]);
  //     } else {
  //       setProducts(result.productData || []);
  //     }
  //   } catch (err) {
  //     setError('An error occurred while fetching products');
  //     setProducts([]);
  //   }
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, [searchQuery]);

  const handleProductClick = (id) => {
    window.scrollTo(0, 0);
    navigate(`/product/${id}`);
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="w-full p-6">
      <h1 className="mb-5 text-2xl font-bold text-left uppercase">
        Kết quả tìm kiếm cho: "{searchQuery}"
      </h1>
      {error && <p className="mb-5 font-bold text-center text-red-500">Error: {error}</p>}
      <div className="grid grid-cols-5 gap-6">
        {products.length === 0 ? (
          <p className="text-lg font-medium text-center col-span-full">
            Không có sản phẩm nào phù hợp với "{searchQuery}"
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="relative transition-transform bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-2 hover:border-gray-400"
              onClick={() => handleProductClick(product._id)}
            >
              {/* Rest of the product card remains the same */}
              <div className="p-3">
                <img
                  src={product.imageLink}
                  alt={product.name}
                  className="object-contain w-48 h-48 bg-white rounded-md"
                />
              </div>
              <div className="p-4">
                <h2 className="h-12 mb-2 overflow-hidden text-lg font-semibold uppercase">
                  {product.name}
                </h2>
                <p className="mb-2 text-xl font-extrabold text-red-600">
                  {product.price.toLocaleString()}đ
                </p>
                <p className="mb-2 text-lg font-bold text-gray-700 uppercase">
                  <span className="text-lg text-gray-600">{product.origin.toUpperCase()}</span>
                </p>
                <p className="text-base font-medium text-yellow-500">
                  {renderStars(product.rating || 0)}
                </p>
              </div>
            </div>
            
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResult;