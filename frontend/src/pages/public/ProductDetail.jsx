// File: frontend/src/pages/public/ProductDetail.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FaShoppingCart, FaCheckCircle, FaStar, FaRegStar, FaSpinner, FaEdit, FaTrashAlt, FaTimes, FaSave } from 'react-icons/fa';

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
    const numericAmount = Number(amount);
    if (amount === null || amount === undefined || isNaN(numericAmount)) {
        return 'Liên hệ';
    }
    try {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericAmount);
    } catch (error) {
        console.error("Error formatting currency:", error, "Amount:", amount);
        return 'Lỗi giá';
    }
};

// Component hiển thị sao
const StarRating = ({ rating, size = 'text-lg', interactive = false, onRate = () => {}, hoverRating = 0, onHover = () => {} }) => {
    const numericRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
    const displayRating = hoverRating > 0 ? hoverRating : numericRating;

    return (
        <div
            className={`flex items-center ${size} ${interactive ? 'cursor-pointer' : ''}`}
            onMouseLeave={interactive ? () => onHover(0) : undefined}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    className={`focus:outline-none transition-colors duration-150 ${
                        displayRating >= star ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-500'
                    }`}
                    onClick={interactive ? () => onRate(star) : undefined}
                    onMouseEnter={interactive ? () => onHover(star) : undefined}
                    disabled={!interactive}
                    aria-label={`Đánh giá ${star} sao`}
                >
                    <FaStar />
                </button>
            ))}
        </div>
    );
};


// Component ReviewItem
const ReviewItem = ({ review, currentUserId, onEdit, onDelete, isEditing, editData, onEditChange, onUpdate, onCancelEdit, editingLoading, deleteLoading }) => {
    if (!review) return null;
    const userName = review.user?.username || 'Người dùng ẩn danh';
    const userAvatar = review.user?.imageurl || '/avt.png';
    const reviewDate = review.created_at ? new Date(review.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
    const isOwner = currentUserId !== null && currentUserId !== undefined &&
                    review.user_id !== undefined &&
                    Number(review.user_id) === Number(currentUserId);

    return (
        <div className="py-4 border-b border-gray-700 last:border-b-0">
            <div className="flex items-start mb-2">
                <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full mr-3 object-cover flex-shrink-0" onError={(e) => { e.target.onerror = null; e.target.src = '/avt.png'; }}/>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-blue-400">{userName}</p>
                        <span className="text-xs text-gray-500">
                             {reviewDate}
                        </span>
                    </div>
                    {isEditing ? (
                         <StarRating
                            rating={editData.rating}
                            size="text-sm"
                            interactive={true}
                            onRate={(newRating) => onEditChange({ ...editData, rating: newRating })}
                         />
                    ) : (
                        <StarRating rating={review.rating} size="text-sm" />
                    )}
                </div>
                {/* Nút Sửa/Xóa */}
                {isOwner && !isEditing && (
                    <div className="ml-auto flex space-x-2 text-gray-500">
                        <button onClick={() => onEdit(review)} className="hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed" title="Sửa đánh giá" disabled={deleteLoading}>
                            <FaEdit />
                        </button>
                        <button onClick={() => onDelete(review.review_id)} className="hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed" title="Xóa đánh giá" disabled={deleteLoading}>
                            {deleteLoading === review.review_id ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
                        </button>
                    </div>
                )}
            </div>
            {/* Form sửa hoặc text */}
            {isEditing ? (
                 <div className="ml-11 space-y-2">
                     <textarea
                         value={editData.review_text}
                         onChange={(e) => onEditChange({ ...editData, review_text: e.target.value })}
                         rows="3"
                         required
                         className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-gray-400"
                         placeholder="Nhập nội dung đánh giá đã chỉnh sửa..."
                     ></textarea>
                     <div className="flex justify-end gap-2">
                          <button type="button" onClick={onCancelEdit} disabled={editingLoading} className="px-3 py-1 rounded-md text-xs font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 focus:outline-none"> Hủy </button>
                          <button type="button" onClick={() => onUpdate(review.review_id)} disabled={editingLoading} className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ${editingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              {editingLoading ? <FaSpinner className="animate-spin mr-1 h-3 w-3" /> : <FaSave className="mr-1 h-3 w-3" />} Lưu
                          </button>
                     </div>
                 </div>
            ) : (
                <p className="text-sm text-gray-300 ml-11 whitespace-pre-wrap break-words">{review.review_text || ''}</p>
            )}
        </div>
    );
};


function ProductDetail() {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();

    // States...
    const [product, setProduct] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [productError, setProductError] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedMessage, setAddedMessage] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewPagination, setReviewPagination] = useState(null);
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [newReviewText, setNewReviewText] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [submitReviewError, setSubmitReviewError] = useState('');
    const [submitReviewSuccess, setSubmitReviewSuccess] = useState('');
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editFormData, setEditFormData] = useState({ rating: 0, review_text: '' });
    const [editingLoading, setEditingLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    // --- Tính toán lại điểm trung bình ---
    const recalculateAverageRating = useCallback((updatedReviews) => {
        if (!updatedReviews || updatedReviews.length === 0) {
            setAverageRating(0);
            return;
        }
        const totalRating = updatedReviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0);
        const newAvg = totalRating / updatedReviews.length;
        const roundedAvg = parseFloat(newAvg.toFixed(1));
        setAverageRating(roundedAvg);
        setReviewPagination(prev => prev ? {...prev, total_items: updatedReviews.length} : { total_items: updatedReviews.length });
    }, []); // Dependency rỗng


    // --- Kiểm tra user đã review chưa ---
    const userHasReviewed = useMemo(() => {
        if (!userInfo || !reviews || reviews.length === 0) return false;
        const userIdNum = Number(userInfo.user_id);
        return reviews.some(review => Number(review.user_id) === userIdNum);
    }, [userInfo, reviews]);

    // Fetch product details
    const fetchProductDetails = useCallback(async () => {
        console.log("Fetching product details...");
        setLoadingProduct(true);
        setProductError(null);
        setCurrentPrice(null);
        setProduct(null);
        setAverageRating(0);
        try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/product/${productId}`);
            console.log("Product API Response Status:", response.status);
            if (!response.ok) {
                 const errorText = await response.text();
                 console.error("Product API Error Response Text:", errorText);
                 let errMessage = `Lỗi tải sản phẩm: ${response.status}`;
                 try { const errData = JSON.parse(errorText); errMessage = errData?.message || errMessage; } catch (parseError) {}
                 throw new Error(errMessage);
            }
            const data = await response.json();
             console.log("Product API Response Data:", data);
            if (data.success && data.data) {
                console.log("Setting product state with:", data.data);
                setProduct(data.data);
                setCurrentPrice(data.data.price ?? null);
                const avgRating = parseFloat(data.data.rated_stars);
                setAverageRating(isNaN(avgRating) ? 0 : avgRating);
            } else {
                 console.error("API success=false or missing data:", data);
                throw new Error(data.message || 'API trả về success:false hoặc không có dữ liệu sản phẩm.');
            }
        } catch (err) {
            console.error("Lỗi fetch chi tiết sản phẩm:", err);
            setProductError(err.message);
            setProduct(null);
        } finally {
            setLoadingProduct(false);
        }
    }, [productId]);

    // Fetch reviews
    const fetchReviews = useCallback(async () => {
        console.log("Fetching reviews...");
        setLoadingReviews(true);
        setReviewsError(null);
        const fetchReviewsUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/product/${productId}/reviews?page=1&per_page=10`;
        try {
            const response = await fetch(fetchReviewsUrl);
             console.log("Reviews API Response Status:", response.status);
            if (!response.ok) {
                 const errorText = await response.text();
                 console.error("Reviews API Error Response Text:", errorText);
                 let errMessage = `Lỗi tải đánh giá: ${response.status}`;
                 try { const errData = JSON.parse(errorText); errMessage = errData?.message || errMessage; } catch(parseError) {}
                 throw new Error(errMessage);
            }
            const data = await response.json();
             console.log("Reviews API Response Data:", data);
            if (data.success && data.data?.data) {
                setReviews(data.data.data);
                setReviewPagination(data.data.pagination || { total_items: data.data.data.length });
            } else {
                setReviews([]);
                setReviewPagination(null);
            }
        } catch (err) {
            console.error("Lỗi fetch đánh giá:", err);
            setReviewsError(err.message);
            setReviews([]);
            setReviewPagination(null);
        } finally {
            setLoadingReviews(false);
        }
    }, [productId]);

    // Initial data fetching
    useEffect(() => {
        fetchProductDetails().then(() => {
             fetchReviews();
        });
    }, [fetchProductDetails, fetchReviews]);


    // *** ADD TO CART: Cập nhật hàm này ***
    const handleAddToCart = (event) => {
        console.log("handleAddToCart handler called");
        // event.stopPropagation(); // Thường không cần thiết trừ khi có vấn đề bubbling

        if (!product || currentPrice === null) {
            console.error("Add to cart failed: Product data or price not loaded yet.");
            setAddedMessage("Lỗi: Không thể thêm sản phẩm vào giỏ lúc này.");
             setTimeout(() => setAddedMessage(''), 3000);
            return;
        }
        if (quantity < 1) {
            console.error("Add to cart failed: Invalid quantity.");
            setAddedMessage("Lỗi: Số lượng không hợp lệ.");
             setTimeout(() => setAddedMessage(''), 3000);
            return;
        }

        const itemToAdd = {
            product_id: product.product_id,
            name: product.name,
            price: currentPrice,
            imageurl: product.imageurl,
        };

        try {
            console.log("Calling addToCart from context with:", itemToAdd, "quantity:", quantity);
            addToCart(itemToAdd, quantity);
            setAddedMessage(`${quantity} "${product.name}" đã được thêm vào giỏ!`);
            setTimeout(() => setAddedMessage(''), 3000);
        } catch (error) {
             console.error("Error adding item to cart:", error);
             setAddedMessage("Lỗi: Không thể thêm vào giỏ hàng.");
             setTimeout(() => setAddedMessage(''), 3000);
        }
    };


    // handleSubmitReview
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (userHasReviewed) { setSubmitReviewError("Bạn đã đánh giá sản phẩm này rồi."); return; }
        setSubmittingReview(true);
        setSubmitReviewError(''); setSubmitReviewSuccess('');
        const token = localStorage.getItem('authToken');
        if (!token) { setSubmitReviewError('Vui lòng đăng nhập.'); setSubmittingReview(false); return; }
        if (newRating === 0) { setSubmitReviewError('Vui lòng chọn sao.'); setSubmittingReview(false); return; }
        if (!newReviewText.trim()) { setSubmitReviewError('Vui lòng nhập nội dung.'); setSubmittingReview(false); return; }

        const reviewData = { product_id: parseInt(productId), rating: newRating, review_text: newReviewText };
        const requestHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

        try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/review`, { method: 'POST', headers: requestHeaders, body: JSON.stringify(reviewData) });
            const result = await response.json();
            if (!response.ok || !result.success) {
                if (response.status === 401) { setSubmitReviewError("Phiên hết hạn."); logout(); navigate('/login'); return; }
                if (response.status === 409) { setSubmitReviewError(result.message || "Bạn đã đánh giá sản phẩm này."); return; }
                throw new Error(result.message || `Lỗi: ${response.status}`);
            }
            setSubmitReviewSuccess('Gửi đánh giá thành công!');
            setNewRating(0); setNewReviewText('');

            const newlyAddedReview = {
                 review_id: result.review?.review_id || result.review_id || Date.now(),
                 user_id: userInfo.user_id,
                 product_id: parseInt(productId),
                 rating: Number(result.review?.rating || newRating),
                 review_text: result.review?.review_text || newReviewText,
                 created_at: result.review?.created_at || new Date().toISOString(),
                 user: result.review?.user || (userInfo ? { username: userInfo.username, imageurl: userInfo.imageurl || '/avt.png' } : { username: 'Bạn', imageurl: '/avt.png' })
             };

            const updatedReviews = [newlyAddedReview, ...reviews];
            setReviews(updatedReviews);
            recalculateAverageRating(updatedReviews);

        } catch (err) {
            if (!submitReviewError) setSubmitReviewError(err.message || 'Lỗi xảy ra.');
        } finally {
            setSubmittingReview(false);
        }
    };

    // handleEditReview
    const handleEditReview = (reviewToEdit) => {
        setEditingReviewId(reviewToEdit.review_id);
        setEditFormData({ rating: Number(reviewToEdit.rating), review_text: reviewToEdit.review_text });
        setEditError('');
    };

    // handleCancelEdit
    const handleCancelEdit = () => {
        setEditingReviewId(null);
        setEditFormData({ rating: 0, review_text: '' });
        setEditError('');
    };

    // handleEditFormChange
     const handleEditFormChange = (newData) => {
        setEditFormData(newData);
    };

    // handleUpdateReview
    const handleUpdateReview = async (reviewId) => {
        setEditingLoading(true); setEditError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setEditError('Vui lòng đăng nhập lại.'); setEditingLoading(false); return; }
        if (editFormData.rating === 0) { setEditError('Vui lòng chọn sao.'); setEditingLoading(false); return; }
        if (!editFormData.review_text.trim()) { setEditError('Vui lòng nhập nội dung.'); setEditingLoading(false); return; }

        const updateData = { rating: Number(editFormData.rating), review_text: editFormData.review_text };
        const requestHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

        try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/review/${reviewId}`, { method: 'PUT', headers: requestHeaders, body: JSON.stringify(updateData) });
            const result = await response.json();
            if (!response.ok || !result.success) {
                if (response.status === 401) { setEditError("Phiên hết hạn."); logout(); navigate('/login'); return; }
                if (response.status === 403 || response.status === 404) { setEditError(result.message || "Không thể sửa đánh giá này."); return; }
                throw new Error(result.message || `Lỗi: ${response.status}`);
            }

            const updatedReviewData = {
                 ...editFormData,
                 review_id: reviewId,
                 ...(result.review || {}),
                 rating: Number(result.review?.rating ?? editFormData.rating)
            };

            const updatedReviews = reviews.map(r =>
                r.review_id === reviewId ? { ...r, ...updatedReviewData, user: r.user } : r
            );
            setReviews(updatedReviews);
            recalculateAverageRating(updatedReviews);
            setEditingReviewId(null);

        } catch (err) {
             setEditError(err.message || 'Lỗi khi cập nhật.');
        } finally {
            setEditingLoading(false);
        }
    };

     // handleDeleteReview
     const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) return;
        setDeleteLoading(reviewId); setDeleteError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setDeleteError('Vui lòng đăng nhập lại.'); setDeleteLoading(null); return; }
        const requestHeaders = { 'Authorization': `Bearer ${token}` };

        try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/review/${reviewId}`, { method: 'DELETE', headers: requestHeaders });
            if (response.status === 200 || response.status === 204) {
                const updatedReviews = reviews.filter(r => r.review_id !== reviewId);
                setReviews(updatedReviews);
                recalculateAverageRating(updatedReviews);
                if (response.status === 200) {
                    const result = await response.json();
                    console.log("Delete success message:", result?.data?.message);
                }
            } else {
                const result = await response.json().catch(() => ({}));
                 if (response.status === 401) { setDeleteError("Phiên hết hạn."); logout(); navigate('/login'); return; }
                 if (response.status === 403 || response.status === 404) { setDeleteError(result.message || "Không thể xóa đánh giá này."); return; }
                 throw new Error(result.message || `Lỗi: ${response.status}`);
            }
        } catch (err) {
            setDeleteError(err.message || 'Lỗi khi xóa.');
        } finally {
            setDeleteLoading(null);
        }
    };


    // --- Loading/Error states ---
    if (loadingProduct) return <div className="text-center text-white py-10">Đang tải sản phẩm...</div>;
    if (productError) return <div className="text-center text-red-500 py-10">Lỗi tải sản phẩm: {productError}</div>;
    if (!product) {
        console.log("Product is null or undefined right before render.");
        return <div className="text-center text-white py-10">Không tìm thấy thông tin sản phẩm.</div>;
    }

    // --- JSX Render ---
    return (
        <div className="min-h-screen flex flex-col text-black bg-gray-900 text-white">
            <div className="md:px-[100px] my-8 flex-1 px-[20px]">
                 {/* Breadcrumbs, Tên SP, Đánh giá TB */}
                 <div className="text-gray-400 mb-4 text-sm">
                      <Link to="/" className="hover:text-blue-300">Trang chủ</Link> &gt;
                      {product.details?.type && (
                          <>
                              <Link to={`/${product.details.type}`} className="hover:text-blue-300 capitalize">
                                  {product.details.type === 'smartphone' ? 'Điện thoại' : 'Laptop'}
                              </Link> &gt;
                          </>
                      )}
                      <span className="text-white">{product.name || 'Sản phẩm không tên'}</span>
                  </div>
                 <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                     <h1 className="text-2xl lg:text-3xl font-bold text-white flex-1">{product.name || 'Sản phẩm không tên'}</h1>
                     <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 flex items-center flex-shrink-0">
                         <StarRating rating={averageRating} />
                         <span className="ml-2 text-sm text-gray-400">({averageRating > 0 ? averageRating.toFixed(1) : 'Chưa có'} / 5)</span>
                         <span className="mx-2 text-gray-600">|</span>
                         <span className="text-sm text-gray-400">{reviews.length} đánh giá</span>
                     </div>
                 </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8">
                     {/* Cột trái - Ảnh và Thông số */}
                     <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg shadow-md">
                          <div className="mb-4 sticky top-[80px]">
                              <img src={product.imageurl || '/placeholder-image.png'} alt={product.name || 'Hình ảnh sản phẩm'} className="w-full h-auto max-h-[400px] object-contain bg-white rounded" onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.png'; }} />
                          </div>
                          {product.details && (
                             <div className="mt-6 border-t border-gray-700 pt-4">
                                 <h2 className="text-lg font-semibold text-white mb-3">Thông số nổi bật</h2>
                                 <ul className="space-y-1 text-sm text-gray-300">
                                     {product.details.type === 'smartphone' && (
                                         <>
                                             <li><strong>Màn hình:</strong> {product.details.screen_description || 'N/A'}</li>
                                             <li><strong>Camera:</strong> {product.details.camera || 'N/A'}</li>
                                             <li><strong>Chip:</strong> {product.details.processor || 'N/A'}</li>
                                             <li><strong>RAM/ROM:</strong> {product.details.RAM_ROM || 'N/A'}</li>
                                             <li><strong>Pin:</strong> {product.details.battery || 'N/A'}</li>
                                         </>
                                     )}
                                     {product.details.type === 'laptop' && (
                                         <>
                                             <li><strong>CPU:</strong> {product.details.CPU || 'N/A'}</li>
                                             <li><strong>RAM:</strong> {product.details.RAM || 'N/A'}</li>
                                             <li><strong>Ổ cứng:</strong> {product.details.storage || 'N/A'}</li>
                                             <li><strong>GPU:</strong> {product.details.GPU || 'N/A'}</li>
                                             <li><strong>Màn hình:</strong> {product.details.screen_description || 'N/A'}</li>
                                         </>
                                     )}
                                 </ul>
                             </div>
                          )}
                      </div>

                     {/* Cột phải - Giá, tùy chọn, nút mua */}
                     <div className="md:col-span-3 bg-gray-800 p-6 rounded-lg shadow-md">
                         {currentPrice !== null ? ( <h2 className="text-3xl font-bold text-red-500 mb-3">{formatCurrency(currentPrice)}</h2> ) : ( <div className="h-[40px] mb-3 bg-gray-700 rounded animate-pulse"></div> )}
                         {/* Chọn số lượng */}
                         <div className="mb-5 flex items-center gap-3">
                             <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">Số lượng:</label>
                             <div className="flex items-center border border-gray-600 rounded">
                                 <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-l text-lg text-white" aria-label="Giảm số lượng">-</button>
                                 <input type="number" id="quantity" name="quantity" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" className="w-12 text-center bg-gray-700 border-l border-r border-gray-600 py-1 focus:outline-none text-white" />
                                 <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-r text-lg text-white" aria-label="Tăng số lượng">+</button>
                             </div>
                         </div>
                         {/* Thông báo thêm vào giỏ */}
                         {addedMessage && ( <div className="my-3 text-center text-green-400 bg-green-900/50 p-2 rounded text-sm flex items-center justify-center gap-2"> <FaCheckCircle /> {addedMessage} </div> )}
                         {/* Nút hành động */}
                         <div className="flex flex-col sm:flex-row gap-3 mt-6">
                             <button onClick={handleAddToCart} className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800">
                                 <FaShoppingCart /> Thêm vào giỏ hàng
                             </button>
                             <button className="flex-1 bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800"> Mua ngay </button>
                         </div>
                         {/* Thông tin BH */}
                         <div className="mt-6 text-xs text-gray-400 space-y-1 border-t border-gray-700 pt-4">
                              <p>✓ Bảo hành chính hãng {product.warranty_period || 12} tháng.</p>
                              <p>✓ Hỗ trợ đổi trả trong 7 ngày nếu có lỗi nhà sản xuất.</p>
                              <p>✓ Giao hàng nhanh toàn quốc.</p>
                          </div>
                     </div>
                </div>

                 {/* Mô tả chi tiết */}
                 <div className="mt-8 lg:mt-12 bg-gray-800 p-6 rounded-lg shadow-md">
                      <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Mô tả sản phẩm</h2>
                      <div className="prose prose-sm sm:prose-base prose-invert text-gray-300 max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '<p>Chưa có mô tả chi tiết.</p>' }}></div>
                  </div>


                 {/* Phần Đánh giá Sản phẩm */}
                 <div className="mt-8 lg:mt-12 bg-gray-800 p-6 rounded-lg shadow-md">
                     <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Đánh giá ({reviews.length})</h2>
                     {deleteError && <p className="mb-3 text-sm text-red-400">{deleteError}</p>}
                     {editError && editingReviewId && <p className="mb-3 text-sm text-red-400">{editError}</p>}

                     {/* Form viết đánh giá */}
                     {localStorage.getItem('authToken') && !userHasReviewed && !editingReviewId && (
                         <form onSubmit={handleSubmitReview} className="mb-6 p-4 border border-gray-700 rounded-md bg-gray-700/50">
                             <h3 className="text-lg font-medium text-white mb-3">Viết đánh giá của bạn</h3>
                             {submitReviewError && <p className="mb-3 text-sm text-red-400">{submitReviewError}</p>}
                             {submitReviewSuccess && <p className="mb-3 text-sm text-green-400">{submitReviewSuccess}</p>}
                              <div className="mb-3">
                                 <label className="block text-sm font-medium text-gray-300 mb-1">Chọn đánh giá:</label>
                                 <StarRating rating={newRating} size="text-2xl" interactive={true} onRate={setNewRating} hoverRating={hoverRating} onHover={setHoverRating} />
                             </div>
                             <div className="mb-3">
                                 <label htmlFor="reviewText" className="block text-sm font-medium text-gray-300 mb-1">Nội dung đánh giá:</label>
                                 <textarea id="reviewText" rows="4" value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} required className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-gray-400" placeholder="Chia sẻ cảm nhận..."></textarea>
                             </div>
                             <button type="submit" disabled={submittingReview} className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ${submittingReview ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                 {submittingReview ? <FaSpinner className="animate-spin mr-2 h-4 w-4" /> : null} Gửi đánh giá
                             </button>
                         </form>
                     )}
                     {/* Thông báo nếu đã đăng nhập nhưng đã review */}
                      {localStorage.getItem('authToken') && userHasReviewed && editingReviewId === null && (
                          <p className="text-sm text-gray-400 mb-6 italic">Bạn đã đánh giá sản phẩm này. Bạn có thể sửa hoặc xóa đánh giá của mình.</p>
                      )}
                     {/* Yêu cầu đăng nhập nếu chưa */}
                     {!localStorage.getItem('authToken') && ( <p className="text-sm text-gray-400 mb-6"> Vui lòng <Link to="/login" className="text-blue-400 hover:underline">đăng nhập</Link> để gửi đánh giá. </p> )}

                     {/* Danh sách đánh giá */}
                     {loadingReviews ? (
                         <p className="text-gray-400">Đang tải đánh giá...</p>
                     ) : reviewsError ? (
                         <p className="text-red-400">Lỗi tải đánh giá: {reviewsError}</p>
                     ) : reviews.length > 0 ? (
                         <div className="space-y-0">
                             {reviews.map(review => (
                                 <ReviewItem
                                     key={review.review_id}
                                     review={review}
                                     currentUserId={userInfo?.user_id} // Pass current user ID safely
                                     onEdit={handleEditReview}
                                     onDelete={handleDeleteReview}
                                     isEditing={editingReviewId === review.review_id}
                                     editData={editFormData}
                                     onEditChange={handleEditFormChange}
                                     onUpdate={handleUpdateReview}
                                     onCancelEdit={handleCancelEdit}
                                     editingLoading={editingLoading && editingReviewId === review.review_id}
                                     deleteLoading={deleteLoading}
                                 />
                             ))}
                             {/* Pagination */}
                         </div>
                     ) : (
                         <p className="text-gray-400">Chưa có đánh giá nào.</p>
                     )}
                 </div>
            </div>
        </div>
    );
}

export default ProductDetail;
