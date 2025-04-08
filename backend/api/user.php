<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../controllers/UserController.php';
require_once '../utils/Response.php';

$controller = new UserController();
$response = new Response();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriSegments = explode('/', trim($uri, '/'));

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        if (isset($uriSegments[2]) && $uriSegments[2] === 'register') {
            $controller->register();
        } elseif (isset($uriSegments[2]) && $uriSegments[2] === 'login') {
            $controller->login();
        } else {
            echo $response->error("Invalid endpoint", 400);
        }
        break;

    case 'GET':
        if (isset($uriSegments[2]) && is_numeric($uriSegments[2])) {
            $controller->getUserById($uriSegments[2]);
        } else {
            echo $response->error("User ID is required", 400);
        }
        break;

    case 'PUT':
        if (isset($uriSegments[2]) && is_numeric($uriSegments[2])) {
            if (isset($uriSegments[3]) && $uriSegments[3] === 'membership') {
                $controller->updateMembershipLevel($uriSegments[2]);
            } elseif (isset($uriSegments[3]) && $uriSegments[3] === 'admin') {
                $controller->makeAdmin($uriSegments[2]);
            } else {
                $controller->updateUser($uriSegments[2]);
            }
        } else {
            echo $response->error("User ID is required", 400);
        }
        break;

    case 'DELETE':
        if (isset($uriSegments[2]) && is_numeric($uriSegments[2])) {
            $controller->deleteUser($uriSegments[2]);
        } else {
            echo $response->error("User ID is required", 400);
        }
        break;

    default:
        echo $response->error("Method not allowed", 405);
        break;
}
?>
