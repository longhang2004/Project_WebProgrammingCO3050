import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState({
        submitting: false,
        success: false,
        error: false,
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ submitting: true, success: false, error: false, message: '' });

        // --- GIẢ LẬP GỬI API ---
        // Trong ứng dụng thực tế, bạn sẽ gọi API backend tại đây
        console.log("Sending data:", formData);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Giả lập độ trễ mạng

        // Giả lập kết quả trả về (thay đổi để test các trường hợp)
        const successResponse = true; // Đổi thành false để test lỗi

        if (successResponse) {
            setStatus({ submitting: false, success: true, error: false, message: 'Cảm ơn bạn! Tin nhắn đã được gửi thành công.' });
            setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
        } else {
            setStatus({ submitting: false, success: false, error: true, message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' });
        }
        // Tự động ẩn thông báo sau vài giây
        setTimeout(() => setStatus(prev => ({ ...prev, message: ''})), 5000);
        // --- KẾT THÚC GIẢ LẬP ---
    };

    // Lấy thời gian hiện tại để hiển thị giờ mở cửa động (ví dụ)
    const isCurrentlyOpen = () => {
        // Logic kiểm tra giờ mở cửa thực tế sẽ phức tạp hơn
        // Đây chỉ là ví dụ đơn giản: Mở cửa từ 8h sáng đến 9h tối, T2-T7
        const now = new Date();
        const day = now.getDay(); // 0 = CN, 1 = T2, ..., 6 = T7
        const hour = now.getHours();
        return day >= 1 && day <= 6 && hour >= 8 && hour < 21;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
                {/* --- Tiêu đề --- */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4 leading-relaxed">
                        Liên Hệ Với Chúng Tôi
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn lòng lắng nghe! Gửi thắc mắc hoặc phản hồi của bạn qua form bên dưới hoặc liên hệ trực tiếp.
                    </p>
                </div>

                {/* --- Nội dung chính: Grid 2 cột --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* --- Cột trái: Thông tin liên hệ --- */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-semibold text-white mb-6">Thông Tin Liên Hệ</h2>

                        <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <FiMapPin className="w-6 h-6 text-indigo-400 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-medium text-white">Địa chỉ</h3>
                                {/* Nhớ thay địa chỉ thực tế */}
                                <p className="text-gray-400">123 Đường Nguyễn Tất Thành, P. Tân Lợi,</p>
                                <p className="text-gray-400">TP. Buôn Ma Thuột, Đắk Lắk, Việt Nam</p>
                                {/* Có thể thêm link Google Maps */}
                                <a href="#" className="text-indigo-400 hover:text-indigo-300 text-sm mt-1 inline-block">Xem bản đồ</a>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <FiPhone className="w-6 h-6 text-indigo-400 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-medium text-white">Điện thoại</h3>
                                <a href="tel:+84123456789" className="text-gray-400 hover:text-gray-200 transition-colors">
                                    (+84) 123 456 789 {/* Thay số điện thoại */}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <FiMail className="w-6 h-6 text-indigo-400 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-medium text-white">Email</h3>
                                <a href="mailto:support@tencongty.com" className="text-gray-400 hover:text-gray-200 transition-colors">
                                    support@tencongty.com {/* Thay email */}
                                </a>
                            </div>
                        </div>

                         <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <FiClock className="w-6 h-6 text-indigo-400 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-medium text-white">Giờ làm việc</h3>
                                <p className="text-gray-400">Thứ 2 - Thứ 7: 08:00 - 21:00</p>
                                <p className="text-gray-400">Chủ Nhật: Nghỉ</p>
                                <span className={`mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium ${isCurrentlyOpen() ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                    {isCurrentlyOpen() ? 'Đang mở cửa' : 'Đã đóng cửa'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* --- Cột phải: Form liên hệ --- */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
                        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Gửi Tin Nhắn Cho Chúng Tôi</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">Họ và Tên</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150"
                                    placeholder="Nhập họ tên của bạn"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">Địa chỉ Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">Chủ đề</label>
                                <input
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150"
                                    placeholder="Vấn đề bạn quan tâm"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">Nội dung tin nhắn</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150 resize-none"
                                    placeholder="Viết nội dung chi tiết tại đây..."
                                ></textarea>
                            </div>

                            {/* --- Nút Submit & Trạng thái --- */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={status.submitting}
                                    className={`inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                                        status.submitting
                                            ? 'bg-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                                    }`}
                                >
                                    {status.submitting ? (
                                        <>
                                            <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            Gửi Tin Nhắn <FiSend className="ml-2 -mr-1 h-5 w-5" />
                                        </>
                                    )}
                                </button>

                                {/* Thông báo trạng thái */}
                                {status.message && (
                                    <div className={`flex items-center text-sm ${status.success ? 'text-green-400' : ''} ${status.error ? 'text-red-400' : ''}`}>
                                        {status.success && <FiCheckCircle className="w-5 h-5 mr-2" />}
                                        {status.error && <FiAlertCircle className="w-5 h-5 mr-2" />}
                                        {status.message}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;