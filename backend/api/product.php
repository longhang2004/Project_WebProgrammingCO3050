<?php
// File: backend/api/product.php

// --- Headers ---
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

// --- Handle OPTIONS Pre-flight request ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Dependencies ---
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/ReviewController.php';
require_once __DIR__ . '/../utils/Response.php';
// *** FIX: Explicitly require the Review model here ***
// Ensure the Review class definition is loaded before ReviewController might need it.
require_once __DIR__ . '/../models/Review.php';


// --- Instantiate Controllers and Response ---
try {
    $productController = new ProductController();
    // Now it should be safe to instantiate ReviewController
    $reviewController = new ReviewController();
    $response = new Response();
} catch (Throwable $e) {
    // This catch block should now only trigger for other initialization errors
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to initialize product API components.',
        'error' => $e->getMessage() // Show the actual error during debugging
    ]);
    exit();
}


// --- Routing within the Product API ---
$base_api_path = '/Project_WebProgrammingCO3050/backend/api/product';
$request_uri = $_SERVER['REQUEST_URI'];
$request_path = parse_url($request_uri, PHP_URL_PATH);

$action_path = '';
if (strpos($request_path, $base_api_path) === 0) {
    $action_path = substr($request_path, strlen($base_api_path));
}

$actionSegments = explode('/', trim($action_path, '/'));
$action = isset($actionSegments[0]) ? $actionSegments[0] : '';
$sub_action = isset($actionSegments[1]) ? $actionSegments[1] : '';


// --- Handle Request based on Method and Action ---
$request_method = $_SERVER['REQUEST_METHOD'];
$json_sent = false; // Flag to prevent multiple responses

try {
    switch ($request_method) {
        case 'GET':
            // --- Handle GET /api/product/{id}/reviews ---
            if (is_numeric($action) && $action !== '' && $sub_action === 'reviews') {
                $productId = intval($action);
                // Call the method in ReviewController
                $reviewController->getReviewsForProduct($productId);
                $json_sent = true;
            }
            // --- Handle GET /api/product/{id} (Get product details) ---
            elseif (is_numeric($action) && $action !== '' && $sub_action === '') {
                $productId = intval($action);
                // Call the method in ProductController
                $productController->getProductById($productId);
                $json_sent = true;
            }
            // --- Handle GET /api/product/smartphones or /laptops ---
            elseif (!is_numeric($action) && ($action === 'smartphones' || $action === 'laptops') && $sub_action === '') {
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 12;
                if ($action === 'smartphones') {
                    $productController->getAllSmartphones($page, $per_page);
                } else { // Laptops
                    $productController->getAllLaptops($page, $per_page);
                }
                $json_sent = true;
            }
             // --- Handle GET /api/product (Get all products) ---
             elseif ($action === '' && $sub_action === '') {
                 $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                 $per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 12;
                 $productController->getAllProducts($page, $per_page);
                 $json_sent = true;
             }
            // --- Other invalid GET cases ---
            else {
                if (!$json_sent) {
                    echo $response->error("Invalid GET endpoint for product API.", 400);
                    $json_sent = true;
                }
            }
            break;

        case 'POST':
             if ($action === '' && $sub_action === '') {
                 // Requires authentication/authorization (e.g., check JWT for admin role)
                 // Example: checkAdminToken(); // You'd need to implement this
                 $productController->createProduct();
                 $json_sent = true;
             } else {
                 if (!$json_sent) { echo $response->error("Invalid POST endpoint.", 400); $json_sent = true; }
             }
            break;
        case 'PUT':
            if (is_numeric($action) && $action !== '' && $sub_action === '') {
                 // Requires authentication/authorization
                 // Example: checkAdminToken();
                $productController->updateProduct(intval($action));
                $json_sent = true;
            } else {
                if (!$json_sent) { echo $response->error("Invalid PUT endpoint. Requires /api/product/{id}", 400); $json_sent = true; }
            }
            break;
        case 'DELETE':
            if (is_numeric($action) && $action !== '' && $sub_action === '') {
                 // Requires authentication/authorization
                 // Example: checkAdminToken();
                $productController->deleteProduct(intval($action));
                $json_sent = true;
            } else {
                if (!$json_sent) { echo $response->error("Invalid DELETE endpoint. Requires /api/product/{id}", 400); $json_sent = true; }
            }
            break;

        default:
            if (!$json_sent) {
                echo $response->error("Method not allowed for product API", 405);
                $json_sent = true;
            }
            break;
    }

} catch (Throwable $e) {
     // Handle generic errors from controller actions or routing logic
     if (!$json_sent) {
        // Determine appropriate status code (e.g., 401 for auth errors, 400 for validation, 500 for server errors)
        $statusCode = 500;
        $errorMessage = 'An internal error occurred while processing the product request.';

        // Example: Check for specific exception types or codes if needed
        // if ($e instanceof AuthenticationException) { $statusCode = 401; $errorMessage = $e->getMessage(); }
        // elseif ($e instanceof ValidationException) { $statusCode = 400; $errorMessage = $e->getMessage(); }

        http_response_code($statusCode);
        error_log("Error processing product request: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        echo json_encode([ 'success' => false, 'message' => $errorMessage ]);
        $json_sent = true;
     }
}

?>
