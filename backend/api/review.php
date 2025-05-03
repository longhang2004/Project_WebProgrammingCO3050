<?php
// --- Headers cho request THỰC TẾ (POST, GET,...) ---
// Lưu ý: Những header này có thể không được gửi nếu script exit sớm (ví dụ: trong xử lý OPTIONS)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true'); // Quan trọng cho request thực tế
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');


// --- Xử lý RIÊNG biệt cho request OPTIONS (Preflight) ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Gửi các header CẦN THIẾT cho preflight response
    // Đảm bảo không có output nào khác trước các header này
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Credentials: true'); // PHẢI là 'true' dạng chuỗi
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Content-Length: 0'); // Một số trình duyệt cần content-length cho 200/204
    http_response_code(200); // Hoặc 204 No Content cũng được chấp nhận
    // Dừng script NGAY LẬP TỨC sau khi gửi header cho OPTIONS
    exit();
}

// --- Chỉ thực thi phần còn lại nếu KHÔNG phải là OPTIONS request ---

// Khởi tạo Session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Dependencies
require_once __DIR__ . '/../controllers/ReviewController.php';
require_once __DIR__ . '/../utils/Response.php';

// Instantiate Controller and Response
try {
    $controller = new ReviewController();
    $response = new Response();
} catch (Throwable $e) {
    http_response_code(500);
    // Trả về lỗi JSON nếu khởi tạo thất bại
    // Đặt Content-Type lại phòng trường hợp header bị ghi đè
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Failed to initialize review API components.',
        'error' => $e->getMessage() // Consider hiding details in production
    ]);
    exit();
}

// Routing within the Review API
$request_method = $_SERVER['REQUEST_METHOD'];
$json_sent = false;

try {
    switch ($request_method) {
        case 'POST':
            // Gọi controller để xử lý việc thêm review
            $controller->addReview();
            $json_sent = true; // Giả định controller sẽ echo JSON và có thể exit
            break;

        // Các case khác (GET, PUT, DELETE cho /api/review) nếu cần

        default:
            if (!$json_sent) {
                // Đặt Content-Type lại trước khi echo lỗi
                header('Content-Type: application/json');
                echo $response->error("Method not allowed for /api/review endpoint.", 405);
                $json_sent = true;
            }
            break;
    }

} catch (Throwable $e) {
    // Xử lý lỗi chung từ controller
    if (!$json_sent) {
        $statusCode = 500;
        $errorMessage = 'An internal error occurred while processing the review request.';

        if ($e instanceof PDOException || strpos($e->getMessage(), 'SQLSTATE') !== false) {
             error_log("Database Error processing review request: " . $e->getMessage()); // Log lỗi DB chi tiết
             $errorMessage = 'A database error occurred.'; // Thông báo chung cho client
        } elseif ($e->getMessage() === 'Vui lòng đăng nhập để gửi đánh giá.') {
             $statusCode = 401; // Unauthorized
             $errorMessage = $e->getMessage();
        } elseif ($e->getCode() >= 400 && $e->getCode() < 500) {
             $statusCode = $e->getCode();
             $errorMessage = $e->getMessage();
        } else {
             error_log("Error processing review request: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        }

        // Đặt Content-Type lại trước khi echo lỗi JSON
        header('Content-Type: application/json');
        http_response_code($statusCode);
        echo json_encode([
            'success' => false,
            'message' => $errorMessage,
            // 'error_details' => $e->getMessage() // Chỉ bật khi debug
        ]);
        $json_sent = true;
    }
}
?>
