import { useParams, Link } from 'react-router-dom'; // Thêm Link nếu chưa có
import { useEffect, useState } from 'react';
// import Header from '../../components/Header'; // Không cần import layout ở đây
// import Navbar from '../../components/Navbar'; // Không cần import layout ở đây
// import Footer from '../../components/Footer'; // Không cần import layout ở đây
import ProductList from '../../components/ProductList';
import Select from '../../components/Select'; // Component Select đã có

function ProductByType() {
  const { type } = useParams(); // Lấy type từ URL ('phone' hoặc 'laptop')
  const [products, setProducts] = useState([]); // Khởi tạo mảng rỗng
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null); // Thêm state cho lỗi

  // State cho bộ lọc và sắp xếp (ví dụ)
  const [filterValue, setFilterValue] = useState('');
  const [sortValue, setSortValue] = useState('');

  // Xác định endpoint dựa trên type
  const endpoint = type === 'phone' ? 'smartphones' : (type === 'laptop' ? 'laptops' : '');

  useEffect(() => {
        // *** XÁC ĐỊNH LẠI TYPE & ENDPOINT Ở ĐÂY ***
    // Do route của bạn là /phone và /laptop (không có :type), chúng ta cần xác định type dựa trên pathname
    const currentPath = window.location.pathname; // Lấy đường dẫn hiện tại (ví dụ: /phone)
    const determinedType = currentPath.includes('/phone') ? 'phone' : (currentPath.includes('/laptop') ? 'laptop' : '');
    console.log(">>> Determined Type từ Pathname:", determinedType); // <--- THÊM DÒNG NÀY

    const endpoint = determinedType === 'phone' ? 'smartphones' : (determinedType === 'laptop' ? 'laptops' : '');
    console.log(">>> Endpoint được tính toán:", endpoint); // <--- THÊM DÒNG NÀY


    if (!endpoint) {
      setError('Loại sản phẩm không hợp lệ.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null); // Reset lỗi trước khi fetch

    // Xây dựng URL với tham số page (và per_page nếu muốn)
    // Thay đổi base URL nếu backend của bạn chạy ở địa chỉ khác
    const apiUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/product/${endpoint}?page=${currentPage}&per_page=12`;
 // Ví dụ: 12 sản phẩm/trang

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data) {
          // API trả về cấu trúc { success: true, data: { data: [], pagination: {...} } }
          setProducts(data.data.data);
          setTotalPages(data.data.pagination.total_pages);
          setCurrentPage(data.data.pagination.current_page); // Cập nhật lại trang hiện tại từ response
        } else {
          // Nếu API trả về success: false hoặc cấu trúc không đúng
          console.error("Lỗi khi lấy sản phẩm:", data.message || 'Dữ liệu không hợp lệ');
          setError(data.message || 'Không thể tải danh sách sản phẩm.');
          setProducts([]); // Đặt lại mảng rỗng
          setTotalPages(1);
        }
      })
      .catch((err) => {
        console.error('Lỗi fetch sản phẩm:', err);
        setError(`Không thể kết nối đến máy chủ hoặc có lỗi xảy ra: ${err.message}`);
        setProducts([]); // Đặt lại mảng rỗng
        setTotalPages(1);
      })
      .finally(() => {
        setLoading(false); // Luôn tắt loading dù thành công hay lỗi
      });

  }, [type, endpoint, currentPage]); // Thêm endpoint và currentPage vào dependency array

  // Hàm chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Xử lý khi đang tải hoặc có lỗi
  if (loading) return <div className="text-center text-white py-10">Đang tải sản phẩm...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Lỗi: {error}</div>;

  // --- Phần JSX ---
  return (
    <div className="min-h-screen flex flex-col">
      <div className="md:px-[100px] my-8 flex-1 px-[20px]">
        <h1 className="text-3xl font-bold text-white mb-6 text-center capitalize">
          {type === 'phone' ? 'Điện thoại' : 'Laptop'}
        </h1>

        {/* Nút lọc và sắp xếp - Sử dụng component Select hoặc select thường */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4 bg-gray-700 p-4 rounded-lg">
          {/* Ví dụ bộ lọc (chưa có logic xử lý) */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-white text-sm font-medium">Lọc theo:</label>
            <select
              id="filter"
              name="filter"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm text-black p-2 text-sm"
            >
              <option value="">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              {/* Thêm các option lọc khác */}
            </select>
          </div>
          {/* Ví dụ sắp xếp (chưa có logic xử lý) */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-white text-sm font-medium">Sắp xếp:</label>
            <select
              id="sort"
              name="sort"
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
              className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm text-black p-2 text-sm"
            >
              <option value="newest">Mới nhất</option>
              <option value="rating">Đánh giá</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
            </select>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        {products.length > 0 ? (
          <ProductList productsList={products} />
        ) : (
          <p className="text-center text-white">Không tìm thấy sản phẩm nào.</p>
        )}


        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {/* Nút về trang trước */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              &lt; Trước
            </button>

            {/* Hiển thị số trang */}
            <span className="text-white">
              Trang {currentPage} / {totalPages}
            </span>

            {/* Nút tới trang sau */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              Sau &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductByType;