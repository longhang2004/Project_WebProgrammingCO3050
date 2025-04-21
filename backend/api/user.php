<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../controllers/UserController.php';

$controller = new UserController();
$response = new Response();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim($uri, '/');
$uriSegments = explode('/', $uri);

// Điều chỉnh để bỏ qua base path 'backend/api'
if ($uriSegments[0] === 'backend' && $uriSegments[1] === 'api') {
    array_shift($uriSegments); // Loại bỏ 'backend'
    array_shift($uriSegments); // Loại bỏ 'api'
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        if (isset($uriSegments[0]) && $uriSegments[0] === 'user') {
            if (isset($uriSegments[1]) && $uriSegments[1] === 'register') {
                $controller->register();
            } elseif (isset($uriSegments[1]) && $uriSegments[1] === 'login') {
                $controller->login();
            } else {
                echo $response->error("Invalid endpoint", 400);
            }
        } else {
            echo $response->error("Invalid resource", 400);
        }
        break;

    case 'GET':
        if (isset($uriSegments[0]) && $uriSegments[0] === 'user' && isset($uriSegments[1]) && is_numeric($uriSegments[1])) {
            $controller->getUserById($uriSegments[1]);
        } else {
            echo $response->error("User ID is required", 400);
        }
        break;

    case 'PUT':
        if (isset($uriSegments[0]) && $uriSegments[0] === 'user' && isset($uriSegments[1]) && is_numeric($uriSegments[1])) {
            if (isset($uriSegments[2]) && $uriSegments[2] === 'membership') {
                $controller->updateMembershipLevel($uriSegments[1]);
            } elseif (isset($uriSegments[2]) && $uriSegments[2] === 'admin') {
                $controller->makeAdmin($uriSegments[1]);
            } else {
                $controller->updateUser($uriSegments[1]);
            }
        } else {
            echo $response->error("User ID is required", 400);
        }
        break;

    case 'DELETE':
        if (isset($uriSegments[0]) && $uriSegments[0] === 'user' && isset($uriSegments[1]) && is_numeric($uriSegments[1])) {
            $controller->deleteUser($uriSegments[1]);
        } else {
            echo $response->error("User ID is required", 400);
        }
        break;

    default:
        echo $response->error("Method not allowed", 405);
        break;
}
?>