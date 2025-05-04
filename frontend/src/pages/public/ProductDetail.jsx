// src/pages/public/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Sửa đường dẫn nếu cần
import { useAuth } from '../../context/AuthContext'; // Sửa đường dẫn nếu cần
import { FaShoppingCart, FaCheckCircle, FaStar, FaRegStar, FaSpinner } from 'react-icons/fa'; // Bỏ FaUserCircle nếu không dùng

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return 'Liên hệ';
    }
    try {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    } catch (error) {
        console.error("Error formatting currency:", error, "Amount:", amount);
        return 'Lỗi giá';
    }
};

// Component hiển thị sao
const StarRating = ({ rating, size = 'text-lg' }) => {
    const numericRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
    const fullStars = Math.max(0, Math.min(5, Math.floor(numericRating)));
    const emptyStars = 5 - fullStars;

    return (
        <div className={`flex items-center text-yellow-400 ${size}`}>
            {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
            {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
        </div>
    );
};

// Component hiển thị một đánh giá
const ReviewItem = ({ review }) => {
    if (!review) return null;
    const userName = review.user?.username || 'Người dùng ẩn danh';
    const userAvatar = review.user?.imageurl || '/avt.png';
    const reviewDate = review.created_at ? new Date(review.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
    const reviewRating = typeof review.rating === 'number' ? review.rating : 0;

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
                    <StarRating rating={reviewRating} size="text-sm" />
                </div>
            </div>
            <p className="text-sm text-gray-300 ml-11 whitespace-pre-wrap break-words">{review.review_text || ''}</p>
        </div>
    );
};


function ProductDetail() {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const { userInfo } = useAuth();

    // States... (giữ nguyên)
    const [product, setProduct] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [productError, setProductError] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [currentPrice, setCurrentPrice] = useState(0);
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

    // Fetch product details
    useEffect(() => {
        setLoadingProduct(true);
        setProductError(null);
        setAddedMessage('');
        fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/product/${productId}`)
            .then(res => {
                if (!res.ok) {
                     return res.json().then(errData => { throw new Error(errData?.message || `Lỗi tải sản phẩm: ${res.status}`); })
                           .catch(() => { throw new Error(`Lỗi tải sản phẩm: ${res.status}`); });
                 }
                return res.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    setProduct(data.data);
                    setCurrentPrice(data.data.price || 0);
                    const avgRating = parseFloat(data.data.rated_stars);
                    setAverageRating(isNaN(avgRating) ? 0 : avgRating);
                    setSelectedColor(data.data.details?.colors?.[0] || '');
                    setSelectedStorage(data.data.details?.storageOptions?.[0] || '');
                } else {
                    throw new Error(data.message || 'Không thể tải chi tiết sản phẩm.');
                }
            })
            .catch(err => {
                console.error("Lỗi fetch chi tiết sản phẩm:", err);
                setProductError(err.message);
                setProduct(null);
            })
            .finally(() => setLoadingProduct(false));
    }, [productId]);

    // Fetch reviews for the product
    useEffect(() => {
        setLoadingReviews(true);
        setReviewsError(null);
        const fetchReviewsUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/product/${productId}/reviews?page=1&per_page=5`;

        fetch(fetchReviewsUrl)
            .then(res => {
                 if (!res.ok) {
                     return res.json().then(errData => { throw new Error(errData?.message || `Lỗi tải đánh giá: ${res.status}`); })
                           .catch(() => { throw new Error(`Lỗi tải đánh giá: ${res.status}`); });
                 }
                return res.json();
            })
            .then(data => {
                // *** SỬA LẠI LOGIC KIỂM TRA PHẢN HỒI ***
                if (data.success) {
                    // Nếu thành công, kiểm tra xem có data và data.data là mảng không
                    if (data.data && Array.isArray(data.data.data)) {
                        setReviews(data.data.data);
                        // Lấy pagination nếu có, nếu không thì set null
                        setReviewPagination(data.data.pagination || null);
                    } else {
                        // Thành công nhưng cấu trúc data không đúng như mong đợi (ví dụ: thiếu data.data)
                        console.warn("API reviews trả về success:true nhưng cấu trúc data không đúng:", data);
                        setReviews([]); // Đặt về rỗng cho an toàn
                        setReviewPagination(null);
                        // Không nên throw lỗi ở đây vì về mặt kỹ thuật là thành công
                        // setReviewsError("Dữ liệu đánh giá trả về không đúng định dạng.");
                    }
                } else {
                    // Nếu success: false, ném lỗi với message từ backend
                    console.error("Lỗi từ API đánh giá:", data.message);
                    throw new Error(data.message || 'Lỗi không xác định từ API đánh giá.');
                }
            })
            .catch(err => { // Bắt lỗi từ throw new Error hoặc lỗi mạng
                console.error("Lỗi fetch đánh giá:", err);
                setReviewsError(err.message);
                setReviews([]);
                setReviewPagination(null);
            })
            .finally(() => setLoadingReviews(false));

    }, [productId]);


    const handleAddToCart = () => { /* ... giữ nguyên ... */
        if (!product) return;
        const itemToAdd = {
            product_id: product.product_id,
            name: product.name,
            price: currentPrice,
            imageurl: product.imageurl,
            quantity: quantity,
            stock: product.stock
        };
        addToCart(itemToAdd, quantity);
        setAddedMessage(`${quantity} "${product.name}" đã được thêm vào giỏ!`);
        setTimeout(() => setAddedMessage(''), 3000);
    };

    // Xử lý gửi đánh giá mới
    const handleSubmitReview = async (e) => { /* ... giữ nguyên ... */
        e.preventDefault();
        setSubmittingReview(true);
        setSubmitReviewError('');
        setSubmitReviewSuccess('');

        if (newRating === 0) {
            setSubmitReviewError('Vui lòng chọn số sao đánh giá.');
            setSubmittingReview(false);
            return;
        }
        if (!newReviewText.trim()) {
            setSubmitReviewError('Vui lòng nhập nội dung đánh giá.');
            setSubmittingReview(false);
            return;
        }
        if (!userInfo) {
            setSubmitReviewError('Vui lòng đăng nhập để gửi đánh giá.');
            setSubmittingReview(false);
            return;
        }

        const reviewData = {
            user_id: userInfo.user_id,
            product_id: parseInt(productId),
            rating: newRating,
            review_text: newReviewText,
        };

        try {
            const submitReviewUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/review`;
            const response = await fetch(submitReviewUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(reviewData),
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || `Lỗi gửi đánh giá: ${response.status}`);
            }
            setSubmitReviewSuccess('Gửi đánh giá thành công!');
            setNewRating(0);
            setNewReviewText('');
             const newlyAddedReview = result.review || {
                 ...reviewData,
                 review_id: result.review_id || Date.now(),
                 created_at: new Date().toISOString(),
                 user: { username: userInfo.username, imageurl: userInfo.imageurl || '/avt.png' }
             };
            setReviews(prevReviews => [newlyAddedReview, ...prevReviews]);
            const currentTotalReviews = reviewPagination?.total_items ?? reviews.length;
            const newTotalReviews = currentTotalReviews + 1;
            setAverageRating(prevAvg => {
                 const totalRating = (prevAvg * currentTotalReviews) + newRating;
                 return newTotalReviews > 0 ? parseFloat((totalRating / newTotalReviews).toFixed(1)) : 0;
             });
             setReviewPagination(prev => ({...prev, total_items: newTotalReviews}));
        } catch (err) {
            console.error("Lỗi gửi đánh giá:", err);
            setSubmitReviewError(err.message || 'Đã có lỗi xảy ra.');
        } finally {
            setSubmittingReview(false);
        }
    };

    // --- Xử lý Loading và Error cho Product ---
    if (loadingProduct) return <div className="text-center text-white py-10">Đang tải chi tiết sản phẩm...</div>;
    if (productError) return <div className="text-center text-red-500 py-10">Lỗi: {productError}</div>;
    if (!product) return <div className="text-center text-white py-10">Không tìm thấy sản phẩm.</div>;

    // --- JSX Render ---
    return (
        <div className="min-h-screen flex flex-col text-black bg-gray-900 text-white">
            <div className="md:px-[100px] my-8 flex-1 px-[20px]">
                 {/* Breadcrumbs */}
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

                 {/* Tên và đánh giá trung bình */}
                 <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                     <h1 className="text-2xl lg:text-3xl font-bold text-white flex-1">{product.name || 'Sản phẩm không tên'}</h1>
                     <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 flex items-center flex-shrink-0">
                         <StarRating rating={averageRating} />
                         <span className="ml-2 text-sm text-gray-400">({averageRating > 0 ? averageRating.toFixed(1) : 'Chưa có'} / 5)</span>
                         <span className="mx-2 text-gray-600">|</span>
                         <span className="text-sm text-gray-400">
                             {reviewPagination ? `${reviewPagination.total_items} đánh giá` : (reviews.length > 0 ? `${reviews.length} đánh giá` : '0 đánh giá')}
                         </span>
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
                         <h2 className="text-3xl font-bold text-red-500 mb-3">{formatCurrency(currentPrice)}</h2>
                         {/* Tùy chọn màu sắc, bộ nhớ (nếu có) */}
                         {/* ... */}

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
                         {addedMessage && (
                            <div className="my-3 text-center text-green-400 bg-green-900/50 p-2 rounded text-sm flex items-center justify-center gap-2">
                                <FaCheckCircle /> {addedMessage}
                            </div>
                         )}

                         {/* Nút hành động */}
                         <div className="flex flex-col sm:flex-row gap-3 mt-6">
                             <button onClick={handleAddToCart} className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800">
                                 <FaShoppingCart /> Thêm vào giỏ hàng
                             </button>
                             <button className="flex-1 bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800">
                                 Mua ngay
                             </button>
                         </div>

                         {/* Thông tin bảo hành, đổi trả */}
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
                     <div className="prose prose-sm sm:prose-base prose-invert text-gray-300 max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '<p>Chưa có mô tả chi tiết cho sản phẩm này.</p>' }}></div>
                 </div>

                 {/* Phần Đánh giá Sản phẩm */}
                 <div className="mt-8 lg:mt-12 bg-gray-800 p-6 rounded-lg shadow-md">
                     <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Đánh giá ({reviewPagination?.total_items ?? 0})</h2>

                     {/* Form viết đánh giá */}
                     {userInfo ? (
                         <form onSubmit={handleSubmitReview} className="mb-6 p-4 border border-gray-700 rounded-md bg-gray-700/50">
                             <h3 className="text-lg font-medium text-white mb-3">Viết đánh giá của bạn</h3>
                             {submitReviewError && <p className="mb-3 text-sm text-red-400">{submitReviewError}</p>}
                             {submitReviewSuccess && <p className="mb-3 text-sm text-green-400">{submitReviewSuccess}</p>}

                             <div className="mb-3">
                                 <label className="block text-sm font-medium text-gray-300 mb-1">Chọn đánh giá:</label>
                                 <div className="flex items-center text-2xl text-gray-500">
                                     {[1, 2, 3, 4, 5].map((star) => (
                                         <button
                                             type="button"
                                             key={star}
                                             onMouseEnter={() => setHoverRating(star)}
                                             onMouseLeave={() => setHoverRating(0)}
                                             onClick={() => setNewRating(star)}
                                             className={`focus:outline-none transition-colors duration-150 ${
                                                 (hoverRating || newRating) >= star ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-500'
                                             }`}
                                             aria-label={`Đánh giá ${star} sao`}
                                         >
                                             <FaStar />
                                         </button>
                                     ))}
                                     {newRating > 0 && <span className="ml-2 text-sm text-yellow-400">({newRating}/5)</span>}
                                 </div>
                             </div>

                             <div className="mb-3">
                                 <label htmlFor="reviewText" className="block text-sm font-medium text-gray-300 mb-1">Nội dung đánh giá:</label>
                                 <textarea
                                     id="reviewText"
                                     rows="4"
                                     value={newReviewText}
                                     onChange={(e) => setNewReviewText(e.target.value)}
                                     required
                                     className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-gray-400"
                                     placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                                 ></textarea>
                             </div>

                             <button
                                 type="submit"
                                 disabled={submittingReview}
                                 className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 ${submittingReview ? 'opacity-50 cursor-not-allowed' : ''}`}
                             >
                                 {submittingReview ? <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" /> : null}
                                 Gửi đánh giá
                             </button>
                         </form>
                     ) : (
                         <p className="text-sm text-gray-400 mb-6">
                             Vui lòng <Link to="/login" className="text-blue-400 hover:underline">đăng nhập</Link> để gửi đánh giá.
                         </p>
                     )}

                     {/* Danh sách đánh giá */}
                     {loadingReviews ? (
                         <p className="text-gray-400">Đang tải đánh giá...</p>
                     ) : reviewsError ? (
                         <p className="text-red-400">Lỗi: {reviewsError}</p>
                     ) : reviews.length > 0 ? (
                         <div className="space-y-4">
                             {reviews.map(review => (
                                 // Đảm bảo có key duy nhất
                                 <ReviewItem key={review?.review_id || Math.random()} review={review} />
                             ))}
                             {/* Thêm nút xem thêm nếu có phân trang */}
                             {reviewPagination && reviewPagination.current_page < reviewPagination.total_pages && (
                                <div className="text-center mt-4">
                                    <button
                                        // onClick={loadMoreReviews} // Cần thêm hàm này
                                        className="text-blue-400 hover:underline text-sm"
                                    >
                                        Xem thêm đánh giá
                                    </button>
                                </div>
                             )}
                         </div>
                     ) : (
                         <p className="text-gray-400">Chưa có đánh giá nào cho sản phẩm này.</p>
                     )}
                 </div>
            </div>
        </div>
    );
}

export default ProductDetail;
