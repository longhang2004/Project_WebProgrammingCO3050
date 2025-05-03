import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import ProductsByType from './pages/public/ProductsByType';
import BlogList from './pages/public/BlogList';
import BlogDetail from './pages/public/BlogDetail';
import AboutPage from './pages/public/AboutPage';
import FAQPage from './pages/public/FAQPage';
import ContactPage from './pages/public/ContactPage'; 
import RegisterPage from './pages/public/RegisterPage';
import LoginPage from './pages/public/LoginPage';
import UserProfile from './pages/user/UserProfile';
import ProtectedRoute from './components/ProtectedRoute'
import ProductDetail from './pages/public/ProductDetail';
import UserCart from './pages/user/UserCart';

function App() {
  return (
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
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/product/:productId" element={<ProductDetail />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/cart" element={<UserCart />} /> {/* Route giỏ hàng */}
              </Route>

          </Routes>
        </main>

        <Footer />
      </div>
  );
}

export default App;