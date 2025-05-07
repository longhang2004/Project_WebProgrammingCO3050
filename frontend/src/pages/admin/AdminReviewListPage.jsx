// File: frontend/src/pages/admin/AdminReviewListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaSearch, FaSpinner, FaExclamationTriangle, FaStar, FaRegStar } from 'react-icons/fa';

const AdminReviewListPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const reviewsPerPage = 10;

    const fetchReviewsAdmin = useCallback(async (page = 1, search = '') => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        try {
            let apiUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/review?page=${page}&per_page=${reviewsPerPage}&admin_view=true`;
            if (search) {
                apiUrl += `&search=${encodeURIComponent(search)}`;
            }
            const response = await fetch(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
                throw new Error(errData.message);
            }
            const data = await response.json();
            if (data.success && data.data?.data) {
                setReviews(data.data.data);
                setTotalPages(data.data.pagination?.total_pages || 1);
                setCurrentPage(data.data.pagination?.current_page || 1);
            } else {
                throw new Error(data.message || 'Không thể tải danh sách đánh giá.');
            }
        } catch (err) {
            console.error("Error fetching admin reviews:", err);
            setError(err.message);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviewsAdmin(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchReviewsAdmin]);

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa đánh giá ID: ${reviewId} không?`)) return;
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/review/${reviewId}?admin_delete=true`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || `Lỗi xóa đánh giá.`);
            }
            alert('Xóa đánh giá thành công!');
            fetchReviewsAdmin(currentPage, searchTerm); // Tải lại danh sách
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
            console.error("Error deleting review:", err);
        }
    };

    const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
    const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) { setCurrentPage(newPage); } };

    // *** FIX: Provide a more complete (but still basic) pagination renderer ***
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pageNumbers = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) { // Show more pages at the beginning if current page is near start
            endPage = Math.min(totalPages, 5);
        }
        if (currentPage > totalPages - 3) { // Show more pages at the end if current page is near end
            startPage = Math.max(1, totalPages - 4);
        }

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

    const renderStars = (rating) => {
        const numRating = Number(rating) || 0;
        const fullStars = Math.floor(numRating);
        const emptyStars = 5 - fullStars;
        return (
            <div className="flex text-yellow-400">
                {[...Array(fullStars)].map((_, i) => <FaStar key={`fs-${i}`} />)}
                {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`es-${i}`} />)}
            </div>
        );
    };


    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quản lý Đánh giá Sản phẩm</h2>
            {/* Thanh tìm kiếm */}
            <div className="mb-4">
                <div className="relative">
                    <input type="text" placeholder="Tìm đánh giá (nội dung, tên SP, user)..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {loading && <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl text-blue-500" /></div>}
            {error && !loading && ( <div className="text-center py-10 bg-red-50 text-red-600 border border-red-300 rounded-lg"> <FaExclamationTriangle className="text-3xl mx-auto mb-2"/> <p className="font-semibold">Lỗi tải dữ liệu: {error}</p> </div> )}
            {!loading && !error && reviews.length === 0 && ( <p className="text-center text-gray-500 py-10">Không tìm thấy đánh giá nào.</p> )}

            {!loading && !error && reviews.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rating</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nội dung</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reviews.map((review) => (
                                <tr key={review.review_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{review.review_id}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-xs truncate" title={review.product_name}>
                                        {/* Giả sử review object có product_id và product_name */}
                                        <Link to={`/product/${review.product_id}`} target="_blank" className="hover:text-blue-600">{review.product_name || `Sản phẩm ID: ${review.product_id}`}</Link>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{review.user?.username || `User ID: ${review.user_id}`}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 flex justify-center">{renderStars(review.rating)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 max-w-md truncate" title={review.review_text}>{review.review_text}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-4 py-3 text-center text-sm font-medium">
                                        <button onClick={() => handleDeleteReview(review.review_id)} className="text-red-600 hover:text-red-900" title="Xóa đánh giá"> <FaTrashAlt /> </button>
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

export default AdminReviewListPage;
