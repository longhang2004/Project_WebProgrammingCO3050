<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Cho phép CORS (có thể điều chỉnh domain cụ thể)
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Xử lý request
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim($uri, '/');
$uriSegments = explode('/', $uri);

if (empty($uriSegments[0]) || $uriSegments[0] !== 'api') {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['success' => false, 'message' => 'API endpoint not found']);
    exit();
}

// Xác định resource (ví dụ: product, order, user)
$resource = isset($uriSegments[1]) ? $uriSegments[1] : '';
$file = "../api/{$resource}.php";

if (file_exists($file)) {
    require $file;
} else {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['success' => false, 'message' => "Resource '{$resource}' not found"]);
    exit();
}
?>