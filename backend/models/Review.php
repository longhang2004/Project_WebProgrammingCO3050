<?php
// File: backend/models/Review.php

require_once __DIR__ . '/../utils/Database.php';

class Review {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = Database::getInstance();
        $this->conn = $this->db->getConnection();
        if ($this->conn === null || $this->conn->connect_error) {
             throw new Exception("Database connection failed in Review model: " . ($this->conn ? $this->conn->connect_error : 'Connection object is null'));
        }
    }

    /**
     * Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa.
     * @param int $userId ID người dùng.
     * @param int $productId ID sản phẩm.
     * @return bool True nếu đã đánh giá, False nếu chưa.
     * @throws Exception Nếu có lỗi database.
     */
    private function hasUserReviewedProduct(int $userId, int $productId): bool {
        try {
            $query = "SELECT COUNT(*) as count FROM Reviews WHERE user_id = ? AND product_id = ?";
            $stmt = $this->conn->prepare($query);
            if ($stmt === false) {
                throw new Exception("Prepare failed (check review exists): (" . $this->conn->errno . ") " . $this->conn->error);
            }
            $stmt->bind_param("ii", $userId, $productId);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stmt->close();
            return ($row && $row['count'] > 0);
        } catch (Exception $e) {
            error_log("Database error in hasUserReviewedProduct: " . $e->getMessage());
            throw new Exception("Could not check existing review due to a database error.");
        }
    }


    /**
     * Lấy tất cả đánh giá cho một sản phẩm cụ thể, kèm thông tin người dùng.
     * @param int $productId ID của sản phẩm.
     * @param int $page Số trang hiện tại (cho phân trang).
     * @param int $perPage Số lượng đánh giá mỗi trang.
     * @return array Mảng chứa dữ liệu đánh giá và thông tin phân trang.
     * @throws Exception Nếu có lỗi database.
     */
    public function getReviewsByProductId($productId, $page = 1, $perPage = 5) {
        $offset = ($page - 1) * $perPage;
        $reviews = [];
        $total = 0;
        $totalPages = 0;

        try {
            // Truy vấn lấy đánh giá và thông tin cơ bản của người dùng
            $query = "SELECT r.*, u.username, u.imageurl as user_imageurl
                      FROM Reviews r
                      JOIN Users u ON r.user_id = u.user_id
                      WHERE r.product_id = ?
                      ORDER BY r.created_at DESC
                      LIMIT ? OFFSET ?";

            $stmt = $this->conn->prepare($query);
            if ($stmt === false) {
                throw new Exception("Prepare failed (get reviews): (" . $this->conn->errno . ") " . $this->conn->error);
            }
            $stmt->bind_param("iii", $productId, $perPage, $offset);
            $stmt->execute();
            $result = $stmt->get_result();

            while ($row = $result->fetch_assoc()) {
                // Chuyển đổi kiểu dữ liệu nếu cần
                $row['review_id'] = (int)$row['review_id'];
                $row['user_id'] = (int)$row['user_id'];
                $row['product_id'] = (int)$row['product_id'];
                $row['rating'] = (float)$row['rating'];
                // Tạo object user lồng nhau
                $row['user'] = [
                    'username' => $row['username'],
                    'imageurl' => $row['user_imageurl']
                ];
                unset($row['username'], $row['user_imageurl']); // Xóa các trường gốc không cần thiết
                $reviews[] = $row;
            }
            $stmt->close();

            // Lấy tổng số đánh giá để phân trang
            $countQuery = "SELECT COUNT(*) as total FROM Reviews WHERE product_id = ?";
            $countStmt = $this->conn->prepare($countQuery);
            if ($countStmt === false) {
                throw new Exception("Prepare failed (count reviews): (" . $this->conn->errno . ") " . $this->conn->error);
            }
            $countStmt->bind_param("i", $productId);
            $countStmt->execute();
            $countResult = $countStmt->get_result();
            $totalRow = $countResult->fetch_assoc();
            $total = $totalRow ? (int)$totalRow['total'] : 0;
            $totalPages = $perPage > 0 ? ceil($total / $perPage) : 0;
            $countStmt->close();

        } catch (Exception $e) {
             error_log("Database error in getReviewsByProductId: " . $e->getMessage());
             throw new Exception("Could not retrieve reviews due to a database error.");
        }

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
     * @return int ID của đánh giá mới được tạo.
     * @throws Exception Nếu người dùng đã đánh giá sản phẩm này, hoặc có lỗi database.
     */
    public function createReview($userId, $productId, $rating, $reviewText) {
        // *** ADDED: Check if user already reviewed this product ***
        if ($this->hasUserReviewedProduct($userId, $productId)) {
            // Throw a specific exception with a code (e.g., 409 Conflict)
            throw new Exception("Bạn đã đánh giá sản phẩm này rồi.", 409);
        }

        try {
            $query = "INSERT INTO Reviews (user_id, product_id, rating, review_text) VALUES (?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            if ($stmt === false) {
                throw new Exception("Prepare failed (create review): (" . $this->conn->errno . ") " . $this->conn->error);
            }
            // 'd' for double (rating), 'i' for integer, 's' for string
            $stmt->bind_param("iids", $userId, $productId, $rating, $reviewText);

            if (!$stmt->execute()) {
                 $error = $stmt->error;
                 $errno = $this->conn->errno;
                 $stmt->close();
                 // Check for unique constraint violation (user_id, product_id) if defined in DB
                 if ($errno == 1062) {
                      throw new Exception("Bạn đã đánh giá sản phẩm này rồi (DB constraint).", 409);
                 }
                 throw new Exception("Execute failed (create review): " . $error);
            }
            $newReviewId = $this->conn->insert_id;
            $stmt->close();

            // Cập nhật lại điểm trung bình cho sản phẩm
            $this->updateProductAverageRating($productId);

            return $newReviewId;

        } catch (Exception $e) {
             error_log("Database error in createReview: " . $e->getMessage());
             // Re-throw the exception to be handled by the controller
             throw $e;
        }
    }

     /**
      * Lấy thông tin chi tiết của một review dựa trên ID (bao gồm thông tin user).
      * @param int $reviewId ID của review.
      * @return array|null Dữ liệu review hoặc null nếu không tìm thấy hoặc lỗi.
      */
     public function getReviewById($reviewId) {
          try {
             $query = "SELECT r.*, u.username, u.imageurl as user_imageurl
                       FROM Reviews r
                       JOIN Users u ON r.user_id = u.user_id
                       WHERE r.review_id = ?";
             $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                  throw new Exception("Prepare failed (get review by id): (" . $this->conn->errno . ") " . $this->conn->error);
             }
             $stmt->bind_param("i", $reviewId);
             $stmt->execute();
             $result = $stmt->get_result();
             $review = $result->fetch_assoc();
             $stmt->close();

             if ($review) {
                 // Chuyển đổi kiểu dữ liệu
                 $review['review_id'] = (int)$review['review_id'];
                 $review['user_id'] = (int)$review['user_id'];
                 $review['product_id'] = (int)$review['product_id'];
                 $review['rating'] = (float)$review['rating'];
                 // Tạo object user
                 $review['user'] = [
                     'username' => $review['username'],
                     'imageurl' => $review['user_imageurl']
                 ];
                 unset($review['username'], $review['user_imageurl']);
                 return $review;
             }
             return null; // Không tìm thấy

          } catch (Exception $e) {
              error_log("Database error in getReviewById: " . $e->getMessage());
              return null; // Trả về null nếu có lỗi
          }
     }

    /**
     * Cập nhật một đánh giá hiện có.
     * @param int $reviewId ID của đánh giá cần cập nhật.
     * @param int $userId ID của người dùng thực hiện cập nhật (phải khớp với tác giả).
     * @param float $rating Điểm đánh giá mới.
     * @param string $reviewText Nội dung đánh giá mới.
     * @return bool True nếu cập nhật thành công, False nếu không tìm thấy review hoặc không đúng tác giả.
     * @throws Exception Nếu có lỗi database.
     */
    public function updateReview(int $reviewId, int $userId, float $rating, string $reviewText): bool {
        try {
            // Cập nhật chỉ khi review_id và user_id khớp
            $query = "UPDATE Reviews SET rating = ?, review_text = ?, created_at = CURRENT_TIMESTAMP
                      WHERE review_id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            if ($stmt === false) {
                throw new Exception("Prepare failed (update review): (" . $this->conn->errno . ") " . $this->conn->error);
            }
            $stmt->bind_param("dsii", $rating, $reviewText, $reviewId, $userId);

            $success = $stmt->execute();
            if (!$success) {
                $error = $stmt->error;
                $stmt->close();
                throw new Exception("Execute failed (update review): " . $error);
            }

            $affectedRows = $stmt->affected_rows;
            $stmt->close();

            if ($affectedRows > 0) {
                // Lấy product_id để cập nhật điểm trung bình
                $productId = $this->getProductIdByReviewId($reviewId);
                if ($productId) {
                    $this->updateProductAverageRating($productId);
                }
                return true; // Cập nhật thành công
            } else {
                // Không có hàng nào được cập nhật (có thể do sai reviewId hoặc userId)
                return false;
            }

        } catch (Exception $e) {
            error_log("Database error in updateReview: " . $e->getMessage());
            throw new Exception("Could not update review due to a database error.");
        }
    }

    /**
     * Xóa một đánh giá.
     * @param int $reviewId ID của đánh giá cần xóa.
     * @param int $userId ID của người dùng thực hiện xóa (phải khớp với tác giả).
     * @return bool True nếu xóa thành công, False nếu không tìm thấy review hoặc không đúng tác giả.
     * @throws Exception Nếu có lỗi database.
     */
    public function deleteReview(int $reviewId, int $userId): bool {
        // Lấy product_id trước khi xóa để cập nhật điểm trung bình
        $productId = $this->getProductIdByReviewId($reviewId);

        try {
            // Xóa chỉ khi review_id và user_id khớp
            $query = "DELETE FROM Reviews WHERE review_id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            if ($stmt === false) {
                throw new Exception("Prepare failed (delete review): (" . $this->conn->errno . ") " . $this->conn->error);
            }
            $stmt->bind_param("ii", $reviewId, $userId);

            $success = $stmt->execute();
            if (!$success) {
                $error = $stmt->error;
                $stmt->close();
                throw new Exception("Execute failed (delete review): " . $error);
            }

            $affectedRows = $stmt->affected_rows;
            $stmt->close();

            if ($affectedRows > 0 && $productId) {
                // Cập nhật lại điểm trung bình sau khi xóa
                $this->updateProductAverageRating($productId);
                return true; // Xóa thành công
            } elseif ($affectedRows > 0 && !$productId) {
                 error_log("Review deleted (ID: {$reviewId}), but failed to get product ID for rating update.");
                 return true; // Vẫn coi là xóa thành công
            }
            else {
                // Không có hàng nào bị xóa (sai reviewId hoặc userId)
                return false;
            }

        } catch (Exception $e) {
            error_log("Database error in deleteReview: " . $e->getMessage());
            throw new Exception("Could not delete review due to a database error.");
        }
    }

    /**
     * Lấy product_id từ review_id.
     * @param int $reviewId ID của review.
     * @return int|null Product ID hoặc null nếu không tìm thấy.
     */
    private function getProductIdByReviewId(int $reviewId): ?int {
        try {
            $query = "SELECT product_id FROM Reviews WHERE review_id = ?";
            $stmt = $this->conn->prepare($query);
            if ($stmt === false) {
                throw new Exception("Prepare failed (get product id by review id): (" . $this->conn->errno . ") " . $this->conn->error);
            }
            $stmt->bind_param("i", $reviewId);
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stmt->close();
            return $row ? (int)$row['product_id'] : null;
        } catch (Exception $e) {
            error_log("Database error in getProductIdByReviewId: " . $e->getMessage());
            return null;
        }
    }


    /**
     * Tính toán và cập nhật điểm đánh giá trung bình cho một sản phẩm.
     * @param int $productId ID của sản phẩm.
     * @return bool True nếu cập nhật thành công, False nếu lỗi.
     * @throws Exception Nếu có lỗi database.
     */
    public function updateProductAverageRating($productId) {
         try {
             // Tính điểm trung bình từ bảng Reviews
             $avgQuery = "SELECT AVG(rating) as average_rating FROM Reviews WHERE product_id = ?";
             $avgStmt = $this->conn->prepare($avgQuery);
             if ($avgStmt === false) {
                  throw new Exception("Prepare failed (avg rating): (" . $this->conn->errno . ") " . $this->conn->error);
             }
             $avgStmt->bind_param("i", $productId);
             $avgStmt->execute();
             $avgResult = $avgStmt->get_result();
             $avgData = $avgResult->fetch_assoc();
             $avgStmt->close();

             // Nếu không còn review nào, đặt điểm là 0 hoặc null tùy logic
             $newAverageRating = $avgData['average_rating'] !== null ? round($avgData['average_rating'], 1) : 0.0;

             // Cập nhật vào bảng Products
             $updateQuery = "UPDATE Products SET rated_stars = ? WHERE product_id = ?";
             $updateStmt = $this->conn->prepare($updateQuery);
             if ($updateStmt === false) {
                  throw new Exception("Prepare failed (update product rating): (" . $this->conn->errno . ") " . $this->conn->error);
             }
             $updateStmt->bind_param("di", $newAverageRating, $productId);
             $success = $updateStmt->execute();
             $updateStmt->close();

             if (!$success) {
                  throw new Exception("Execute failed (update product rating): " . $this->conn->error);
             }
             return true;

         } catch (Exception $e) {
              error_log("Database error in updateProductAverageRating for product {$productId}: " . $e->getMessage());
              // Không ném lại lỗi ở đây để việc tạo/sửa/xóa review vẫn thành công ngay cả khi cập nhật điểm lỗi
              return false;
         }
    }

}
?>
