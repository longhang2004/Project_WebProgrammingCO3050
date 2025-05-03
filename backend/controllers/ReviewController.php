<?php
require_once __DIR__ . '/../models/Review.php';   // Sử dụng __DIR__
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php'; // Import Validator nếu cần

class ReviewController {
    private $reviewModel;
    private $response;

    public function __construct() {
        $this->reviewModel = new Review();
        $this->response = new Response();
    }

    /**
     * Lấy danh sách đánh giá cho một sản phẩm.
     * @param int $productId ID sản phẩm.
     */
    public function getReviewsForProduct($productId) {
        // Lấy tham số phân trang từ query string (ví dụ: ?page=1&per_page=5)
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;
        $perPage = isset($_GET['per_page']) && is_numeric($_GET['per_page']) ? intval($_GET['per_page']) : 5; // Mặc định 5 review/trang

        if (!is_numeric($productId) || $productId <= 0) {
             echo $this->response->error("Product ID không hợp lệ.", 400);
             return;
         }

        $result = $this->reviewModel->getReviewsByProductId(intval($productId), $page, $perPage);

        if (isset($result['error'])) {
             echo $this->response->serverError($result['error']);
        } elseif (!empty($result['data'])) {
            echo $this->response->success($result); // Trả về cả data và pagination
        } else {
            // Trả về mảng rỗng nếu không có review, không phải lỗi 404
             echo $this->response->success(['data' => [], 'pagination' => $result['pagination'] ?? null]);
            // Hoặc có thể trả về 404 nếu muốn: echo $this->response->notFound("Không tìm thấy đánh giá nào cho sản phẩm này.");
        }
    }

    /**
     * Thêm một đánh giá mới.
     */
    public function addReview() {
        // --- Xác thực người dùng ---
        // !! PHẦN NÀY CẦN HIỆN THỰC CỤ THỂ DỰA TRÊN HỆ THỐNG AUTHENTICATION CỦA BẠN (SESSION, JWT,...) !!
        // Ví dụ đơn giản (giả sử user_id có trong session hoặc token đã được giải mã)
        session_start(); // Ví dụ nếu dùng session
        if (!isset($_SESSION['user_id'])) { // Hoặc kiểm tra token
             echo $this->response->unauthorized("Vui lòng đăng nhập để gửi đánh giá.");
             return;
        }
        $userId = $_SESSION['user_id']; // Lấy user_id từ nguồn xác thực
        // --- Kết thúc phần xác thực (cần thay thế bằng logic thật) ---


        // Lấy dữ liệu từ body của request POST
        $data = json_decode(file_get_contents("php://input"), true);

        // Kiểm tra các trường bắt buộc
        if (!isset($data['product_id']) || !isset($data['rating']) || !isset($data['review_text'])) {
            echo $this->response->error("Thiếu thông tin đánh giá (product_id, rating, review_text).", 400);
            return;
        }

        // Validate dữ liệu
        $productId = filter_var($data['product_id'], FILTER_VALIDATE_INT);
        $rating = filter_var($data['rating'], FILTER_VALIDATE_FLOAT); // Rating có thể là float
        $reviewText = trim($data['review_text']); // Loại bỏ khoảng trắng thừa

        if ($productId === false || $productId <= 0) {
             echo $this->response->error("Product ID không hợp lệ.", 400);
             return;
         }
         if ($rating === false || $rating < 1 || $rating > 5) {
             echo $this->response->error("Điểm đánh giá phải từ 1 đến 5.", 400);
             return;
         }
         if (empty($reviewText)) {
             echo $this->response->error("Nội dung đánh giá không được để trống.", 400);
             return;
         }
         // Có thể thêm validation độ dài tối đa cho reviewText

        // Gọi model để tạo review
        $newReviewId = $this->reviewModel->createReview($userId, $productId, $rating, $reviewText);

        if ($newReviewId) {
             // Lấy lại thông tin review vừa tạo để trả về cho frontend
             $createdReview = $this.reviewModel->getReviewById($newReviewId);
             if ($createdReview) {
                 echo $this->response->success(['message' => 'Gửi đánh giá thành công!', 'review' => $createdReview], 201); // HTTP 201 Created
             } else {
                  // Vẫn thành công nhưng không lấy lại được review?
                  echo $this->response->success(['message' => 'Gửi đánh giá thành công!', 'review_id' => $newReviewId], 201);
             }
        } else {
            echo $this->response->serverError("Không thể lưu đánh giá vào cơ sở dữ liệu.");
        }
    }

    // Thêm các hàm khác nếu cần (update, delete)
}
?>
