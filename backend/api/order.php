 <?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once '../controllers/OrderController.php';
require_once '../utils/Response.php';

$controller = new OrderController();
$response = new Response();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriSegments = explode('/', trim($uri, '/'));

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($uriSegments[2]) && is_numeric($uriSegments[2])) {
            $controller->getOrderById($uriSegments[2]);
        } else {
            $controller->getAllOrders();
        }
        break;

    case 'POST':
        $controller->createOrder();
        break;

    case 'PUT':
        if (isset($uriSegments[2]) && is_numeric($uriSegments[2])) {
            if (isset($uriSegments[3]) && $uriSegments[3] === 'status') {
                $controller->updateOrderStatus($uriSegments[2]);
            } elseif (isset($uriSegments[3]) && $uriSegments[3] === 'payment') {
                $controller->updatePaymentStatus($uriSegments[2]);
            } else {
                echo $response->error("Invalid endpoint", 400);
            }
        } else {
            echo $response->error("Order ID is required", 400);
        }
        break;

    case 'DELETE':
        if (isset($uriSegments[2]) && is_numeric($uriSegments[2])) {
            $controller->deleteOrder($uriSegments[2]);
        } else {
            echo $response->error("Order ID is required", 400);
        }
        break;

    default:
        echo $response->error("Method not allowed", 405);
        break;
}
?>
