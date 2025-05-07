<?php
// File: backend/controllers/ReviewController.php

require_once __DIR__ . '/../models/Review.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/JwtHelper.php';

class ReviewController {
    private $reviewModel;
    private $response;

    public function __construct() {
        try {
            $this->reviewModel = new Review();
            $this->response = new Response();
        } catch (Exception $e) {
            error_log("Failed to instantiate ReviewController: " . $e->getMessage());
            if (!isset($this->response)) {
                 $this->response = new Response();
            }
        }
    }

    // --- Helper function to get authenticated user ID from token ---
    private function getAuthenticatedUserId(): ?int {
        $authHeader = null;
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (function_exists('getallheaders')) {
            $allHeaders = getallheaders();
            $authHeaderKey = array_keys(array_change_key_case($allHeaders, CASE_LOWER), 'authorization')[0] ?? null;
             if ($authHeaderKey !== null && isset($allHeaders[$authHeaderKey])) {
                $authHeader = $allHeaders[$authHeaderKey];
            }
        }

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/i', $authHeader, $matches)) {
            return null; // No token found or invalid format
        }
        $token = $matches[1];

        $decodedPayload = JwtHelper::verifyJwt($token);
        if (!$decodedPayload) {
            return null; // Token invalid or expired
        }

        return $decodedPayload['user_id'] ?? null;
    }

    // --- getReviewsForProduct() giữ nguyên ---
    public function getReviewsForProduct($productId) {
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;
        $perPage = isset($_GET['per_page']) && is_numeric($_GET['per_page']) ? intval($_GET['per_page']) : 5;
        if (!is_numeric($productId) || $productId <= 0) { echo $this->response->error("Product ID không hợp lệ.", 400); return; }
        try { $result = $this->reviewModel->getReviewsByProductId(intval($productId), $page, $perPage); echo $this->response->success($result); }
        catch (Exception $e) { error_log("Error in getReviewsForProduct Controller: " . $e->getMessage()); echo $this->response->serverError("Không thể lấy danh sách đánh giá."); }
    }


    public function addReview() {
        // Get authenticated user ID
        $userId = $this->getAuthenticatedUserId();
        if ($userId === null) {
            // Throw 401 if not authenticated
            throw new Exception("Yêu cầu xác thực.", 401);
        }

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            if (json_last_error() !== JSON_ERROR_NONE) { throw new Exception("Dữ liệu JSON không hợp lệ.", 400); }
            $requiredFields = ['product_id', 'rating', 'review_text'];
            foreach ($requiredFields as $field) { if (!isset($data[$field])) { throw new Exception("Thiếu trường bắt buộc: " . $field, 400); } }

            $productId = filter_var($data['product_id'], FILTER_VALIDATE_INT);
            $rating = filter_var($data['rating'], FILTER_VALIDATE_FLOAT);
            $reviewText = trim($data['review_text']);

            if ($productId === false || $productId <= 0) { throw new Exception("Product ID không hợp lệ.", 400); }
            if ($rating === false || $rating < 1 || $rating > 5) { throw new Exception("Điểm đánh giá phải từ 1 đến 5.", 400); }
            if (empty($reviewText)) { throw new Exception("Nội dung đánh giá không được để trống.", 400); }

            // Call model to create review (Model now checks for duplicates)
            $newReviewId = $this->reviewModel->createReview($userId, $productId, $rating, $reviewText);

            $createdReview = $this->reviewModel->getReviewById($newReviewId);

            if ($createdReview) {
                echo $this->response->success(['message' => 'Gửi đánh giá thành công!', 'review' => $createdReview], 201);
            } else {
                 error_log("Could not fetch review details after creation for ID: " . $newReviewId);
                 echo $this->response->success(['message' => 'Gửi đánh giá thành công!', 'review_id' => $newReviewId], 201);
            }

        } catch (Exception $e) {
             error_log("Add Review Controller Error: " . $e->getMessage());
             // Check for specific error codes (e.g., 409 from model)
             $statusCode = ($e->getCode() >= 400 && $e->getCode() < 500) ? $e->getCode() : 500;
             $errorMessage = ($statusCode === 500) ? "Không thể lưu đánh giá do lỗi hệ thống." : $e->getMessage();
             // Rethrow to be caught by the main API error handler
             throw new Exception($errorMessage, $statusCode);
        }
    }

    /**
     * Cập nhật một đánh giá hiện có.
     * @param int $reviewId ID của đánh giá từ URL.
     */
    public function updateReview(int $reviewId) {
        // Get authenticated user ID
        $userId = $this->getAuthenticatedUserId();
        if ($userId === null) {
            throw new Exception("Yêu cầu xác thực.", 401);
        }

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            if (json_last_error() !== JSON_ERROR_NONE) { throw new Exception("Dữ liệu JSON không hợp lệ.", 400); }

            // Validate required fields for update
            $requiredFields = ['rating', 'review_text'];
            foreach ($requiredFields as $field) { if (!isset($data[$field])) { throw new Exception("Thiếu trường bắt buộc: " . $field, 400); } }

            $rating = filter_var($data['rating'], FILTER_VALIDATE_FLOAT);
            $reviewText = trim($data['review_text']);

            // Validate data
            if ($rating === false || $rating < 1 || $rating > 5) { throw new Exception("Điểm đánh giá phải từ 1 đến 5.", 400); }
            if (empty($reviewText)) { throw new Exception("Nội dung đánh giá không được để trống.", 400); }

            // Call model to update the review
            $success = $this->reviewModel->updateReview($reviewId, $userId, $rating, $reviewText);

            if ($success) {
                // Fetch the updated review to return
                $updatedReview = $this->reviewModel->getReviewById($reviewId);
                echo $this->response->success(['message' => 'Cập nhật đánh giá thành công!', 'review' => $updatedReview]);
            } else {
                // Review not found or user doesn't own it
                throw new Exception("Không tìm thấy đánh giá hoặc bạn không có quyền sửa.", 404); // Or 403 Forbidden
            }

        } catch (Exception $e) {
            error_log("Update Review Controller Error: " . $e->getMessage());
            $statusCode = ($e->getCode() >= 400 && $e->getCode() < 500) ? $e->getCode() : 500;
            $errorMessage = ($statusCode === 500) ? "Không thể cập nhật đánh giá do lỗi hệ thống." : $e->getMessage();
            throw new Exception($errorMessage, $statusCode);
        }
    }

    /**
     * Xóa một đánh giá.
     * @param int $reviewId ID của đánh giá từ URL.
     */
    public function deleteReview(int $reviewId) {
        // Get authenticated user ID
        $userId = $this->getAuthenticatedUserId();
        if ($userId === null) {
            throw new Exception("Yêu cầu xác thực.", 401);
        }

        try {
            // Call model to delete the review
            $success = $this->reviewModel->deleteReview($reviewId, $userId);

            if ($success) {
                // Use 200 OK or 204 No Content for successful deletion
                echo $this->response->success(['message' => 'Xóa đánh giá thành công!']);
            } else {
                // Review not found or user doesn't own it
                throw new Exception("Không tìm thấy đánh giá hoặc bạn không có quyền xóa.", 404); // Or 403 Forbidden
            }

        } catch (Exception $e) {
            error_log("Delete Review Controller Error: " . $e->getMessage());
            $statusCode = ($e->getCode() >= 400 && $e->getCode() < 500) ? $e->getCode() : 500;
            $errorMessage = ($statusCode === 500) ? "Không thể xóa đánh giá do lỗi hệ thống." : $e->getMessage();
            throw new Exception($errorMessage, $statusCode);
        }
    }

}
?>
