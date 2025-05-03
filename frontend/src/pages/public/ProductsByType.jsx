import { Link, useLocation } from 'react-router-dom'; // Thêm useLocation
import { useEffect, useState, useMemo } from 'react'; // Thêm useMemo
import ProductList from '../../components/ProductList';
// import Select from '../../components/Select'; // Bỏ comment nếu bạn dùng component này

function ProductByType() {
    // const { type } = useParams(); // Vẫn giữ lại nếu bạn có kế hoạch dùng route param sau này

    const location = useLocation(); // Sử dụng useLocation để lấy pathname ổn định hơn
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);

    const [filterValue, setFilterValue] = useState('');
    const [sortValue, setSortValue] = useState('');

    // --- Log khi component bắt đầu render ---
    console.log("%c--- Component Render Start ---", "color: gray; font-style: italic;");
    console.log("Current Page State:", currentPage);


    // --- XÁC ĐỊNH TYPE & ENDPOINT BÊN NGOÀI USEEFFECT ---
    const determinedType = useMemo(() => {
        const currentPath = location.pathname;
        // console.log(">>> Determined Type Memo Input (Pathname):", currentPath); // Chi tiết hơn
        const typeResult = currentPath.includes('/phone') ? 'phone' : (currentPath.includes('/laptop') ? 'laptop' : '');
        console.log(">>> Determined Type Memo Output:", typeResult);
        return typeResult;
    }, [location.pathname]);

    const endpoint = useMemo(() => {
        // console.log(">>> Endpoint Memo Input (Type):", determinedType); // Chi tiết hơn
        const ep = determinedType === 'phone' ? 'smartphones' : (determinedType === 'laptop' ? 'laptops' : '');
        console.log(">>> Endpoint Memo Output:", ep);
        return ep;
    }, [determinedType]);
    // --- KẾT THÚC XÁC ĐỊNH TYPE & ENDPOINT ---

    useEffect(() => {
        // *** THÊM LOG KHI EFFECT CHẠY ***
        console.log(`%c--- useEffect RUNNING --- Endpoint: ${endpoint}, CurrentPage: ${currentPage}`, "color: blue; font-weight: bold;");

        if (!endpoint) {
            console.log("%c--- useEffect EXIT --- Invalid endpoint", "color: orange;");
            setError('Loại sản phẩm không hợp lệ.');
            setLoading(false);
            setProducts([]);
            setTotalPages(1);
            return;
        }

        console.log("%c--- useEffect --- Setting loading=true, error=null", "color: blue;");
        setLoading(true);
        setError(null);

        const apiUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/product/${endpoint}?page=${currentPage}&per_page=12`;
        console.log("%c--- useEffect --- Fetching URL:", "color: blue;", apiUrl);

        fetch(apiUrl)
            .then((res) => {
                console.log("%c--- Fetch THEN --- Response Status:", "color: green;", res.status);
                if (!res.ok) {
                    return res.json().then(errData => {
                        console.error("--- Fetch THEN --- Error Response JSON:", errData);
                        throw new Error(errData.message || `HTTP error! status: ${res.status}`);
                    }).catch((jsonError) => {
                        console.error("--- Fetch THEN --- Could not parse error JSON or other error:", jsonError);
                        throw new Error(`HTTP error! status: ${res.status}`);
                    });
                }
                const contentType = res.headers.get("content-type");
                console.log("%c--- Fetch THEN --- Response Content-Type:", "color: green;", contentType);
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return res.json();
                } else {
                    return res.text().then(text => {
                        console.error("%c--- Fetch THEN --- Response is not JSON:", "color: red;", text);
                        throw new Error('Phản hồi từ máy chủ không phải là JSON hợp lệ.');
                    });
                }
            })
            .then((data) => {
                console.log("%c--- Fetch THEN (Data) --- Received data:", "color: green;", data); // Log dữ liệu nhận được
                if (data && data.success && data.data && Array.isArray(data.data.data) && data.data.pagination) {
                    console.log("%c--- Fetch THEN (Data) --- Setting State: Products, TotalPages", "color: green;"); // Log trước khi set state
                    setProducts(data.data.data);
                    setTotalPages(data.data.pagination.total_pages || 1);
                } else {
                    console.error("%c--- Fetch THEN (Data) --- Invalid data structure or success:false:", "color: red;", data);
                    setError(data.message || 'Dữ liệu trả về không hợp lệ.');
                    setProducts([]);
                    setTotalPages(1);
                }
            })
            .catch((err) => {
                console.error("%c--- Fetch CATCH --- Error:", "color: red;", err); // Log lỗi fetch
                setError(`Lỗi: ${err.message || 'Không thể kết nối đến máy chủ.'}`);
                setProducts([]);
                setTotalPages(1);
            })
            .finally(() => {
                console.log("%c--- Fetch FINALLY --- Setting loading=false", "color: purple;"); // Log finally
                setLoading(false);
            });

    }, [endpoint, currentPage]); // Mảng phụ thuộc vẫn giữ nguyên

    // Hàm chuyển trang
    const handlePageChange = (newPage) => {
        console.log(`%c--- handlePageChange --- Called with newPage: ${newPage}`, "color: brown;");
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            console.log(`%c--- handlePageChange --- Setting currentPage to: ${newPage}`, "color: brown;");
            setCurrentPage(newPage);
        } else {
            console.log(`%c--- handlePageChange --- Page change ignored (out of bounds or same page)`, "color: brown;");
        }
    };

    // --- Log trước khi return JSX ---
    console.log("%c--- Component Render End --- Returning JSX", "color: gray; font-style: italic;");
    console.log("Current State before return: loading=", loading, "error=", error, "products.length=", products.length);


    // Xử lý khi đang tải hoặc có lỗi
    if (loading) return <div className="text-center text-gray-400 py-10">Đang tải sản phẩm...</div>;
    if (error && products.length === 0) return <div className="text-center text-red-500 py-10">{error}</div>;


    // --- Phần JSX ---
    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <div className="md:px-[100px] my-8 flex-1 px-[20px]">
                <h1 className="text-3xl font-bold text-white mb-6 text-center capitalize">
                    {determinedType === 'phone' ? 'Điện thoại' : (determinedType === 'laptop' ? 'Laptop' : 'Sản phẩm')}
                </h1>

                {error && !loading && <div className="text-center text-red-500 py-4 mb-4 border border-red-500 rounded bg-red-900 bg-opacity-30">{error}</div>}

                <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4 bg-gray-800 p-4 rounded-lg shadow-md">
                    <div className="flex items-center gap-2">
                        <label htmlFor="filter" className="text-gray-300 text-sm font-medium">Lọc theo:</label>
                        <select
                            id="filter"
                            name="filter"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="block w-full sm:w-auto rounded-md border-gray-600 bg-gray-700 text-white shadow-sm p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Mặc định</option>
                            <option value="price-asc">Giá tăng dần</option>
                            <option value="price-desc">Giá giảm dần</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort" className="text-gray-300 text-sm font-medium">Sắp xếp:</label>
                        <select
                            id="sort"
                            name="sort"
                            value={sortValue}
                            onChange={(e) => setSortValue(e.target.value)}
                            className="block w-full sm:w-auto rounded-md border-gray-600 bg-gray-700 text-white shadow-sm p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="rating">Đánh giá</option>
                            <option value="name-asc">Tên A-Z</option>
                            <option value="name-desc">Tên Z-A</option>
                        </select>
                    </div>
                </div>

                {!loading && !error && products.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">Không tìm thấy sản phẩm nào.</p>
                ) : (
                    products.length > 0 && <ProductList productsList={products} />
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors duration-150 ${currentPage === 1 || loading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'}`}
                        >
                            &lt; Trước
                        </button>

                        <span className="text-gray-300 text-sm">
                            Trang {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || loading}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors duration-150 ${currentPage === totalPages || loading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'}`}
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
