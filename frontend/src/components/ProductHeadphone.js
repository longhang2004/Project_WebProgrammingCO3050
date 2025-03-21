import React, { useEffect, useState } from 'react';
// import { apiGetHeadPhone } from '../apis'; 
import { useNavigate } from 'react-router-dom';
 

const ProductHeadphone = () => {
  const [headphones, setHeadphones] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const fetchHeadphones = async () => {
  //   const result = await apiGetHeadPhone();
  //   if (result.success === false) {
  //     setError(result.message);
  //   } else {
  //     setHeadphones(result.productData.slice(0, 5)); 
  //   }
  // };

  // useEffect(() => {
  //   fetchHeadphones();
  // }, []);

  const handleProductClick = (id) => {
    window.scrollTo(0, 0);
    navigate(`/product/${id}`);
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating); 
  };

  return (
    <div className="w-full pt-6">
      <h1 className="text-left text-2xl font-bold uppercase mb-5">Tai nghe</h1>
      {error && <p className="text-red-500 text-center font-bold mb-5">Error: {error}</p>}
      <div className="grid grid-cols-5 gap-6">
        {headphones.length === 0 ? (
          <p className="text-center text-lg font-medium col-span-full">Chưa có sản phẩm</p>
        ) : (
          headphones.map((headphone) => (
            <div
              key={headphone._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-2 transition-transform cursor-pointer hover:border-gray-400 relative"
              onClick={() => handleProductClick(headphone._id)}
            >
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded">
                Trả góp 0%
              </div>

              <div className="p-3">
                <img
                  src={headphone.imageLink}
                  alt={headphone.name}
                  className="w-48 h-48 object-contain bg-white rounded-md"
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 h-12 overflow-hidden uppercase">
                  {headphone.name}
                </h2>
                <p className="text-red-600 text-xl font-extrabold mb-2">{headphone.price.toLocaleString()}đ</p>
                <p className="text-lg text-gray-700 font-bold uppercase mb-2">
                  <span className="text-lg text-gray-600">{headphone.origin.toUpperCase()}</span>
                </p>
                <p className="text-yellow-500 text-base font-medium">
                  {renderStars(headphone.rating || 0)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductHeadphone;