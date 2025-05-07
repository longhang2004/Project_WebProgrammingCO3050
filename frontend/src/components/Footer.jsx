import React from 'react';
// Optional: Import icons if you use a library like react-icons
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
// import { SiVisa, SiMastercard, SiPaypal, SiMomo } from 'react-icons/si'; // Example payment icons
import { SiVisa, SiMastercard, SiPaypal } from 'react-icons/si'; // Example payment icons

function Footer() {
  const companyName = "Công ty Điện Tử XYZ"; // Replace with your actual company name
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Column 1: Company Info & Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-3">{companyName}</h3>
            <p className="text-sm leading-relaxed">
              Nhà cung cấp uy tín các sản phẩm điện tử chính hãng: điện thoại, laptop, phụ kiện công nghệ.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-start">
                {/* Sử dụng icon FaMapMarkerAlt */}
                <FaMapMarkerAlt className="mr-2 mt-1 text-lg text-blue-400 flex-shrink-0" aria-hidden="true" />
                <span>[Số nhà, Đường], [Phường/Xã], [Quận/Huyện], [Tỉnh/Thành phố]</span> {/* Replace */}
              </p>
              <p className="flex items-center">
                 {/* Sử dụng icon FaPhoneAlt */}
                <FaPhoneAlt className="mr-2 text-blue-400" aria-hidden="true" />
                <a href="tel:+84123456789" className="hover:text-white transition-colors duration-300">[Số điện thoại]</a> {/* Replace */}
              </p>
              <p className="flex items-center">
                 {/* Sử dụng icon FaEnvelope */}
                <FaEnvelope className="mr-2 text-blue-400" aria-hidden="true" />
                <a href="mailto:contact@abc.com" className="hover:text-white transition-colors duration-300">contact@abc.com</a> {/* Replace */}
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-3">Liên Kết Nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white hover:underline transition-colors duration-300">Về Chúng Tôi</a></li>
              <li><a href="/products" className="hover:text-white hover:underline transition-colors duration-300">Sản Phẩm</a></li>
              <li><a href="/blog" className="hover:text-white hover:underline transition-colors duration-300">Tin Tức Công Nghệ</a></li>
              <li><a href="/faq" className="hover:text-white hover:underline transition-colors duration-300">Câu Hỏi Thường Gặp (FAQ)</a></li>
              <li><a href="/contact" className="hover:text-white hover:underline transition-colors duration-300">Liên Hệ</a></li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-3">Chính Sách & Hỗ Trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy-policy" className="hover:text-white hover:underline transition-colors duration-300">Chính Sách Bảo Mật</a></li>
              <li><a href="/terms-conditions" className="hover:text-white hover:underline transition-colors duration-300">Điều Khoản Dịch Vụ</a></li>
              <li><a href="/shipping-policy" className="hover:text-white hover:underline transition-colors duration-300">Chính Sách Vận Chuyển</a></li>
              <li><a href="/return-policy" className="hover:text-white hover:underline transition-colors duration-300">Chính Sách Đổi Trả</a></li>
              <li><a href="/warranty" className="hover:text-white hover:underline transition-colors duration-300">Chính Sách Bảo Hành</a></li>
            </ul>
          </div>

          {/* Column 4: Connect & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-3">Kết Nối Với Chúng Tôi</h4>
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a href="[Link Facebook]" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                 {/* Sử dụng icon FaFacebookF */}
                <FaFacebookF className="text-2xl" />
              </a>
              <a href="[Link Instagram]" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                 {/* Sử dụng icon FaInstagram */}
                <FaInstagram className="text-2xl" />
              </a>
              <a href="[Link Youtube]" aria-label="Youtube" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                 {/* Sử dụng icon FaYoutube */}
                <FaYoutube className="text-2xl" />
              </a>
              <a href="[Link Twitter/X]" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
                 {/* Sử dụng icon FaTwitter */}
                <FaTwitter className="text-2xl" />
              </a>
              {/* Thêm các mạng xã hội khác nếu cần */}
            </div>

            {/* Newsletter Signup (Optional) */}
            <div>
              <h5 className="text-md font-semibold text-white mb-2">Đăng Ký Nhận Tin</h5>
              <p className="text-sm mb-3">Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt.</p>
              <form action="[Your Newsletter Endpoint]" method="post" className="flex">
                  <input
                      type="email"
                      name="email"
                      aria-label="Email address for newsletter" // Thêm aria-label cho accessibility
                      placeholder="Nhập email của bạn"
                      required
                      className="flex-grow px-3 py-2 rounded-l-md text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors duration-300 text-sm font-semibold"
                  >
                      Đăng Ký
                  </button>
              </form>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Methods */}
        <div className="border-t border-gray-700 pt-6 mt-8 text-center md:flex md:justify-between md:items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {currentYear} {companyName}. Bảo lưu mọi quyền.
          </p>

          {/* Payment Method Icons */}
          <div className="flex justify-center space-x-3">
             {/* Sử dụng các icon từ Simple Icons (Si) */}
            <SiVisa className="text-3xl text-gray-400" title="Visa" />
            <SiMastercard className="text-3xl text-gray-400" title="Mastercard" />
            <SiPaypal className="text-3xl text-gray-400" title="PayPal" />
            {/* <SiMomo className="text-3xl text-gray-400" title="MoMo" /> */}
            {/* Thêm các icon thanh toán khác nếu cần */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
