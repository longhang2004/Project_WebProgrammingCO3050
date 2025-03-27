import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Header'; // Giả sử bạn đã có component Navbar
import Footer from '../../components/Header'; // Giả sử bạn đã có component Footer
import ProductList from '../../components/ProductList';
import Select from '../../components/Select';

function ProductByType() {
  const { type } = useParams();
  const [products, setProducts] = useState(Array(20).fill({
    name: "Vivo X200 Pro",
    price: "1.000.000đ",
    image: "https://cdn.mobilecity.vn/mobilecity-vn/images/2024/10/w300/vivo-x200-pro-xanh-duong.jpg.webp",
  }));
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  useEffect(() => {
    // fetch(`/api/products/${type}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setProducts(data);
    //     setLoading(false);
    //   })
    //   .catch((err) => console.error(err));
    setLoading(false);
  }, [type]);

  if (loading) return <p>Đang tải...</p>;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="md:px-[100px] my-8 flex-1">
        {/* Nút lọc và sắp xếp */}
          <div className="flex justify-between mb-4">
            <div>
              <label className="mr-2">Lọc theo: </label>
              <select className={`
                    inline-block rounded-md border-gray-300 shadow-sm 
                    focus:border-indigo-500 focus:ring-indigo-500
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                `}>
                <option>Giá</option>
                <option>Đánh giá</option>
              </select>
            </div>
            <div>
              <label className="mr-2">Sắp xếp theo: </label>
              <select className={`
                    inline-block rounded-md border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                `}>
                <option>Giá tăng dần</option>
                <option>Giá giảm dần</option>
                <option>Tên A-Z</option>
              </select>
            </div>
            {/* <div>
              <Select
                id="filter"
                name="filter"
                label="Lọc theo:"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                options={[
            { value: 'price', label: 'Giá' },
            { value: 'rating', label: 'Đánh giá' }
                ]}
                placeholder="Chọn tiêu chí lọc"
              />
            </div>
            <div>
              <Select
                id="sort"
                name="sort"
                label="Sắp xếp theo:"
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
                options={[
            { value: 'price-asc', label: 'Giá tăng dần' },
            { value: 'price-desc', label: 'Giá giảm dần' },
            { value: 'name-asc', label: 'Tên A-Z' }
                ]}
                placeholder="Chọn cách sắp xếp"
              />
            </div> */}
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