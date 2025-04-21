<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Auth.php';
require_once __DIR__ . '/../controllers/ProductController.php';

$controller = new ProductController();
$response = new Response();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriSegments = explode('/', trim($uri, '/'));

if ($uriSegments[0] === 'backend' && $uriSegments[1] === 'api') {
    array_shift($uriSegments);
    array_shift($uriSegments);
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($uriSegments[2]) && is_numeric($uriSegments[2])) {
            $controller->getProductById($uriSegments[2]);
        } elseif (isset($uriSegments[2]) && $uriSegments[2] === 'smartphones') {
            $controller->getAllSmartphones();
        } elseif (isset($uriSegments[2]) && $uriSegments[2] === 'laptops') {
            $controller->getAllLaptops();
        } else {
            $controller->getAllProducts();
        }
        break;

    case 'POST':
        Auth::protect(true); // Chỉ admin
        $controller->createProduct();
        break;

    case 'PUT':
        if (isset($uriSegments[2]) && is_numeric($uriSegments[2])) {
            Auth::protect(true); // Chỉ admin
            $controller->updateProduct($uriSegments[2]);
        } else {
            echo $response->error("Product ID is required", 400);
        }
        break;

    case 'DELETE':
        if (isset($uriSegments[2]) && is_numeric($uriSegments[2])) {
            Auth::protect(true); // Chỉ admin
            $controller->deleteProduct($uriSegments[2]);
        } else {
            echo $response->error("Product ID is required", 400);
        }
        break;

    default:
        echo $response->error("Method not allowed", 405);
        break;
}
?>