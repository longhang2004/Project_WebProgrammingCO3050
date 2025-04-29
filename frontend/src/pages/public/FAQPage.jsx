import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi'; // Import icons

// Dữ liệu giả - thêm category và nhiều câu hỏi hơn
const mockFaqs = [
    // Danh mục: Đặt hàng & Thanh toán
    {
        qna_id: 1,
        category: 'Đặt hàng & Thanh toán',
        question: 'Làm thế nào để đặt hàng trên website?',
        answer: 'Để đặt hàng, bạn chỉ cần chọn sản phẩm mong muốn, thêm vào giỏ hàng và tiến hành các bước thanh toán theo hướng dẫn. Bạn có thể chọn thanh toán khi nhận hàng (COD) hoặc thanh toán trực tuyến qua thẻ/ví điện tử.'
    },
    {
        qna_id: 2,
        category: 'Đặt hàng & Thanh toán',
        question: 'Tôi có thể hủy đơn hàng đã đặt không?',
        answer: 'Bạn có thể hủy đơn hàng nếu đơn hàng chưa được chuyển sang trạng thái "Đang giao hàng". Vui lòng truy cập mục "Đơn hàng của tôi" hoặc liên hệ bộ phận hỗ trợ khách hàng để được trợ giúp.'
    },
    {
        qna_id: 7,
        category: 'Đặt hàng & Thanh toán',
        question: 'Có những phương thức thanh toán nào được chấp nhận?',
        answer: 'Chúng tôi chấp nhận thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB) và các ví điện tử phổ biến như Momo, ZaloPay.'
    },
    // Danh mục: Giao hàng & Vận chuyển
    {
        qna_id: 3,
        category: 'Giao hàng & Vận chuyển',
        question: 'Thời gian giao hàng dự kiến là bao lâu?',
        answer: 'Thời gian giao hàng thường từ 2-5 ngày làm việc tùy thuộc vào địa chỉ nhận hàng của bạn. Các khu vực nội thành thường nhận hàng nhanh hơn.'
    },
    {
        qna_id: 4,
        category: 'Giao hàng & Vận chuyển',
        question: 'Phí vận chuyển được tính như thế nào?',
        answer: 'Phí vận chuyển phụ thuộc vào trọng lượng đơn hàng và địa chỉ giao hàng. Chúng tôi thường có các chương trình miễn phí vận chuyển cho đơn hàng đạt giá trị tối thiểu. Chi tiết phí sẽ hiển thị ở bước thanh toán.'
    },
     {
        qna_id: 8,
        category: 'Giao hàng & Vận chuyển',
        question: 'Làm sao để theo dõi tình trạng đơn hàng?',
        answer: 'Sau khi đặt hàng thành công, bạn sẽ nhận được email xác nhận kèm mã vận đơn (nếu có). Bạn có thể dùng mã này để tra cứu trên website của đơn vị vận chuyển hoặc kiểm tra trong mục "Đơn hàng của tôi" trên website của chúng tôi.'
    },
    // Danh mục: Bảo hành & Đổi trả
    {
        qna_id: 5,
        category: 'Bảo hành & Đổi trả',
        question: 'Chính sách bảo hành sản phẩm như thế nào?',
        answer: 'Hầu hết các sản phẩm điện tử được bảo hành chính hãng từ 12 đến 24 tháng (tùy sản phẩm). Thông tin bảo hành chi tiết được ghi rõ trên trang sản phẩm và phiếu bảo hành đi kèm.'
    },
    {
        qna_id: 6,
        category: 'Bảo hành & Đổi trả',
        question: 'Tôi có thể đổi trả sản phẩm nếu không hài lòng?',
        answer: 'Chúng tôi có chính sách đổi trả trong vòng 7 ngày nếu sản phẩm bị lỗi kỹ thuật từ nhà sản xuất hoặc không đúng như mô tả. Vui lòng giữ nguyên tem, hộp và phụ kiện. Chi tiết xem tại trang Chính sách Đổi trả.'
    },
    // Thêm các câu hỏi khác nếu cần
];

// Helper function để nhóm FAQs theo category
const groupFaqsByCategory = (faqs) => {
    return faqs.reduce((acc, faq) => {
        const category = faq.category || 'Khác'; // Nhóm vào 'Khác' nếu không có category
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(faq);
        return acc;
    }, {});
};

function FAQPage() {
    const [allFaqs, setAllFaqs] = useState([]); // Lưu trữ tất cả FAQs từ API/mock
    const [filteredFaqs, setFilteredFaqs] = useState([]); // FAQs sau khi lọc
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState(null); // Quản lý accordion cho từng câu hỏi
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Giả lập fetch dữ liệu
        setTimeout(() => {
            setAllFaqs(mockFaqs);
            setFilteredFaqs(mockFaqs); // Ban đầu hiển thị tất cả
            setLoading(false);
        }, 500);

        // *** CODE GỌI API THỰC TẾ (SỬ DỤNG SAU) ***
        /*
        fetch('http://localhost/Project_WebProgrammingCO3050/backend/api/qna')
            .then(response => response.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    // Giả sử API trả về có trường 'category'
                    setAllFaqs(data.data);
                    setFilteredFaqs(data.data);
                } else {
                    console.error("Lỗi khi lấy FAQ:", data.message || 'Dữ liệu không hợp lệ');
                    setAllFaqs(mockFaqs); // Fallback về mock data
                    setFilteredFaqs(mockFaqs);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Lỗi fetch FAQ:', error);
                setAllFaqs(mockFaqs); // Fallback về mock data
                setFilteredFaqs(mockFaqs);
                setLoading(false);
            });
        */
    }, []);

    // Lọc FAQs khi searchTerm thay đổi
    useEffect(() => {
        if (!searchTerm) {
            setFilteredFaqs(allFaqs);
        } else {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const results = allFaqs.filter(faq =>
                faq.question.toLowerCase().includes(lowerCaseSearchTerm) ||
                faq.answer.toLowerCase().includes(lowerCaseSearchTerm) ||
                (faq.category && faq.category.toLowerCase().includes(lowerCaseSearchTerm))
            );
            setFilteredFaqs(results);
        }
        setOpenIndex(null); // Đóng tất cả accordion khi tìm kiếm
    }, [searchTerm, allFaqs]);

    const toggleAccordion = (qnaId) => { // Sử dụng qnaId để đảm bảo tính duy nhất
        setOpenIndex(openIndex === qnaId ? null : qnaId);
    };

    const groupedFaqs = groupFaqsByCategory(filteredFaqs);

    return (
        // Nền có thể thay đổi màu hoặc thêm ảnh/gradient nhẹ
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 py-12">
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
                {/* Tiêu đề và giới thiệu */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 md:mb-8 leading-relaxed">
                        Câu Hỏi Thường Gặp (FAQ)
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Tìm kiếm câu trả lời cho các thắc mắc phổ biến về sản phẩm, đặt hàng, giao hàng và chính sách của chúng tôi.
                    </p>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="mb-10 max-w-xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm câu hỏi hoặc từ khóa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                    </div>
                </div>

                {/* Danh sách FAQ */}
                <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg">
                    {loading ? (
                        <p className="text-center py-10 text-gray-500 dark:text-gray-400">Đang tải câu hỏi...</p>
                    ) : Object.keys(groupedFaqs).length > 0 ? (
                        Object.entries(groupedFaqs).map(([category, faqsInCategory]) => (
                            <div key={category} className="mb-8 last:mb-0">
                                <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-400 mb-5 pb-2 border-b border-gray-200 dark:border-gray-700">
                                    {category}
                                </h2>
                                {faqsInCategory.map((faq) => (
                                    <div key={faq.qna_id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 py-3">
                                        <button
                                            onClick={() => toggleAccordion(faq.qna_id)}
                                            className="flex justify-between items-center w-full text-left py-2 group"
                                            aria-expanded={openIndex === faq.qna_id}
                                            aria-controls={`faq-answer-${faq.qna_id}`}
                                        >
                                            <span className="text-lg font-medium text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                                                {faq.question}
                                            </span>
                                            <span className="text-indigo-600 dark:text-indigo-400 ml-4 flex-shrink-0">
                                                {openIndex === faq.qna_id ? (
                                                    <FiChevronUp className="w-5 h-5 transition-transform duration-300" />
                                                ) : (
                                                    <FiChevronDown className="w-5 h-5 transition-transform duration-300" />
                                                )}
                                            </span>
                                        </button>
                                        {/* Nội dung câu trả lời - dùng CSS transition */}
                                        <div
                                            id={`faq-answer-${faq.qna_id}`}
                                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                                openIndex === faq.qna_id ? 'max-h-[500px] opacity-100 pt-3' : 'max-h-0 opacity-0' // Tăng max-h nếu nội dung dài
                                            }`}
                                        >
                                            <p className="text-gray-600 dark:text-gray-300 pl-4 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-10 text-gray-500 dark:text-gray-400">
                            {searchTerm ? 'Không tìm thấy câu hỏi nào phù hợp.' : 'Hiện chưa có câu hỏi nào.'}
                        </p>
                    )}
                </div>

                 {/* Phần kết luận / CTA */}
                 <div className="text-center mt-12">
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                        Không tìm thấy câu trả lời bạn cần?
                    </p>
                    <a
                        href="/contact" // Thay bằng link trang liên hệ của bạn
                        className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200"
                    >
                        Liên Hệ Với Chúng Tôi
                    </a>
                </div>

            </div>
        </div>
    );
}

export default FAQPage;