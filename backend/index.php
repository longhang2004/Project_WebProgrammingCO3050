<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim($uri, '/');
$uriSegments = explode('/', $uri);

// Điều chỉnh để bỏ qua base path 'backend'
$basePath = 'backend';
if ($uriSegments[0] === $basePath) {
    array_shift($uriSegments); // Loại bỏ 'backend' khỏi mảng
}

if (empty($uriSegments[0]) || $uriSegments[0] !== 'api') {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['success' => false, 'message' => 'API endpoint not found']);
    exit();
}

$resource = isset($uriSegments[1]) ? $uriSegments[1] : '';
$file = "api/{$resource}.php"; // Đổi đường dẫn từ ../api/ thành api/ vì index.php đã nằm trong backend/

if (file_exists($file)) {
    require $file;
} else {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['success' => false, 'message' => "Resource '{$resource}' not found"]);
    exit();
}
?>