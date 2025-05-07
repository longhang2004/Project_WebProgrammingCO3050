// File: frontend/src/pages/admin/AdminOrderListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaFilter, FaSearch, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { formatCurrencyVND } from '../../utils/currency'; // Giả sử bạn có hàm này

const AdminOrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ordersPerPage = 10;

    const fetchOrdersAdmin = useCallback(async (page = 1, search = '') => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        try {
            let apiUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/order?page=${page}&per_page=${ordersPerPage}&admin_view=true`;
            if (search) {
                apiUrl += `&search=${encodeURIComponent(search)}`; // Backend cần hỗ trợ search
            }

            const response = await fetch(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success && data.data?.data) {
                setOrders(data.data.data);
                setTotalPages(data.data.pagination?.total_pages || 1);
                setCurrentPage(data.data.pagination?.current_page || 1);
            } else {
                throw new Error(data.message || 'Không thể tải danh sách đơn hàng.');
            }
        } catch (err) {
            console.error("Error fetching admin orders:", err);
            setError(err.message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrdersAdmin(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchOrdersAdmin]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500 text-yellow-800';
            case 'processing': return 'bg-blue-500 text-blue-800';
            case 'shipped': return 'bg-indigo-500 text-indigo-800';
            case 'delivered': return 'bg-green-500 text-green-800';
            case 'cancelled': return 'bg-red-500 text-red-800';
            case 'returned': return 'bg-gray-500 text-gray-800';
            default: return 'bg-gray-300 text-gray-700';
        }
    };
     const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-600';
            case 'completed': return 'text-green-600';
            case 'failed': return 'text-red-600';
            case 'refunded': return 'text-gray-600';
            default: return 'text-gray-500';
        }
    };


    const renderPagination = () => {
        if (totalPages <= 1) return null;
        // (Giữ nguyên logic renderPagination từ AdminProductListPage)
        const pageNumbers = [];
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
                    <li><button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">Đầu</button></li>
                    <li><button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">Trước</button></li>
                    {startPage > 1 && <li><span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">...</span></li>}
                    {pageNumbers.map(number => (<li key={number}><button onClick={() => handlePageChange(number)} className={`px-3 py-2 leading-tight border border-gray-300 ${number === currentPage ? 'text-blue-600 bg-blue-50 z-10' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'}`}>{number}</button></li>))}
                    {endPage < totalPages && <li><span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">...</span></li>}
                    <li><button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">Sau</button></li>
                    <li><button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50">Cuối</button></li>
                </ul>
            </nav>
        );
    };


    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quản lý Đơn hàng</h2>
            {/* Thanh tìm kiếm và lọc */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Tìm đơn hàng (Mã ĐH, Tên KH, Email)..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {/* <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg inline-flex items-center">
                    <FaFilter className="mr-2" /> Lọc Trạng Thái
                </button> */}
            </div>

            {loading && (
                <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl text-blue-500" /></div>
            )}
            {error && !loading && (
                <div className="text-center py-10 bg-red-50 text-red-600 border border-red-300 rounded-lg">
                    <FaExclamationTriangle className="text-3xl mx-auto mb-2"/>
                    <p className="font-semibold">Lỗi tải dữ liệu: {error}</p>
                </div>
            )}
            {!loading && !error && orders.length === 0 && (
                <p className="text-center text-gray-500 py-10">Không tìm thấy đơn hàng nào.</p>
            )}

            {!loading && !error && orders.length > 0 && (
                 <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã ĐH</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái ĐH</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái TT</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.order_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">#{order.order_id}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.username || 'N/A'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(order.order_date).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right font-semibold">{formatCurrencyVND(order.total_price)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                        <span className={`font-medium text-xs ${getPaymentStatusColor(order.payment_status)}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                        <Link to={`/admin/orders/${order.order_id}`} className="text-indigo-600 hover:text-indigo-900" title="Xem chi tiết">
                                            <FaEye />
                                        </Link>
                                        {/* Thêm nút sửa trạng thái nếu cần */}
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

export default AdminOrderListPage;
