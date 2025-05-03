<?php
// --- CORS and Content Type Headers ---
// Allow requests from your React app's origin
header('Access-Control-Allow-Origin: http://localhost:5173');
// Allow common methods
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
// Allow necessary headers
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
// Set content type to JSON
header('Content-Type: application/json');

// --- Handle OPTIONS Pre-flight request ---
// Browsers send an OPTIONS request first for CORS checks
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Respond OK to OPTIONS
    exit(); // Stop script execution for OPTIONS
}

// --- Basic Routing ---
$base_path = '/Project_WebProgrammingCO3050/backend/'; // Define your base path if needed
$request_uri = $_SERVER['REQUEST_URI'];

// Remove query string if present
$request_path = parse_url($request_uri, PHP_URL_PATH);

// Remove base path if your .htaccess doesn't handle it
// If your web server routes directly to index.php without the base path prefix,
// you might not need to remove it here. Check your XAMPP/Apache config.
if (strpos($request_path, $base_path) === 0) {
    $request_path = substr($request_path, strlen($base_path));
}

// Trim slashes and split the remaining path
$uriSegments = explode('/', trim($request_path, '/'));

// --- Input Validation ---
// Expecting "api/{resource}/..."
if (empty($uriSegments[0]) || $uriSegments[0] !== 'api') {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid API request structure. Expected /api/...']);
    exit();
}

// Determine the resource (e.g., 'product', 'user')
$resource = isset($uriSegments[1]) ? $uriSegments[1] : null;

if (!$resource) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'API resource not specified. Expected /api/{resource}/...']);
    exit();
}

// Construct the path to the resource handler file
// Use __DIR__ for reliability
$resource_file = __DIR__ . "/api/{$resource}.php";

// Check if the resource handler file exists
if (file_exists($resource_file)) {
    // Pass control to the specific resource handler
    require $resource_file;
} else {
    // Resource handler not found
    http_response_code(404); // Not Found
    echo json_encode([
        'success' => false,
        'message' => "API resource handler '{$resource}.php' not found.",
        'checked_path' => $resource_file // Include path for debugging
    ]);
    exit();
}

?>
