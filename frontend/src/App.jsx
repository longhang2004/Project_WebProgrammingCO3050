import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header';
// import Navbar from './components/Navbar';
import TopBar from './components/TopBar'; // Import mới
// import MainHeader from './components/MainHeader'; // Import mới
import NavigationBar from './components/NavigationBar'; // Import NavigationBar
import Footer from './components/Footer';
import ProductsByType from './pages/public/ProductsByType';
import BlogList from './pages/public/BlogList';
import BlogDetail from './pages/public/BlogDetail';
import AboutPage from './pages/public/AboutPage'; // Import trang Giới thiệu
import FAQPage from './pages/public/FAQPage'; // Import trang FAQ
import ContactPage from './pages/public/ContactPage'; // Component Contact tôi vừa cung cấp



function App() {
  return (
    <Router>
      {/* 1. Wrapper chính với các lớp flexbox */}
      <div className="flex flex-col min-h-screen">
        {/* <Navbar />
        <Header />
        <NavigationBar /> */}

        <TopBar />
        {/* <MainHeader /> MainHeader sẽ quản lý việc mở/đóng MobileMenu */}
        <NavigationBar /> {/* Chỉ hiển thị trên desktop */}
        {/* 2. Phần nội dung chính (bao bọc Routes) với lớp flex-grow */}
        <main className="flex-grow"> {/* Hoặc dùng className="flex-1" */}
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/about" element={<AboutPage />} /> {/* Route cho trang Giới thiệu */}
            <Route path="/faq" element={<FAQPage />} /> {/* Route cho trang FAQ */}
            <Route path="/contact" element={<ContactPage />} /> {/* Trang Liên hệ - Đây là chỗ dùng component ContactPage */}
            <Route path="/phone" element={<ProductsByType key="phone" />} /> {/* Sử dụng component ProductsByType */}
            <Route path="/laptop" element={<ProductsByType key="laptop" />} /> {/* Sử dụng component ProductsByType */}

            {/* --- Các route khác của bạn --- */}
            {/* <Route path="/phone" element={<ProductsByType type="phone" />} />
            <Route path="/laptop" element={<ProductsByType type="laptop" />} /> */}
            {/* <Route path="/product/:productId" element={<ProductDetail />} /> */}
            {/* <Route path="/cart" element={<UserCart />} /> */}
            {/* <Route path="/profile" element={<UserProfile />} /> */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
            {/* --- Kết thúc các route khác --- */}

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;