// File: frontend/src/pages/public/BlogDetail.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Thêm useCallback
import { useParams, Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { useAuth } from '../../context/AuthContext'; // Để kiểm tra đăng nhập và lấy thông tin user
import { FaSpinner, FaExclamationTriangle, FaUserCircle, FaCalendarAlt, FaCommentDots, FaPaperPlane } from 'react-icons/fa';

// Component hiển thị một bình luận
const CommentItem = ({ comment }) => {
    if (!comment) return null;
    const userName = comment.user?.username || 'Người dùng ẩn danh';
    const userAvatar = comment.user?.imageurl || '/avt.png'; // Ảnh mặc định
    const commentDate = comment.created_at ? new Date(comment.created_at).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'N/A';

    return (
        <div className="flex items-start space-x-3 py-4 border-b border-gray-700 last:border-b-0">
            <img
                src={userAvatar}
                alt={userName}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-1"
                onError={(e) => { e.target.onerror = null; e.target.src = '/avt.png'; }}
            />
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-blue-400">{userName}</span>
                    <span className="text-xs text-gray-500">{commentDate}</span>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">{comment.content}</p>
                 {/* Thêm nút trả lời/sửa/xóa nếu cần */}
            </div>
        </div>
    );
};


function BlogDetail() {
    const { slug } = useParams();
    const { userInfo, logout } = useAuth(); // Lấy userInfo để biết ai đang bình luận
    const navigate = useNavigate(); // Để chuyển hướng nếu token hết hạn
    const [post, setPost] = useState(null);
    const [loadingPost, setLoadingPost] = useState(true);
    const [errorPost, setErrorPost] = useState(null);

    // State cho bình luận
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [errorComments, setErrorComments] = useState(null);
    const [commentPage, setCommentPage] = useState(1); // Cho phân trang bình luận (nếu có)
    const [totalCommentPages, setTotalCommentPages] = useState(1);
    const [newComment, setNewComment] = useState(''); // Nội dung bình luận mới
    const [submittingComment, setSubmittingComment] = useState(false);
    const [submitCommentError, setSubmitCommentError] = useState('');

    // Fetch chi tiết bài viết
    const fetchPostDetails = useCallback(async () => {
        setLoadingPost(true);
        setErrorPost(null);
        try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/post/${slug}`);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                if (response.status === 404) throw new Error(errData?.message || 'Không tìm thấy bài viết.');
                throw new Error(errData?.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success && data.data) {
                setPost(data.data);
            } else {
                throw new Error(data.message || 'Không thể tải chi tiết bài viết.');
            }
        } catch (error) {
            console.error("Error fetching post details:", error);
            setErrorPost(error.message);
        } finally {
            setLoadingPost(false);
        }
    }, [slug]);

    // Fetch bình luận cho bài viết
    const fetchComments = useCallback(async (postId, page = 1) => {
        if (!postId) return; // Không fetch nếu chưa có post ID
        setLoadingComments(true);
        setErrorComments(null);
        try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/comment?post_id=${postId}&page=${page}&per_page=10`); // Lấy 10 comment/trang
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success && data.data?.data) {
                // Nếu là trang 1 thì thay thế, nếu trang sau thì nối vào (chưa làm logic load more)
                setComments(data.data.data);
                setTotalCommentPages(data.data.pagination?.total_pages || 1);
            } else {
                // Có thể API trả về success=true nhưng không có comment nào
                if (data.success) {
                    setComments([]);
                    setTotalCommentPages(1);
                } else {
                    throw new Error(data.message || 'Không thể tải danh sách bình luận.');
                }
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            setErrorComments(error.message);
        } finally {
            setLoadingComments(false);
        }
    }, []); // Không phụ thuộc vào commentPage trực tiếp ở đây


    // Fetch dữ liệu ban đầu
    useEffect(() => {
        if (slug) {
            fetchPostDetails();
        } else {
            setErrorPost("Không có slug bài viết để tải.");
            setLoadingPost(false);
        }
    }, [slug, fetchPostDetails]);

    // Fetch bình luận sau khi đã có post_id
    useEffect(() => {
        if (post?.post_id) {
            fetchComments(post.post_id, commentPage);
        }
    }, [post?.post_id, commentPage, fetchComments]); // Fetch lại khi post_id hoặc trang thay đổi


    // Xử lý gửi bình luận mới
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            setSubmitCommentError("Vui lòng nhập nội dung bình luận.");
            return;
        }
        if (!post?.post_id) {
             setSubmitCommentError("Lỗi: Không xác định được bài viết để bình luận.");
             return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            setSubmitCommentError("Vui lòng đăng nhập để bình luận.");
            // Có thể thêm navigate('/login') ở đây
            return;
        }

        setSubmittingComment(true);
        setSubmitCommentError('');

        const commentData = {
            post_id: post.post_id,
            content: newComment,
        };
        const requestHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/comment`, {
                method: 'POST',
                headers: requestHeaders,
                body: JSON.stringify(commentData)
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                if (response.status === 401) {
                    setSubmitCommentError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    logout();
                    navigate('/login');
                    return;
                }
                throw new Error(result.message || `Lỗi gửi bình luận: ${response.status}`);
            }

            // Thêm bình luận mới vào đầu danh sách để cập nhật UI ngay lập tức
            const addedComment = result.comment || {
                 ...commentData,
                 comment_id: result.comment_id || Date.now(),
                 created_at: new Date().toISOString(),
                 user: userInfo ? { username: userInfo.username, imageurl: userInfo.imageurl || '/avt.png' } : { username: 'Bạn', imageurl: '/avt.png' }
            };
            setComments(prevComments => [addedComment, ...prevComments]);
            setNewComment(''); // Xóa nội dung form

        } catch (error) {
            console.error("Error submitting comment:", error);
            setSubmitCommentError(error.message || "Đã có lỗi xảy ra khi gửi bình luận.");
        } finally {
            setSubmittingComment(false);
        }
    };


    // --- Render Loading/Error States ---
    if (loadingPost) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
                <span className="ml-3 text-xl">Đang tải bài viết...</span>
            </div>
        );
    }

    if (errorPost) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6">
                <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Lỗi Tải Bài Viết</h2>
                <p className="text-red-400 mb-6">{errorPost}</p>
                <Link to="/blog" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors">
                    Quay lại danh sách Blog
                </Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
                <p className="text-xl">Không tìm thấy bài viết.</p>
            </div>
        );
    }

    // --- Render Post Details and Comments ---
    const authorName = post.author?.username || 'Admin';
    const authorAvatar = post.author?.imageurl || '/avt.png';
    const postDate = new Date(post.created_at).toLocaleDateString('vi-VN', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4 md:px-8 lg:max-w-4xl">
                {/* Breadcrumbs */}
                <nav className="text-sm mb-6 text-gray-400">
                    <Link to="/" className="hover:text-blue-300">Trang chủ</Link>
                    <span className="mx-2">&gt;</span>
                    <Link to="/blog" className="hover:text-blue-300">Blog</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-gray-500 truncate w-64 inline-block">{post.title}</span>
                </nav>

                <article className="bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-12">
                    {post.featured_image_url && (
                        <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-64 md:h-96 object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    )}
                    <div className="p-6 md:p-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-4 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center text-gray-500 text-sm mb-6">
                            <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full mr-2 object-cover"/>
                            <span>Bởi <strong className="text-gray-400">{authorName}</strong></span>
                            <span className="mx-2">|</span>
                            <FaCalendarAlt className="mr-1.5" />
                            <span>{postDate}</span>
                        </div>
                        <div
                            className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </article>

                {/* --- Phần Bình luận --- */}
                <section className="bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
                    <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3 flex items-center">
                        <FaCommentDots className="mr-3 text-blue-400"/> Bình luận ({comments.length})
                    </h2>

                    {/* Form thêm bình luận */}
                    {userInfo ? ( // Chỉ hiển thị form nếu đã đăng nhập
                        <form onSubmit={handleCommentSubmit} className="mb-8">
                            <div className="flex items-start space-x-3">
                                <img
                                    src={userInfo.imageurl || '/avt.png'}
                                    alt={userInfo.username}
                                    className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-1"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/avt.png'; }}
                                />
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        rows="3"
                                        required
                                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm placeholder-gray-500"
                                        placeholder={`Viết bình luận với tư cách ${userInfo.username}...`}
                                    ></textarea>
                                     {submitCommentError && <p className="mt-1 text-xs text-red-400">{submitCommentError}</p>}
                                </div>
                            </div>
                             <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={submittingComment}
                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 ${submittingComment ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {submittingComment ? <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" /> : <FaPaperPlane className="-ml-1 mr-2 h-4 w-4" />}
                                    Gửi bình luận
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-gray-400 mb-8 text-center">
                            Vui lòng <Link to="/login" state={{ from: location.pathname }} className="text-blue-400 hover:underline">đăng nhập</Link> để bình luận.
                        </p>
                        // state={{ from: location.pathname }} giúp chuyển hướng lại sau khi đăng nhập
                    )}

                    {/* Danh sách bình luận */}
                    {loadingComments ? (
                        <div className="text-center text-gray-500 py-4">Đang tải bình luận...</div>
                    ) : errorComments ? (
                        <div className="text-center text-red-400 py-4">Lỗi tải bình luận: {errorComments}</div>
                    ) : comments.length > 0 ? (
                        <div className="space-y-0"> {/* Bỏ space-y để border hoạt động */}
                            {comments.map(comment => (
                                <CommentItem key={comment.comment_id} comment={comment} />
                            ))}
                            {/* Thêm nút Load More nếu có phân trang */}
                            {/* {commentPage < totalCommentPages && ( ... ) } */}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">Chưa có bình luận nào.</p>
                    )}
                </section>
                 {/* --- Kết thúc Phần Bình luận --- */}


                 <div className="mt-10 text-center">
                    <Link to="/blog" className="text-blue-400 hover:underline">
                        &larr; Quay lại danh sách Blog
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BlogDetail;
