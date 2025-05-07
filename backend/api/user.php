<?php
// File: backend/api/user.php

// --- Headers ---
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Core Dependencies ---
// Load Response, Model, and Controller first
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../controllers/UserController.php';

// *** REVERT: Remove explicit JWT requires from here. They should be handled by JwtHelper itself. ***
// require_once __DIR__ . '/../config/jwt_config.php'; // REMOVED
// require_once __DIR__ . '/../utils/JwtHelper.php'; // REMOVED (UserController will require it if needed)


// --- Instantiate Controller and Response ---
try {
    // UserController's constructor might implicitly load JwtHelper if needed later
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
$base_api_path = '/Project_WebProgrammingCO3050/backend/api/user';
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
$json_sent = false;

try {
    switch ($request_method) {
        case 'POST':
            if ($action === 'register') {
                $controller->register();
                $json_sent = true;
            } elseif ($action === 'login') {
                // This call will trigger loading JwtHelper and its config dependency
                $controller->login();
                $json_sent = true;
            } else {
                if (!$json_sent) {
                    echo $response->error("Invalid POST endpoint for user API. Expected /register or /login.", 400);
                    $json_sent = true;
                }
            }
            break;

        case 'GET':
            // Authentication might be needed here depending on the specific GET action
            // Example: require_once __DIR__ . '/../utils/JwtHelper.php'; $decodedPayload = JwtHelper::verifyJwt(getAuthorizationToken()); ...

            if (is_numeric($action) && $action !== '') {
                $controller->getUserById($action);
                 $json_sent = true;
            } else {
                 if (!$json_sent) {
                    echo $response->error("User ID (numeric) is required for GET request, or specify a valid action.", 400);
                    $json_sent = true;
                 }
            }
            break;

        case 'PUT':
            // Authentication should be handled within controller methods (updateUser, etc.)
            if (is_numeric($action) && $action !== '') {
                $user_id = $action;
                if ($sub_action === 'membership') {
                    $controller->updateMembershipLevel($user_id);
                     $json_sent = true;
                } elseif ($sub_action === 'admin') {
                    $controller->makeAdmin($user_id);
                     $json_sent = true;
                } elseif ($sub_action === '') {
                    $controller->updateUser($user_id);
                     $json_sent = true;
                } else {
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
             // Authentication should be handled within controller method (deleteUser)
            if (is_numeric($action) && $action !== '') {
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
     if (!$json_sent) {
        $statusCode = 500;
        $errorMessage = 'An internal error occurred while processing the user request.';

        if ($e->getCode() === 401) {
            $statusCode = 401;
            $errorMessage = $e->getMessage();
        } elseif ($e->getCode() >= 400 && $e->getCode() < 500) {
             $statusCode = $e->getCode();
             $errorMessage = $e->getMessage();
        } else {
            error_log("Error processing user request: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        }

        http_response_code($statusCode);
        echo json_encode([
            'success' => false,
            'message' => $errorMessage,
            // 'error_details' => $e->getMessage() // DEBUG ONLY
        ]);
        $json_sent = true;
     }
}

?>
