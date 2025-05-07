// File: frontend/src/pages/admin/AdminProductListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrashAlt, FaSpinner, FaSearch, FaFilter, FaExclamationTriangle } from 'react-icons/fa';
import { formatCurrencyVND } from '../../utils/currency'; // Import hàm định dạng tiền tệ

const AdminProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 10; // Số sản phẩm mỗi trang

    const fetchProductsAdmin = useCallback(async (page = 1, search = '') => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        try {
            // API này cần được bảo vệ và có thể trả về nhiều thông tin hơn cho admin
            // Thêm search term vào query nếu có
            let apiUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/product?page=${page}&per_page=${productsPerPage}&admin_view=true`;
            if (search) {
                apiUrl += `&search=${encodeURIComponent(search)}`;
            }

            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success && data.data?.data) {
                setProducts(data.data.data);
                setTotalPages(data.data.pagination?.total_pages || 1);
                setCurrentPage(data.data.pagination?.current_page || 1);
            } else {
                throw new Error(data.message || 'Không thể tải danh sách sản phẩm.');
            }
        } catch (err) {
            console.error("Error fetching admin products:", err);
            setError(err.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []); // Không có dependencies vì nó sẽ được gọi với tham số

    useEffect(() => {
        fetchProductsAdmin(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchProductsAdmin]);

    const handleDeleteProduct = async (productId, productName) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" (ID: ${productId}) không?`)) {
            return;
        }
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || `Lỗi xóa sản phẩm: ${response.status}`);
            }
            alert('Xóa sản phẩm thành công!');
            // Tải lại danh sách sản phẩm
            fetchProductsAdmin(currentPage, searchTerm);
        } catch (err) {
            console.error("Error deleting product:", err);
            alert(`Lỗi khi xóa sản phẩm: ${err.message}`);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pageNumbers = [];
        // Logic hiển thị một khoảng trang nhất định nếu có nhiều trang
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);
        if (currentPage <=3) endPage = Math.min(totalPages, 5);
        if (currentPage > totalPages - 3) startPage = Math.max(1, totalPages - 4);


        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <nav className="mt-6 flex justify-center">
                <ul className="inline-flex items-center -space-x-px">
                    <li>
                        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">Đầu</button>
                    </li>
                    <li>
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">Trước</button>
                    </li>
                    {startPage > 1 && <li><span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">...</span></li>}
                    {pageNumbers.map(number => (
                        <li key={number}>
                            <button onClick={() => handlePageChange(number)} className={`px-3 py-2 leading-tight border border-gray-300 ${number === currentPage ? 'text-blue-600 bg-blue-50 z-10' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'}`}>{number}</button>
                        </li>
                    ))}
                    {endPage < totalPages && <li><span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">...</span></li>}
                    <li>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">Sau</button>
                    </li>
                    <li>
                        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">Cuối</button>
                    </li>
                </ul>
            </nav>
        );
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">Quản lý Sản phẩm</h2>
                <Link
                    to="/admin/products/add"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md inline-flex items-center transition-colors"
                >
                    <FaPlus className="mr-2" /> Thêm Sản phẩm
                </Link>
            </div>

            {/* Thanh tìm kiếm và lọc */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm (tên, ID)..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {/* <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg inline-flex items-center">
                    <FaFilter className="mr-2" /> Lọc
                </button> */}
            </div>


            {loading && (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-4xl text-blue-500" />
                </div>
            )}
            {error && !loading && (
                <div className="text-center py-10 bg-red-50 text-red-600 border border-red-300 rounded-lg">
                    <FaExclamationTriangle className="text-3xl mx-auto mb-2"/>
                    <p className="font-semibold">Lỗi tải dữ liệu: {error}</p>
                </div>
            )}
            {!loading && !error && products.length === 0 && (
                <p className="text-center text-gray-500 py-10">Không tìm thấy sản phẩm nào.</p>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Sản phẩm</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.product_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.product_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={product.imageurl || 'https://placehold.co/40x40/e2e8f0/a0aec0?text=N/A'} alt={product.name} className="w-10 h-10 object-contain rounded" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate" title={product.name}>
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrencyVND(product.price)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Link to={`/admin/products/edit/${product.product_id}`} className="text-indigo-600 hover:text-indigo-900" title="Sửa">
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteProduct(product.product_id, product.name)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Xóa"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {renderPagination()}
        </div>
    );
};

export default AdminProductListPage;

