<?php
// File: backend/api/review.php

// --- Headers ---
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');


// --- Handle OPTIONS Pre-flight request ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    exit();
}

// --- Dependencies ---
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/Review.php';
require_once __DIR__ . '/../utils/JwtHelper.php';
require_once __DIR__ . '/../controllers/ReviewController.php';


// --- Instantiate Controller and Response ---
try {
    $controller = new ReviewController();
    $response = new Response();
} catch (Throwable $e) {
    http_response_code(500);
    error_log("FATAL Error initializing review API components: " . $e->getMessage() . "\n" . $e->getTraceAsString());
    echo json_encode([
        'success' => false,
        'message' => 'Failed to initialize review API components.',
    ]);
    exit();
}

// --- Routing within the Review API ---
$request_method = $_SERVER['REQUEST_METHOD'];
$json_sent = false;

// --- Parse URL Path for potential ID ---
$base_api_path = '/Project_WebProgrammingCO3050/backend/api/review';
$request_uri = $_SERVER['REQUEST_URI'];
$request_path = parse_url($request_uri, PHP_URL_PATH);

$action_path = '';
if (strpos($request_path, $base_api_path) === 0) {
    $action_path = substr($request_path, strlen($base_api_path));
}
// Get the part after /api/review/ (this should be the review ID if present)
$reviewIdSegment = trim($action_path, '/');
$reviewId = null;
if (is_numeric($reviewIdSegment) && $reviewIdSegment !== '') {
    $reviewId = intval($reviewIdSegment);
}
// --- End URL Path Parsing ---


try {
    switch ($request_method) {
        case 'POST':
            // POST /api/review - Add a new review
            if ($reviewId === null) { // Ensure no ID is present for POST
                $controller->addReview();
                $json_sent = true;
            } else {
                if (!$json_sent) { echo $response->error("Invalid endpoint for POST. Use /api/review without ID.", 400); $json_sent = true; }
            }
            break;

        case 'PUT':
            // PUT /api/review/{reviewId} - Update an existing review
            if ($reviewId !== null) {
                $controller->updateReview($reviewId);
                $json_sent = true;
            } else {
                 if (!$json_sent) { echo $response->error("Review ID is required for PUT request (/api/review/{id}).", 400); $json_sent = true; }
            }
            break;

        case 'DELETE':
            // DELETE /api/review/{reviewId} - Delete a review
             if ($reviewId !== null) {
                $controller->deleteReview($reviewId);
                $json_sent = true;
            } else {
                 if (!$json_sent) { echo $response->error("Review ID is required for DELETE request (/api/review/{id}).", 400); $json_sent = true; }
            }
            break;

        // GET requests are handled by product.php (/api/product/{id}/reviews)
        // case 'GET':
        //     // ... (logic if you want /api/review/{id} to get single review details)
        //     break;

        default:
            if (!$json_sent) {
                echo $response->error("Method not allowed for /api/review endpoint.", 405);
                $json_sent = true;
            }
            break;
    }

} catch (Throwable $e) {
    // Generic error handling
    if (!$json_sent) {
        $statusCode = 500;
        $errorMessage = 'An internal error occurred while processing the review request.';

        if ($e->getCode() === 401) {
             $statusCode = 401;
             $errorMessage = $e->getMessage();
        } elseif ($e->getCode() === 403) { // Forbidden (e.g., trying to edit/delete others' review)
             $statusCode = 403;
             $errorMessage = $e->getMessage();
        } elseif ($e->getCode() === 404) { // Not Found (e.g., review ID doesn't exist)
             $statusCode = 404;
             $errorMessage = $e->getMessage();
        } elseif ($e->getCode() === 409) { // Conflict (e.g., already reviewed)
             $statusCode = 409;
             $errorMessage = $e->getMessage();
        } elseif ($e->getCode() >= 400 && $e->getCode() < 500) { // Other client errors
             $statusCode = $e->getCode();
             $errorMessage = $e->getMessage();
        } else {
             error_log("Error processing review request in API: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        }

        http_response_code($statusCode);
        echo json_encode([
            'success' => false,
            'message' => $errorMessage,
        ]);
        $json_sent = true;
    }
}
?>
