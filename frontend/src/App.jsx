// File: frontend/src/App.jsx

import { Routes, Route, Navigate, Link } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ProductDetail from './pages/public/ProductDetail';
import UserCart from './pages/user/UserCart';
import HomePage from './pages/public/HomePage';

// ADMIN PAGES
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminAddEditProductPage from './pages/admin/AdminAddEditProductPage';
import AdminOrderListPage from './pages/admin/AdminOrderListPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';
import AdminPostListPage from './pages/admin/AdminPostListPage';
import AdminAddEditPostPage from './pages/admin/AdminAddEditPostPage';
import AdminReviewListPage from './pages/admin/AdminReviewListPage';

// Placeholder for NotFoundPage
const NotFoundPage = () => (
    <div className="text-center py-20 bg-gray-900 text-white min-h-[calc(100vh-var(--header-height,100px)-var(--footer-height,50px))] flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">Oops! Trang bạn tìm kiếm không tồn tại.</p>
        <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300">
            Về Trang Chủ
        </Link>
    </div>
);


function App() {
  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {/* Public Routes with Layout */}
            <Route path="/*" element={ <PublicLayoutRoutes /> } />

            {/* Admin Protected Routes */}
            {/* AdminLayout sẽ là layout cha, và các trang con sẽ render vào Outlet của nó */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              {/* Default route for /admin, redirects to /admin/dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductListPage />} />
              <Route path="products/add" element={<AdminAddEditProductPage />} />
              <Route path="products/edit/:productId" element={<AdminAddEditProductPage />} />
              <Route path="orders" element={<AdminOrderListPage />} />
              {/* <Route path="orders/:orderId" element={<AdminOrderDetailPage />} /> */}
              <Route path="users" element={<AdminUserListPage />} />
              <Route path="posts" element={<AdminPostListPage />} />
              <Route path="posts/add" element={<AdminAddEditPostPage />} />
              <Route path="posts/edit/:postId" element={<AdminAddEditPostPage />} />
              <Route path="reviews" element={<AdminReviewListPage />} />
              {/* Catch-all for /admin/* if no other admin route matches */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </main>
      </div>
  );
}

// Component để nhóm các route public có layout chung
const PublicLayoutRoutes = () => (
  <>
    <TopBar />
    <NavigationBar />
    <div className="flex-grow">
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/phone" element={<ProductsByType key="phone" />} />
            <Route path="/laptop" element={<ProductsByType key="laptop" />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/cart" element={<UserCart />} />
            </Route>
            {/* Public 404: Đặt ở cuối cùng trong nested Routes này */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </div>
    <Footer />
  </>
);

export default App;
