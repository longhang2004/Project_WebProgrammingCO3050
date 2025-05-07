// File: frontend/src/pages/public/HomePage.jsx
import React, { useState, useEffect } from 'react'; // Bỏ { useState, useEffect } nếu không dùng trực tiếp ở đây nữa
import { Link } from 'react-router-dom';
import SliderBanner from '../../components/SliderBanner';
// import FixedBanner from '../../components/FixedBanner'; // Bỏ nếu PromoBanner thay thế
import ProductList from '../../components/ProductList';
import { SkeletonProductList } from '../../components/SkeletonProductCard'; // Đảm bảo import này đúng
import { useFetchProducts } from '../../hooks/useFetchProducts'; // Đảm bảo hook này đúng
import { FaExclamationTriangle, FaLaptop, FaMobileAlt, FaGift, FaTags, FaNewspaper, FaSpinner } from 'react-icons/fa'; // Thêm FaNewspaper
import { motion } from 'framer-motion';


// Component Section Sản phẩm cải tiến
const EnhancedProductSection = ({ title, endpoint, linkTo, perPage = 5, sectionBg = "bg-transparent" }) => {
    const { products, loading, error } = useFetchProducts(endpoint, 1, perPage);

    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
    };

    return (
        <motion.section
            className={`py-8 md:py-12 ${sectionBg}`}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-main">{title}</h2>
                    {linkTo && (
                        <Link to={linkTo} className="text-sm font-medium text-text-link hover:text-text-link-hover hover:underline transition-colors">
                            Xem tất cả &gt;
                        </Link>
                    )}
                </div>
                {loading && <SkeletonProductList count={perPage} />}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center h-40 text-error bg-red-500/10 p-4 rounded border border-error/30">
                        <FaExclamationTriangle className="text-3xl mb-2"/>
                        <p className="font-semibold">Lỗi tải sản phẩm</p>
                        <p className="text-sm text-red-600/80">{error}</p>
                   </div>
                )}
                {!loading && !error && products.length > 0 && (
                   <ProductList productsList={products} />
                )}
                {!loading && !error && products.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Không có sản phẩm nào.</p>
                 )}
            </div>
       </motion.section>
    );
};

// Component Banner Quảng cáo đơn giản
const PromoBanner = ({ imageUrl, altText, link = "#", bgColor = "bg-transparent" }) => (
    <motion.div
        className={`my-8 md:my-12 ${bgColor}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
    >
        <div className="container mx-auto px-4 py-6 md:py-10">
           <Link to={link} className="block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
               <img src={imageUrl} alt={altText} className="w-full h-auto object-cover" loading="lazy"/>
           </Link>
        </div>
   </motion.div>
);

// *** BLOG PREVIEW SECTION - CẬP NHẬT ĐỂ FETCH TỪ API ***
const BlogPreviewSection = () => {
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [errorPosts, setErrorPosts] = useState(null);

    useEffect(() => {
        const fetchLatestPosts = async () => {
            setLoadingPosts(true);
            setErrorPosts(null);
            try {
                // Gọi API mới để lấy 3 bài viết mới nhất
                const response = await fetch('http://localhost/Project_WebProgrammingCO3050/backend/api/post?page=1&per_page=3');
                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData?.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success && data.data?.data) {
                    setPosts(data.data.data); // data.data.data chứa mảng bài viết
                } else {
                    throw new Error(data.message || 'Không thể tải danh sách bài viết.');
                }
            } catch (error) {
                console.error("Error fetching latest posts:", error);
                setErrorPosts(error.message);
            } finally {
                setLoadingPosts(false);
            }
        };
        fetchLatestPosts();
    }, []);


    const postVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
       <section className="py-10 md:py-16 bg-surface">
            <div className="container mx-auto px-4">
               <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-text-main">Tin Tức & Thủ Thuật</h2>
                    <Link to="/blog" className="text-sm font-medium text-text-link hover:text-text-link-hover hover:underline transition-colors">Xem thêm</Link>
               </div>

                {loadingPosts && (
                    <div className="flex justify-center items-center h-40 text-gray-500">
                        <FaSpinner className="animate-spin text-3xl" /> <span className="ml-2">Đang tải bài viết...</span>
                    </div>
                )}
                {errorPosts && !loadingPosts && (
                     <div className="flex flex-col items-center justify-center h-40 text-error bg-red-500/10 p-4 rounded border border-error/30">
                         <FaExclamationTriangle className="text-3xl mb-2"/>
                         <p className="font-semibold">Lỗi tải bài viết</p>
                         <p className="text-sm text-red-600/80">{errorPosts}</p>
                     </div>
                )}
                {!loadingPosts && !errorPosts && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                       {posts.map((post, index) => (
                            <motion.div
                               key={post.post_id} // Sử dụng post_id từ API
                                className="group border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
                                variants={postVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                custom={index}
                            >
                               <Link to={`/blog/${post.slug}`} className="block"> {/* Link đến chi tiết bài viết bằng slug */}
                                   <img
                                        src={post.featured_image_url || '/placeholder-blog.png'} // Ảnh từ API
                                        alt={post.title}
                                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-blog.png'; }}
                                    />
                               </Link>
                               <div className="p-4">
                                   <h3 className="text-md font-semibold text-text-main mb-2 line-clamp-2">
                                        <Link to={`/blog/${post.slug}`} className="hover:text-primary">{post.title}</Link> {/* Tiêu đề từ API */}
                                   </h3>
                                   <p className="text-xs text-text-muted mb-1">
                                        {post.author?.username || 'Admin'} - {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                   </p>
                                   <p className="text-sm text-text-muted line-clamp-3">{post.excerpt || 'Chưa có tóm tắt...'}</p> {/* Tóm tắt từ API */}
                               </div>
                           </motion.div>
                       ))}
                   </div>
                )}
                {!loadingPosts && !errorPosts && posts.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Chưa có bài viết nào.</p>
                 )}
            </div>
       </section>
    );
};

// Component Chính HomePage
function HomePage() {
    const quickAccessCategories = [
        { name: "Điện thoại", icon: FaMobileAlt, link: "/phone", color: "text-primary" },
        { name: "Laptop", icon: FaLaptop, link: "/laptop", color: "text-secondary" },
        { name: "Bài viết mới", icon: FaNewspaper, link: "/blog", color: "text-green-500" }, // Thêm link Blog
        { name: "Ưu đãi", icon: FaTags, link: "/promotions", color: "text-red-500" }, // Ví dụ
    ];

    return (
        <div className="min-h-screen bg-background text-text-main">
            <SliderBanner />

            {/* QuickCategories */}
            <section className="bg-surface py-6 border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center flex-wrap gap-8 md:gap-16 text-center">
                        {quickAccessCategories.map(cat => {
                            const IconComponent = cat.icon;
                            return (
                                <Link key={cat.name} to={cat.link} className="group block p-3 rounded-lg hover:bg-surface-accent transition-colors duration-200 w-32 md:w-40">
                                    <IconComponent className={`text-3xl md:text-4xl mx-auto mb-2 ${cat.color} group-hover:scale-110 transition-transform duration-200`} />
                                    <span className="text-sm font-medium text-text-main group-hover:text-primary">{cat.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <EnhancedProductSection
                title="Điện Thoại Nổi Bật"
                endpoint="smartphones"
                linkTo="/phone"
                perPage={5} // Số lượng sản phẩm hiển thị
                sectionBg="bg-gradient-to-b from-blue-500/5 to-background"
            />

            <PromoBanner
                imageUrl="https://placehold.co/1200x300/3498db/ffffff?text=Ưu+Đãi+Đặc+Biệt+Tháng+Này!" // Thay bằng URL banner thật
                altText="Ưu đãi hấp dẫn"
                link="/special-offers" // Link đến trang khuyến mãi (nếu có)
            />

            <EnhancedProductSection
                title="Laptop Hàng Đầu"
                endpoint="laptops"
                linkTo="/laptop"
                perPage={5}
                sectionBg="bg-surface"
            />

            <BlogPreviewSection />
        </div>
    );
}

export default HomePage;
