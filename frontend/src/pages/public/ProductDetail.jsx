// src/pages/public/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Import useAuth để kiểm tra đăng nhập và lấy user_id
import { FaShoppingCart, FaCheckCircle, FaStar, FaRegStar, FaSpinner, FaUserCircle } from 'react-icons/fa'; // Thêm icons sao, spinner

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Component hiển thị sao
const StarRating = ({ rating, size = 'text-lg' }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5; // Check for half star if needed, currently not used
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Adjust if using half stars

    return (
        <div className={`flex items-center text-yellow-400 ${size}`}>
            {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
            {/* Optional: Add half star logic here if needed */}
            {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
        </div>
    );
};

// Component hiển thị một đánh giá
const ReviewItem = ({ review }) => {
    // Lấy thông tin user từ review (giả sử backend trả về user object hoặc username)
    const userName = review.user?.username || review.username || 'Người dùng ẩn danh';
    const userAvatar = review.user?.imageurl || '/avt.png'; // Lấy avatar nếu có

    return (
        <div className="py-4 border-b border-gray-700 last:border-b-0">
            <div className="flex items-center mb-2">
                <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full mr-3 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = '/avt.png'; }}/>
                <div>
                    <p className="font-semibold text-sm text-blue-400">{userName}</p>
                    <StarRating rating={review.rating} size="text-sm" />
                </div>
                <span className="ml-auto text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('vi-VN')}
                </span>
            </div>
            <p className="text-sm text-gray-300 ml-11">{review.review_text}</p>
        </div>
    );
};


function ProductDetail() {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const { userInfo } = useAuth(); // Lấy thông tin user để kiểm tra đăng nhập

    // State cho sản phẩm
    const [product, setProduct] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [productError, setProductError] = useState(null);

    // State cho tùy chọn sản phẩm
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [currentPrice, setCurrentPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedMessage, setAddedMessage] = useState('');

    // State cho reviews
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);
    const [averageRating, setAverageRating] = useState(0); // State riêng cho điểm trung bình

    // State cho form review mới
    const [newRating, setNewRating] = useState(0); // Điểm sao người dùng chọn
    const [hoverRating, setHoverRating] = useState(0); // Điểm sao khi hover
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
                if (!res.ok) throw new Error(`Lỗi tải sản phẩm: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    setProduct(data.data);
                    setCurrentPrice(data.data.price || 0);
                    setAverageRating(data.data.rated_stars || 0); // Lấy điểm trung bình từ product data
                    setSelectedColor(data.data.details?.colors?.[0] || '');
                    setSelectedStorage(data.data.details?.storageOptions?.[0] || '');
                } else {
                    throw new Error(data.message || 'Không thể tải chi tiết sản phẩm.');
                }
            })
            .catch(err => {
                console.error("Lỗi fetch chi tiết sản phẩm:", err);
                setProductError(err.message);
            })
            .finally(() => setLoadingProduct(false));
    }, [productId]);

    // Fetch reviews for the product
    useEffect(() => {
        setLoadingReviews(true);
        setReviewsError(null);
        // --- Thay thế bằng URL API lấy reviews thực tế ---
        const fetchReviewsUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/product/${productId}/reviews`;
        // --- Giả lập fetch reviews (XÓA KHI CÓ API THẬT) ---
        const mockReviews = [
             { review_id: 1, user_id: 1, product_id: parseInt(productId), rating: 4.5, review_text: "Sản phẩm tốt, đáng tiền!", created_at: "2024-04-20T10:00:00Z", user: { username: 'johndoe', imageurl: '/avt.png' } },
             { review_id: 2, user_id: 2, product_id: parseInt(productId), rating: 5.0, review_text: "Rất hài lòng với chất lượng và dịch vụ.", created_at: "2024-04-22T15:30:00Z", user: { username: 'janesmith' } },
         ];
         setTimeout(() => {
             setReviews(mockReviews);
             setLoadingReviews(false);
         }, 800); // Giả lập độ trễ
        // --- Kết thúc giả lập ---

        /* --- Code Fetch API thật (Bỏ comment khi có API) ---
        fetch(fetchReviewsUrl)
            .then(res => {
                if (!res.ok) throw new Error(`Lỗi tải đánh giá: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.success && Array.isArray(data.data)) { // Giả sử API trả về { success: true, data: [...] }
                    setReviews(data.data);
                    // Tính lại điểm trung bình nếu cần (hoặc tin tưởng backend)
                    // const avg = data.data.reduce((acc, rev) => acc + rev.rating, 0) / data.data.length;
                    // if (!isNaN(avg)) setAverageRating(avg);
                } else {
                     // Nếu không có đánh giá nào cũng không nên báo lỗi
                     if (data.message?.includes("not found")) { // Ví dụ check message từ backend
                         setReviews([]);
                     } else {
                         throw new Error(data.message || 'Dữ liệu đánh giá không hợp lệ.');
                     }
                }
            })
            .catch(err => {
                console.error("Lỗi fetch đánh giá:", err);
                setReviewsError(err.message);
                setReviews([]); // Đặt mảng rỗng nếu lỗi
            })
            .finally(() => setLoadingReviews(false));
        */ // --- Kết thúc code Fetch API thật ---

    }, [productId]);


    const handleAddToCart = () => { /* ... (giữ nguyên) ... */
        if (!product) return;
        const itemToAdd = { ...product, price: currentPrice };
        addToCart(itemToAdd, quantity);
        setAddedMessage(`${quantity} "${product.name}" đã được thêm vào giỏ!`);
        setTimeout(() => setAddedMessage(''), 3000);
    };

    // Xử lý gửi đánh giá mới
    const handleSubmitReview = async (e) => {
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
            product_id: parseInt(productId), // Đảm bảo là số
            rating: newRating,
            review_text: newReviewText,
        };

        try {
            // --- Thay thế bằng URL API gửi review thực tế ---
            const submitReviewUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/review`; // Hoặc /api/product/{id}/review

            const response = await fetch(submitReviewUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Thêm Authorization nếu API yêu cầu
                    // 'Authorization': `Bearer ${your_auth_token}`
                },
                body: JSON.stringify(reviewData),
                credentials: 'include' 
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || `Lỗi gửi đánh giá: ${response.status}`);
            }

            // --- Gửi thành công ---
            setSubmitReviewSuccess('Gửi đánh giá thành công!');
            // Reset form
            setNewRating(0);
            setNewReviewText('');
            // Thêm review mới vào đầu danh sách để cập nhật UI ngay lập tức
            // Giả sử backend trả về review vừa tạo trong result.data
            const newlyAddedReview = result.data?.review || { ...reviewData, review_id: Date.now(), created_at: new Date().toISOString(), user: { username: userInfo.username, imageurl: userInfo.imageurl } }; // Tạo review giả nếu backend không trả về
            setReviews(prevReviews => [newlyAddedReview, ...prevReviews]);
            // Cập nhật lại điểm trung bình (nếu cần) - tốt nhất là fetch lại hoặc tin tưởng backend cập nhật
            // fetchProductDetailsAgain(); // Gọi lại hàm fetch product để lấy rated_stars mới

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
        <div className="min-h-screen flex flex-col text-black bg-gray-900">
            <div className="md:px-[100px] my-8 flex-1 px-[20px]">
                {/* ... (Breadcrumbs, Tên, Đánh giá trung bình) ... */}
                 <div className="text-gray-400 mb-4 text-sm">
                    <Link to="/" className="hover:text-blue-300">Trang chủ</Link> &gt;
                    {product.category && ( <> <Link to={`/${product.category.toLowerCase()}`} className="hover:text-blue-300 capitalize">{product.category}</Link> &gt; </> )}
                    <span className="text-white">{product.name}</span>
                </div>
                 <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white flex-1">{product.name}</h1>
                    {/* Hiển thị điểm trung bình */}
                    <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 flex items-center flex-shrink-0">
                        <StarRating rating={averageRating} />
                        <span className="ml-2 text-sm text-gray-400">({averageRating > 0 ? averageRating.toFixed(1) : 'Chưa có'} / 5)</span>
                        <span className="mx-2 text-gray-600">|</span>
                        <span className="text-sm text-gray-400">{reviews.length} đánh giá</span>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8">
                    {/* ... (Cột trái - Ảnh và Thông số) ... */}
                     <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg shadow-md">
                        <div className="mb-4 sticky top-[80px]">
                            <img src={product.imageurl || '/placeholder-image.png'} alt={product.name} className="w-full h-auto max-h-[400px] object-contain bg-white rounded" onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.png'; }} />
                        </div>
                        {product.details && ( <div className="mt-6 border-t border-gray-700 pt-4"> <h2 className="text-lg font-semibold text-white mb-3">Thông số nổi bật</h2> <ul className="space-y-1 text-sm text-gray-300"> {product.details.type === 'smartphone' && <> <li><strong>Màn hình:</strong> {product.details.screen_description}</li> <li><strong>Camera:</strong> {product.details.camera}</li> <li><strong>Chip:</strong> {product.details.processor}</li> <li><strong>RAM/ROM:</strong> {product.details.RAM_ROM}</li> <li><strong>Pin:</strong> {product.details.battery}</li> </>} {product.details.type === 'laptop' && <> <li><strong>CPU:</strong> {product.details.CPU}</li> <li><strong>RAM:</strong> {product.details.RAM}</li> <li><strong>Ổ cứng:</strong> {product.details.storage}</li> <li><strong>GPU:</strong> {product.details.GPU}</li> <li><strong>Màn hình:</strong> {product.details.screen_description}</li> </>} </ul> </div> )}
                    </div>

                    {/* ... (Cột phải - Giá, tùy chọn, nút mua) ... */}
                     <div className="md:col-span-3 bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-3xl font-bold text-red-500 mb-3">{formatCurrency(currentPrice)}</h2>
                         {product.promotion && ( <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-md mb-4 text-sm"> {product.promotion} </div> )}
                         {product.details?.colors && product.details.colors.length > 0 && ( <div className="mb-4"> <label className="block mb-2 text-sm font-medium text-gray-300">Chọn màu:</label> <div className="flex flex-wrap gap-2"> {product.details.colors.map((color, index) => ( <button key={index} onClick={() => setSelectedColor(color)} className={`px-4 py-1.5 border rounded text-sm transition duration-200 ${selectedColor === color ? 'bg-blue-600 border-blue-500 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-500' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'}`}> {color} </button> ))} </div> </div> )}
                         {product.details?.storageOptions && product.details.storageOptions.length > 0 && ( <div className="mb-5"> <label className="block mb-2 text-sm font-medium text-gray-300">Chọn bộ nhớ:</label> <div className="flex flex-wrap gap-2"> {product.details.storageOptions.map((storage, index) => ( <button key={index} onClick={() => setSelectedStorage(storage)} className={`px-4 py-1.5 border rounded text-sm transition duration-200 ${selectedStorage === storage ? 'bg-blue-600 border-blue-500 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-500' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'}`}> {storage} </button> ))} </div> </div> )}
                        <div className="mb-5 flex items-center gap-3">
                             <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">Số lượng:</label>
                             <div className="flex items-center border border-gray-600 rounded"> <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-l text-lg" aria-label="Giảm số lượng">-</button> <input type="number" id="quantity" name="quantity" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" className="w-12 text-center bg-gray-700 border-l border-r border-gray-600 py-1 focus:outline-none text-white" /> <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-r text-lg" aria-label="Tăng số lượng">+</button> </div>
                        </div>
                        {addedMessage && ( <div className="my-3 text-center text-green-400 bg-green-900/50 p-2 rounded text-sm flex items-center justify-center gap-2"> <FaCheckCircle /> {addedMessage} </div> )}
                        <div className="flex flex-col sm:flex-row gap-3 mt-6"> <button onClick={handleAddToCart} className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"> <FaShoppingCart /> Thêm vào giỏ hàng </button> <button className="flex-1 bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800"> Mua ngay </button> </div>
                         <div className="mt-6 text-xs text-gray-400 space-y-1 border-t border-gray-700 pt-4"> <p>✓ Bảo hành chính hãng {product.warranty_period || 12} tháng.</p> <p>✓ Hỗ trợ đổi trả trong 7 ngày nếu có lỗi nhà sản xuất.</p> <p>✓ Giao hàng nhanh toàn quốc.</p> </div>
                    </div>
                </div>

                {/* ... (Mô tả chi tiết) ... */}
                 <div className="mt-8 lg:mt-12 bg-gray-800 p-6 rounded-lg shadow-md"> <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Mô tả sản phẩm</h2> <div className="prose prose-invert text-gray-300 max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '<p>Chưa có mô tả chi tiết cho sản phẩm này.</p>' }}></div> </div>

                {/* --- Phần Đánh giá Sản phẩm --- */}
                <div className="mt-8 lg:mt-12 bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Đánh giá ({reviews.length})</h2>

                    {/* --- Form viết đánh giá (chỉ hiện khi đăng nhập) --- */}
                    {userInfo ? (
                        <form onSubmit={handleSubmitReview} className="mb-6 p-4 border border-gray-700 rounded-md bg-gray-700/50">
                            <h3 className="text-lg font-medium text-white mb-3">Viết đánh giá của bạn</h3>
                             {submitReviewError && <p className="mb-3 text-sm text-red-400">{submitReviewError}</p>}
                             {submitReviewSuccess && <p className="mb-3 text-sm text-green-400">{submitReviewSuccess}</p>}

                            {/* Star Rating Input */}
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

                            {/* Textarea Input */}
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

                            {/* Submit Button */}
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

                    {/* --- Danh sách đánh giá --- */}
                    {loadingReviews ? (
                        <p className="text-gray-400">Đang tải đánh giá...</p>
                    ) : reviewsError ? (
                        <p className="text-red-400">Lỗi: {reviewsError}</p>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <ReviewItem key={review.review_id} review={review} />
                            ))}
                            {/* Thêm nút xem thêm nếu có phân trang */}
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
