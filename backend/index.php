<?php
// File: backend/index.php

// *** BẬT OUTPUT BUFFERING ***
ob_start();

// *** CẤU HÌNH SESSION COOKIE PATH & DOMAIN & SAMESITE ***
// Thêm cấu hình này TRƯỚC session_start()
session_set_cookie_params([
    'lifetime' => 0, // Cookie tồn tại đến khi đóng trình duyệt
    'path' => '/',   // Áp dụng cho toàn bộ domain
    'domain' => '',  // Để trống cho localhost, trình duyệt sẽ tự xử lý
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on', // Chỉ true nếu dùng HTTPS
    'httponly' => true, // Ngăn truy cập cookie từ JavaScript (bảo mật)
    'samesite' => 'Lax' // Bắt đầu với 'Lax'. Nếu review vẫn lỗi, cân nhắc 'None' (nhưng cần HTTPS)
]);

// *** KHỞI TẠO SESSION NGAY TỪ ĐẦU ***
if (session_status() === PHP_SESSION_NONE) {
    session_start();
    // Log session ID sau khi start (chỉ để debug nếu cần)
    // error_log("DEBUG index.php - Session started with ID: " . session_id());
}

// --- CORS and Content Type Headers ---
// (Giữ nguyên các header CORS và Content-Type của bạn)
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');


// --- Handle OPTIONS Pre-flight request ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    ob_end_flush();
    exit();
}

// --- Basic Routing ---
// (Giữ nguyên phần routing của bạn)
$base_path = '/Project_WebProgrammingCO3050/backend/';
$request_uri = $_SERVER['REQUEST_URI'];
$request_path = parse_url($request_uri, PHP_URL_PATH);

if (strpos($request_path, $base_path) === 0) {
    $request_path = substr($request_path, strlen($base_path));
}

$uriSegments = explode('/', trim($request_path, '/'));

if (empty($uriSegments[0]) || $uriSegments[0] !== 'api') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid API request structure. Expected /api/...']);
    ob_end_flush();
    exit();
}

$resource = isset($uriSegments[1]) ? $uriSegments[1] : null;

if (!$resource) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'API resource not specified. Expected /api/{resource}/...']);
     ob_end_flush(); exit();
}

// *** SỬA LỖI: Cho phép resource 'order' nếu bạn có API order ***
$allowed_resources = ['product', 'user', 'review', 'cart', 'order']; // Thêm 'order' vào đây
if (!in_array($resource, $allowed_resources)) {
     http_response_code(404);
     echo json_encode(['success' => false, 'message' => "Resource '{$resource}' not found."]);
     ob_end_flush(); exit();
}


$resource_file = __DIR__ . "/api/{$resource}.php";

if (file_exists($resource_file)) {
    require $resource_file;
} else {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => "API resource handler '{$resource}.php' not found.",
        'checked_path' => $resource_file
    ]);
     ob_end_flush(); exit();
}

// *** GỬI OUTPUT BUFFER VÀ KẾT THÚC ***
ob_end_flush();

?>