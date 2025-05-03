<?php
// --- Headers (Đã có trong index.php nhưng để đây cho an toàn nếu chạy riêng) ---
header('Content-Type: application/json');
// Cho phép nguồn cụ thể của React app
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// --- Xử lý OPTIONS request ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Dependencies ---
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../utils/Response.php'; // Đảm bảo class Response tồn tại

// --- Bật hiển thị lỗi để debug (TẮT KHI DEPLOY) ---
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
// --- Kết thúc bật lỗi ---


// --- Instantiate Controller and Response ---
try {
    // *** SỬA LỖI 1: Khởi tạo UserController ***
    $controller = new UserController();
    $response = new Response();
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to initialize user API components.',
        'error' => $e->getMessage()
    ]);
    exit();
}


// --- Routing within the User API ---

// Tính toán đường dẫn action tương tự như product.php
$base_api_path = '/Project_WebProgrammingCO3050/backend/api/user'; // Base cho resource 'user'
$request_uri = $_SERVER['REQUEST_URI'];
$request_path = parse_url($request_uri, PHP_URL_PATH);

$action_path = '';
if (strpos($request_path, $base_api_path) === 0) {
    $action_path = substr($request_path, strlen($base_api_path));
}

// Tách các phần của action path
$actionSegments = explode('/', trim($action_path, '/'));
// Action là phần tử đầu tiên sau /api/user/ (ví dụ: 'register', 'login', '123', hoặc rỗng)
$action = isset($actionSegments[0]) ? $actionSegments[0] : '';
// Phần tử thứ hai có thể là action phụ (ví dụ: /api/user/123/membership)
$sub_action = isset($actionSegments[1]) ? $actionSegments[1] : '';


// --- Handle Request based on Method and Action ---
$request_method = $_SERVER['REQUEST_METHOD'];
$json_sent = false; // Cờ kiểm tra

try {
    switch ($request_method) {
        case 'POST':
            // *** SỬA LỖI 2: Kiểm tra đúng action ***
            if ($action === 'register') {
                $controller->register(); // Gọi phương thức register trong UserController
                $json_sent = true;
            } elseif ($action === 'login') {
                $controller->login(); // Gọi phương thức login trong UserController
                $json_sent = true;
            } else {
                // Nếu không phải register hay login, báo lỗi
                if (!$json_sent) {
                     // Sử dụng đối tượng $response đã tạo
                    echo $response->error("Invalid POST endpoint for user API. Expected /register or /login.", 400);
                    $json_sent = true;
                }
            }
            break;

        case 'GET':
             // *** SỬA LỖI 2: Kiểm tra đúng action (ID người dùng) ***
            if (is_numeric($action) && $action !== '') { // Kiểm tra action là số và không rỗng
                 // Gọi phương thức getUserById trong UserController, truyền ID
                $controller->getUserById($action);
                 $json_sent = true;
            } else {
                 if (!$json_sent) {
                    echo $response->error("User ID (numeric) is required for GET request.", 400);
                    $json_sent = true;
                 }
            }
            break;

        case 'PUT':
             // *** SỬA LỖI 2: Kiểm tra đúng action (ID) và sub_action ***
            if (is_numeric($action) && $action !== '') { // ID người dùng phải là số
                $user_id = $action;
                if ($sub_action === 'membership') {
                     // Gọi phương thức updateMembershipLevel trong UserController
                    $controller->updateMembershipLevel($user_id);
                     $json_sent = true;
                } elseif ($sub_action === 'admin') {
                     // Gọi phương thức makeAdmin trong UserController
                    $controller->makeAdmin($user_id);
                     $json_sent = true;
                } elseif ($sub_action === '') { // Nếu không có sub_action, là cập nhật thông tin user
                     // Gọi phương thức updateUser trong UserController
                    $controller->updateUser($user_id);
                     $json_sent = true;
                } else {
                     // Nếu sub_action không hợp lệ
                     if (!$json_sent) {
                        echo $response->error("Invalid PUT action for user ID {$user_id}.", 400);
                        $json_sent = true;
                     }
                }
            } else {
                 if (!$json_sent) {
                    echo $response->error("User ID (numeric) is required for PUT request.", 400);
                    $json_sent = true;
                 }
            }
            break;

        case 'DELETE':
             // *** SỬA LỖI 2: Kiểm tra đúng action (ID người dùng) ***
            if (is_numeric($action) && $action !== '') { // ID phải là số
                 // Gọi phương thức deleteUser trong UserController
                $controller->deleteUser($action);
                 $json_sent = true;
            } else {
                 if (!$json_sent) {
                    echo $response->error("User ID (numeric) is required for DELETE request.", 400);
                    $json_sent = true;
                 }
            }
            break;

        default:
             if (!$json_sent) {
                echo $response->error("Method not allowed for user API", 405);
                $json_sent = true;
             }
            break;
    }

} catch (Throwable $e) {
    // Xử lý lỗi chung nếu có lỗi xảy ra trong controller
     if (!$json_sent) {
        http_response_code(500); // Internal Server Error
        // Ghi log lỗi chi tiết trên server
        error_log("Error processing user request: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        // Trả về lỗi chung cho client
        echo json_encode([
            'success' => false,
            'message' => 'An internal error occurred while processing the user request.',
            // 'error_details' => $e->getMessage() // Chỉ bật khi debug
        ]);
        $json_sent = true;
     }
}

?>
