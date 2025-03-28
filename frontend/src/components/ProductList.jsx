import React from "react";
import { Link } from "react-router-dom";

function ProductList({productsList}) {
    const products = Array(20).fill({
      name: "Sản phẩm",
      price: "1.000.000đ",
      image: "product.jpg",
    });
  
    return (
      <div className="md:px-[100px] my-8">
        {/* {grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6} */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productsList.map((product, index) => (
            // <Link to={`/product/detail/test`}>
            <div key={index} className="border rounded-md overflow-hidden shadow-md bg-blue-900">
              <img src={product.image} alt={product.name} className="w-full h-48 object-contain bg-white" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p>{product.price}</p>
                {/* <button className="mt-2 bg-primary text-white px-4 py-2 rounded-md">
                  Xem chi tiết
                </button> */}
                <Link to={`/detail/test`} className="block mt-2 bg-primary text-white px-4 py-2 rounded-md box-border text-center">
                  Xem chi tiết
                </Link>
              </div>
            </div>
            // </Link>
          ))}
        </div>
      </div>
    );
  }
  
  export default ProductList;