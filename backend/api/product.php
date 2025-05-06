<?php
// --- BẬT HIỂN THỊ LỖI ĐỂ DEBUG (CHỈ DÙNG KHI PHÁT TRIỂN) ---
ini_set('display_errors', 1); // Bật hiển thị lỗi ra màn hình
ini_set('display_startup_errors', 1); // Bật hiển thị lỗi khởi động
error_reporting(E_ALL); // Hiển thị tất cả các loại lỗi, cảnh báo, thông báo
// --- KẾT THÚC PHẦN BẬT LỖI ---

// Note: Headers are already set by index.php, but repeating them doesn't hurt
// and makes this file potentially runnable standalone for testing.
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

// --- Handle OPTIONS Pre-flight request (Redundant if index.php handles it, but safe) ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Dependencies ---
// Use __DIR__ to ensure paths are correct relative to *this* file's location
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../utils/Response.php'; // Assuming Response class exists

// --- Instantiate Controller and Response ---
try {
    $controller = new ProductController(); // Ensure constructor doesn't throw errors
    $response = new Response(); // Ensure constructor doesn't throw errors
} catch (Throwable $e) {
    // Catch potential errors during instantiation (e.g., database connection)
    http_response_code(500); // Internal Server Error
    // Hiển thị lỗi JSON nếu khởi tạo thất bại (lỗi này sẽ được bắt ở đây)
    echo json_encode([
        'success' => false,
        'message' => 'Failed to initialize backend components.',
        'error' => $e->getMessage() // Provide error details (consider hiding in production)
    ]);
    exit(); // Dừng lại nếu không khởi tạo được controller/response
}


// --- Routing within the Product API ---

// Get the request path relative to the base API endpoint
$base_api_path = '/Project_WebProgrammingCO3050/backend/api/product'; // Base for this resource
$request_uri = $_SERVER['REQUEST_URI'];
$request_path = parse_url($request_uri, PHP_URL_PATH);

// Get the part of the path *after* /api/product/
$action_path = '';
if (strpos($request_path, $base_api_path) === 0) {
    $action_path = substr($request_path, strlen($base_api_path));
}

// Trim slashes and split the action path
$actionSegments = explode('/', trim($action_path, '/'));
$action = isset($actionSegments[0]) ? $actionSegments[0] : ''; // e.g., 'smartphones', 'laptops', '123', or ''

// --- Handle Request based on Method and Action ---
$request_method = $_SERVER['REQUEST_METHOD'];

// Đặt một cờ để kiểm tra xem JSON đã được gửi chưa
$json_sent = false;

try {
    switch ($request_method) {
        case 'GET':
            if (is_numeric($action)) { // Check if the action is a numeric ID
                $controller->getProductById($action);
                $json_sent = true; // Giả định controller sẽ echo JSON và exit
            } elseif ($action === 'smartphones') {
                // Pass query parameters (page, per_page) to the controller method
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 12;
                $controller->getAllSmartphones($page, $per_page); // Modify controller if needed
                $json_sent = true; // Giả định controller sẽ echo JSON và exit
            } elseif ($action === 'laptops') {
                 // Pass query parameters (page, per_page) to the controller method
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 12;
                $controller->getAllLaptops($page, $per_page); // Modify controller if needed
                 $json_sent = true; // Giả định controller sẽ echo JSON và exit
            } else if ($action === 'search') { // Example: /api/product/search?name=product_name
                $name = isset($_GET['name']) ? htmlspecialchars($_GET['name']) : ''; // Sanitize input
                $controller->getProductByName($name); // Modify controller if needed
                $json_sent = true; // Giả định controller sẽ echo JSON và exit
            } elseif ($action === '') { // No specific action means get all
                 // Pass query parameters (page, per_page) to the controller method
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 12;
                $controller->getAllProducts($page, $per_page); // Modify controller if needed
                 $json_sent = true; // Giả định controller sẽ echo JSON và exit
            } else {
                // Unknown GET action
                // Chỉ echo nếu chưa có JSON nào được gửi
                if (!$json_sent) {
                    echo $response->error("Unknown product action: " . htmlspecialchars($action), 404);
                    $json_sent = true;
                }
            }
            break;

        case 'POST':
             // Assuming create doesn't need an action in the URL path
            if ($action === '') {
               $controller->createProduct(); // Needs to read php://input for data
               $json_sent = true; // Giả định controller sẽ echo JSON và exit
            } else {
                if (!$json_sent) {
                    echo $response->error("Invalid POST request path", 400);
                    $json_sent = true;
                }
            }
            break;

        case 'PUT':
            if (is_numeric($action)) { // Expecting /api/product/{id}
                $controller->updateProduct($action); // Needs to read php://input for data
                $json_sent = true; // Giả định controller sẽ echo JSON và exit
            } else {
                if (!$json_sent) {
                    echo $response->error("Product ID is required for PUT request", 400);
                    $json_sent = true;
                }
            }
            break;

        case 'DELETE':
            if (is_numeric($action)) { // Expecting /api/product/{id}
                $controller->deleteProduct($action);
                 $json_sent = true; // Giả định controller sẽ echo JSON và exit
            } else {
                 if (!$json_sent) {
                    echo $response->error("Product ID is required for DELETE request", 400);
                    $json_sent = true;
                 }
            }
            break;

        default:
            // Method not allowed
            if (!$json_sent) {
                echo $response->error("Method " . htmlspecialchars($request_method) . " not allowed for /api/product", 405);
                $json_sent = true;
            }
            break;
    }
} catch (Throwable $e) {
    // Generic error handling for controller actions
    // Chỉ gửi lỗi JSON nếu chưa có gì được gửi trước đó
    if (!$json_sent) {
        http_response_code(500); // Internal Server Error
        // Be careful about exposing detailed errors in production
        echo json_encode([
            'success' => false,
            'message' => 'An error occurred while processing the request inside controller action.',
            'error' => $e->getMessage() // Log this error properly on the server
        ]);
         $json_sent = true; // Đánh dấu đã gửi JSON lỗi
    }
    // Nếu lỗi xảy ra sau khi JSON đã được gửi (ít khả năng), nó vẫn sẽ được hiển thị do display_errors=1
}

// --- Quan trọng: Đảm bảo không có output nào khác sau khi JSON (hoặc lỗi) đã được gửi ---
// Nếu $json_sent là false ở đây, có nghĩa là có một nhánh logic không xử lý hoặc không gửi phản hồi.
// Điều này có thể gây ra trang trắng hoặc lỗi không mong muốn.
// Bạn có thể thêm một phản hồi mặc định ở đây nếu cần, nhưng lý tưởng nhất là mọi nhánh đều phải gửi phản hồi.
// Ví dụ:
// if (!$json_sent) {
//     http_response_code(500);
//     echo json_encode(['success' => false, 'message' => 'Unhandled request path or internal error.']);
// }

?>
