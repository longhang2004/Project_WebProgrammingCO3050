// File: frontend/src/pages/public/BlogList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa'; // Icons
import { motion } from 'framer-motion';

function BlogList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsPerPage = 6; // Số bài viết mỗi trang

    useEffect(() => {
        const fetchAllPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/post?page=${currentPage}&per_page=${postsPerPage}`);
                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData?.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success && data.data?.data) {
                    setPosts(data.data.data);
                    setTotalPages(data.data.pagination?.total_pages || 1);
                } else {
                    throw new Error(data.message || 'Không thể tải danh sách bài viết.');
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                setError(error.message);
                setPosts([]); // Đặt lại posts về rỗng khi có lỗi
            } finally {
                setLoading(false);
            }
        };
        fetchAllPosts();
    }, [currentPage]); // Fetch lại khi trang thay đổi

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return (
            <nav className="mt-12 flex justify-center">
                <ul className="inline-flex -space-x-px">
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`py-2 px-3 ml-0 leading-tight rounded-l-lg 
                                        ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        >
                            Trước
                        </button>
                    </li>
                    {pageNumbers.map(number => (
                        <li key={number}>
                            <button
                                onClick={() => handlePageChange(number)}
                                className={`py-2 px-3 leading-tight 
                                            ${number === currentPage ? 'bg-blue-600 text-white z-10' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`py-2 px-3 leading-tight rounded-r-lg 
                                        ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        >
                            Sau
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4 md:px-8 lg:px-[100px]">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
                    Tin Tức Công Nghệ & Bài Viết
                </h1>

                {loading && (
                    <div className="flex justify-center items-center h-64 text-gray-500">
                        <FaSpinner className="animate-spin text-4xl" />
                    </div>
                )}
                {error && !loading && (
                     <div className="flex flex-col items-center justify-center h-64 text-red-500 bg-red-900/20 p-6 rounded border border-red-700">
                         <FaExclamationTriangle className="text-4xl mb-3"/>
                         <p className="text-xl font-semibold">Lỗi tải bài viết</p>
                         <p className="text-red-400">{error}</p>
                     </div>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {posts.map(post => (
                            <motion.div
                                key={post.post_id}
                                className="group bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex flex-col"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Link to={`/blog/${post.slug}`} className="block">
                                    <img
                                        src={post.featured_image_url || 'https://placehold.co/600x400/1a202c/4a5568?text=Blog+Image'}
                                        alt={post.title}
                                        className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity duration-300"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/1a202c/4a5568?text=Image+Error'; }}
                                    />
                                </Link>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h2 className="text-xl font-semibold text-blue-400 mb-2 line-clamp-2">
                                        <Link to={`/blog/${post.slug}`} className="hover:underline">
                                            {post.title}
                                        </Link>
                                    </h2>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Bởi {post.author?.username || 'Admin'} vào {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                                        {post.excerpt || 'Nhấn để đọc thêm...'}
                                    </p>
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="mt-auto self-start text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
                                    >
                                        Đọc thêm &rarr;
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && !error && posts.length === 0 && (
                    <p className="text-center text-gray-500 py-10 text-lg">Không có bài viết nào để hiển thị.</p>
                )}

                {renderPagination()}
            </div>
        </div>
    );
}

export default BlogList;
