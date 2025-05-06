// src/pages/public/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import SliderBanner from '../../components/SliderBanner';
import ProductList from '../../components/ProductList';
import { SkeletonProductList } from '../../components/SkeletonProductCard';
import { useFetchProducts } from '../../hooks/useFetchProducts';
import { FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import QuickCategories from '../../components/QuickCategories'; // Import component QuickCategories

// Component Section Sản phẩm cải tiến (Giữ nguyên như trước)
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
                {!loading && !error && (
                   <ProductList productsList={products} />
                )}
            </div>
       </motion.section>
    );
};

// Component Banner Quảng cáo đơn giản (Giữ nguyên như trước)
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

// Placeholder cho Blog Preview (Ví dụ)
const BlogPreviewSection = () => {
     // Logic fetch blog posts sẽ ở đây (hoặc trong hook riêng)
     const placeholderPosts = [
        { id: 1, title: "Đánh giá iPhone mới nhất: Có đáng nâng cấp?", excerpt: "Khám phá những cải tiến camera, hiệu năng và thời lượng pin...", image: "/blog/iphone-review.jpg", link: "/blog/1" },
        { id: 2, title: "Top 5 Laptop cho sinh viên IT năm 2025", excerpt: "Lựa chọn laptop phù hợp với nhu cầu học tập và làm việc ngành CNTT...", image: "/blog/laptop-student.jpg", link: "/blog/2" },
        { id: 3, title: "Cách chọn mua điện thoại cũ: Những lưu ý quan trọng", excerpt: "Tránh rủi ro khi mua điện thoại đã qua sử dụng với các mẹo sau...", image: "/blog/used-phone.jpg", link: "/blog/3" },
    ];

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
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {placeholderPosts.map((post, index) => (
                         <motion.div
                            key={post.id}
                             className="group border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white" // Nền trắng cho card blog
                             variants={postVariants}
                             initial="hidden"
                             whileInView="visible"
                             viewport={{ once: true, amount: 0.2 }}
                             custom={index} // Có thể dùng để tạo hiệu ứng stagger nếu muốn
                         >
                            <Link to={post.link} className="block">
                                <img src={post.image || '/placeholder-blog.png'} alt={post.title} className="w-full h-40 object-cover"/>
                            </Link>
                            <div className="p-4">
                                <h3 className="text-md font-semibold text-text-main mb-2 line-clamp-2">
                                     <Link to={post.link} className="hover:text-primary">{post.title}</Link>
                                 </h3>
                                 <p className="text-sm text-text-muted line-clamp-3">{post.excerpt}</p>
                             </div>
                        </motion.div>
                     ))}
                 </div>
             </div>
        </section>
     );
};


// Component Chính HomePage đã được đơn giản hóa
function HomePage() {
    return (
        <div className="min-h-screen bg-background text-text-main">
            <SliderBanner />

            <QuickCategories /> {/* Chỉ còn Điện thoại và Laptop */}

            {/* Section Điện thoại */}
            <EnhancedProductSection
                title="Điện Thoại Nổi Bật"
                endpoint="smartphones" // API endpoint cho điện thoại
                linkTo="/phone"
                perPage={5} // Số lượng điện thoại muốn hiển thị
                sectionBg="bg-gradient-to-b from-blue-500/5 to-background" // Nền có hiệu ứng
            />

            {/* Một Banner quảng cáo chung (tùy chọn) */}
            <PromoBanner
                imageUrl="/banners/generic-promo.jpg" // Thay bằng ảnh banner của bạn
                altText="Ưu đãi hấp dẫn tại ABC Shop"
                link="/special-offers" // Link đến trang ưu đãi (nếu có) hoặc trang chủ
                bgColor="bg-transparent"
            />

            {/* Section Laptop */}
            <EnhancedProductSection
                title="Laptop Hàng Đầu"
                endpoint="laptops" // API endpoint cho laptop
                linkTo="/laptop"
                perPage={5} // Số lượng laptop muốn hiển thị
                sectionBg="bg-surface" // Nền khác để xen kẽ
            />

             {/* Section Tin tức/Blog (Tùy chọn) */}
             <BlogPreviewSection />

            {/* Không còn section Deals, Accessories, Brands */}
        </div>
    );
}

export default HomePage;