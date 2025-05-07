// File: frontend/src/pages/admin/AdminPostListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrashAlt, FaSearch, FaSpinner, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminPostListPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsPerPage = 10;

    const fetchPostsAdmin = useCallback(async (page = 1, search = '') => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        try {
            // API này cần trả về cả bài nháp cho admin
            let apiUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/post?page=${page}&per_page=${postsPerPage}&admin_view=true`;
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
                setPosts(data.data.data);
                setTotalPages(data.data.pagination?.total_pages || 1);
                setCurrentPage(data.data.pagination?.current_page || 1);
            } else {
                throw new Error(data.message || 'Không thể tải danh sách bài viết.');
            }
        } catch (err) {
            console.error("Error fetching admin posts:", err);
            setError(err.message);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPostsAdmin(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchPostsAdmin]);

    const handleDeletePost = async (postId, postTitle) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${postTitle}" (ID: ${postId}) không?`)) return;
        const token = localStorage.getItem('authToken');
        try {
            // API DELETE /api/post/{id} cần được tạo ở backend
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/post/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || `Lỗi xóa bài viết.`);
            }
            alert('Xóa bài viết thành công!');
            fetchPostsAdmin(currentPage, searchTerm);
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        }
    };


    const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
    // const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) { setCurrentPage(newPage); } };
    const renderPagination = () => { /* ... (Tương tự AdminProductListPage) ... */ };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'published': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Đã đăng</span>;
            case 'draft': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Nháp</span>;
            case 'archived': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Lưu trữ</span>;
            default: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-600">{status}</span>;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">Quản lý Bài viết Blog</h2>
                <Link to="/admin/posts/add" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md inline-flex items-center transition-colors">
                    <FaPlus className="mr-2" /> Viết bài mới
                </Link>
            </div>
             {/* Thanh tìm kiếm */}
            <div className="mb-4">
                <div className="relative">
                    <input type="text" placeholder="Tìm bài viết (tiêu đề, slug)..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {loading && <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl text-blue-500" /></div>}
            {error && !loading && ( <div className="text-center py-10 bg-red-50 text-red-600 border border-red-300 rounded-lg"> <FaExclamationTriangle className="text-3xl mx-auto mb-2"/> <p className="font-semibold">Lỗi tải dữ liệu: {error}</p> </div> )}
            {!loading && !error && posts.length === 0 && ( <p className="text-center text-gray-500 py-10">Không tìm thấy bài viết nào.</p> )}

            {!loading && !error && posts.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tác giả</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.map((post) => (
                                <tr key={post.post_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{post.post_id}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-md truncate" title={post.title}>{post.title}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate" title={post.slug}>{post.slug}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{post.author?.username || 'N/A'}</td>
                                    <td className="px-4 py-3 text-center text-sm">{getStatusBadge(post.status)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-4 py-3 text-center text-sm font-medium space-x-2">
                                        <Link to={`/blog/${post.slug}`} target="_blank" className="text-blue-600 hover:text-blue-900" title="Xem bài viết (public)"> <FaEye /> </Link>
                                        <Link to={`/admin/posts/edit/${post.post_id}`} className="text-indigo-600 hover:text-indigo-900" title="Sửa bài viết"> <FaEdit /> </Link>
                                        <button onClick={() => handleDeletePost(post.post_id, post.title)} className="text-red-600 hover:text-red-900" title="Xóa bài viết"> <FaTrashAlt /> </button>
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

export default AdminPostListPage;
