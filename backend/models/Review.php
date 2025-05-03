<?php
require_once __DIR__ . '/../utils/Database.php'; // Sử dụng __DIR__

class Review {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = Database::getInstance(); // Sử dụng Singleton pattern nếu Database có getInstance()
        // Hoặc: $this->db = new Database(); nếu không dùng Singleton
        $this->conn = $this->db->getConnection();
    }

    /**
     * Lấy tất cả đánh giá cho một sản phẩm cụ thể, kèm thông tin người dùng.
     * @param int $productId ID của sản phẩm.
     * @param int $page Số trang hiện tại (cho phân trang).
     * @param int $perPage Số lượng đánh giá mỗi trang.
     * @return array Mảng chứa dữ liệu đánh giá và thông tin phân trang.
     */
    public function getReviewsByProductId($productId, $page = 1, $perPage = 5) {
        $offset = ($page - 1) * $perPage;

        // Truy vấn lấy đánh giá và thông tin cơ bản của người dùng
        // Sắp xếp theo ngày mới nhất trước
        $query = "SELECT r.*, u.username, u.imageurl as user_imageurl
                  FROM Reviews r
                  JOIN Users u ON r.user_id = u.user_id
                  WHERE r.product_id = ?
                  ORDER BY r.created_at DESC
                  LIMIT ? OFFSET ?";

        $stmt = $this->conn->prepare($query);
        if (!$stmt) {
             error_log("Prepare failed: (" . $this.conn->errno . ") " . $this.conn->error);
             return ['data' => [], 'pagination' => null, 'error' => 'Database prepare error'];
        }
        $stmt->bind_param("iii", $productId, $perPage, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        $reviews = [];

        while ($row = $result->fetch_assoc()) {
            // Tạo cấu trúc user lồng nhau nếu cần cho frontend
            $row['user'] = [
                'username' => $row['username'],
                'imageurl' => $row['user_imageurl']
            ];
            unset($row['username'], $row['user_imageurl']); // Xóa các trường dư thừa
            $reviews[] = $row;
        }
        $stmt->close();


        // Lấy tổng số đánh giá để phân trang
        $countQuery = "SELECT COUNT(*) as total FROM Reviews WHERE product_id = ?";
        $countStmt = $this.conn->prepare($countQuery);
         if (!$countStmt) {
             error_log("Count Prepare failed: (" . $this.conn->errno . ") " . $this.conn->error);
             return ['data' => $reviews, 'pagination' => null, 'error' => 'Database count prepare error'];
         }
        $countStmt->bind_param("i", $productId);
        $countStmt->execute();
        $countResult = $countStmt->get_result();
        $total = $countResult->fetch_assoc()['total'];
        $totalPages = ceil($total / $perPage);
        $countStmt->close();


        return [
            'data' => $reviews,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total_items' => $total,
                'total_pages' => $totalPages
            ]
        ];
    }

    /**
     * Tạo một đánh giá mới.
     * @param int $userId ID người dùng.
     * @param int $productId ID sản phẩm.
     * @param float $rating Điểm đánh giá (1-5).
     * @param string $reviewText Nội dung đánh giá.
     * @return int|false ID của đánh giá mới được tạo hoặc false nếu lỗi.
     */
    public function createReview($userId, $productId, $rating, $reviewText) {
        $query = "INSERT INTO Reviews (user_id, product_id, rating, review_text) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
         if (!$stmt) {
             error_log("Prepare failed: (" . $this.conn->errno . ") " . $this.conn->error);
             return false;
         }
        // 'iids' - integer, integer, double, string
        $stmt->bind_param("iids", $userId, $productId, $rating, $reviewText);

        if ($stmt->execute()) {
            $newReviewId = $this->conn->insert_id;
            $stmt->close();
            // Sau khi thêm thành công, cập nhật lại điểm trung bình cho sản phẩm
            $this->updateProductAverageRating($productId);
            return $newReviewId; // Trả về ID của review mới
        } else {
             error_log("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
            $stmt->close();
            return false;
        }
    }

     /**
      * Lấy thông tin chi tiết của một review dựa trên ID (bao gồm thông tin user).
      * Dùng để trả về cho frontend sau khi tạo thành công.
      * @param int $reviewId ID của review.
      * @return array|null Dữ liệu review hoặc null nếu không tìm thấy.
      */
     public function getReviewById($reviewId) {
         $query = "SELECT r.*, u.username, u.imageurl as user_imageurl
                   FROM Reviews r
                   JOIN Users u ON r.user_id = u.user_id
                   WHERE r.review_id = ?";
         $stmt = $this.conn->prepare($query);
         if (!$stmt) return null;
         $stmt->bind_param("i", $reviewId);
         $stmt->execute();
         $result = $stmt->get_result();
         $review = $result->fetch_assoc();
         $stmt->close();

         if ($review) {
             $review['user'] = [
                 'username' => $review['username'],
                 'imageurl' => $review['user_imageurl']
             ];
             unset($review['username'], $review['user_imageurl']);
             return $review;
         }
         return null;
     }


    /**
     * Tính toán và cập nhật điểm đánh giá trung bình cho một sản phẩm.
     * @param int $productId ID của sản phẩm.
     * @return bool True nếu cập nhật thành công, False nếu lỗi.
     */
    public function updateProductAverageRating($productId) {
        // Tính điểm trung bình từ bảng Reviews
        $avgQuery = "SELECT AVG(rating) as average_rating FROM Reviews WHERE product_id = ?";
        $avgStmt = $this->conn->prepare($avgQuery);
         if (!$avgStmt) return false;
        $avgStmt->bind_param("i", $productId);
        $avgStmt->execute();
        $avgResult = $avgStmt->get_result();
        $avgData = $avgResult->fetch_assoc();
        $avgStmt->close();

        $newAverageRating = round($avgData['average_rating'] ?? 0, 1); // Làm tròn 1 chữ số thập phân

        // Cập nhật vào bảng Products
        $updateQuery = "UPDATE Products SET rated_stars = ? WHERE product_id = ?";
        $updateStmt = $this->conn->prepare($updateQuery);
         if (!$updateStmt) return false;
        $updateStmt->bind_param("di", $newAverageRating, $productId); // 'd' for double
        $success = $updateStmt->execute();
        $updateStmt->close();

        return $success;
    }


    // Có thể thêm các hàm khác như updateReview, deleteReview nếu cần

    public function __destruct() {
        // Không cần đóng connection ở đây nếu dùng Singleton
        // $this->db->closeConnection();
    }
}
?>
