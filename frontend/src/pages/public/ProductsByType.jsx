import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Header'; // Giả sử bạn đã có component Navbar
import Footer from '../../components/Header'; // Giả sử bạn đã có component Footer
import ProductList from '../../components/ProductList';

function ProductByType() {
  const { type } = useParams();
  const [products, setProducts] = useState(Array(20).fill({
    name: "Sản phẩm",
    price: "1.000.000đ",
    image: "product.jpg",
  }));
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

//   useEffect(() => {
//     fetch(`/api/products/${type}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setProducts(data);
//         setLoading(false);
//       })
//       .catch((err) => console.error(err));
//   }, [type]);

  if (loading) return <p>Đang tải...</p>;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-[100px] my-8 flex-1">
        {/* Nút lọc và sắp xếp */}
        <div className="flex justify-between mb-4">
          <div>
            <label className="mr-2">Lọc theo: </label>
            <select className="p-2 border rounded">
              <option>Giá</option>
              <option>Đánh giá</option>
            </select>
          </div>
          <div>
            <label className="mr-2">Sắp xếp theo: </label>
            <select className="p-2 border rounded">
              <option>Giá tăng dần</option>
              <option>Giá giảm dần</option>
              <option>Tên A-Z</option>
            </select>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <ProductList productsList={currentProducts} />

        {/* Phân trang */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductByType;