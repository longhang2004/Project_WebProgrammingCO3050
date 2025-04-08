<?php
require_once '../models/Order.php';
require_once '../utils/Response.php';

class OrderController {
    private $order;
    private $response;

    public function __construct() {
        $this->order = new Order();
        $this->response = new Response();
    }

    public function getAllOrders() {
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;
        $perPage = isset($_GET['per_page']) && is_numeric($_GET['per_page']) ? intval($_GET['per_page']) : 10;

        $orders = $this->order->getAllOrders($page, $perPage);
        if ($orders['data']) {
            echo $this->response->success($orders);
        } else {
            echo $this->response->error("No orders found", 404);
        }
    }

    public function getOrderById($id) {
        $order = $this->order->getOrderById($id);
        if ($order) {
            echo $this->response->success($order);
        } else {
            echo $this->response->error("Order not found", 404);
        }
    }

    public function createOrder() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['user_id']) || !isset($data['shipping_address']) || !isset($data['payment_method']) || !isset($data['order_items'])) {
            echo $this->response->error("Missing required fields", 400);
            return;
        }

        $user_id = intval($data['user_id']);
        $shipping_address = $data['shipping_address'];
        $payment_method = $data['payment_method'];
        $order_items = $data['order_items'];

        $order_id = $this->order->createOrder($user_id, $shipping_address, $payment_method, $order_items);

        if ($order_id) {
            echo $this->response->success(['message' => 'Order created successfully', 'order_id' => $order_id]);
        } else {
            echo $this->response->error("Failed to create order", 500);
        }
    }

    public function updateOrderStatus($id) {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['status'])) {
            echo $this->response->error("Missing status", 400);
            return;
        }

        $status = $data['status'];

        if ($this->order->updateOrderStatus($id, $status)) {
            echo $this->response->success(['message' => 'Order status updated successfully']);
        } else {
            echo $this->response->error("Failed to update order status", 500);
        }
    }

    public function updatePaymentStatus($id) {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['payment_status'])) {
            echo $this->response->error("Missing payment status", 400);
            return;
        }

        $payment_status = $data['payment_status'];

        if ($this->order->updatePaymentStatus($id, $payment_status)) {
            echo $this->response->success(['message' => 'Payment status updated successfully']);
        } else {
            echo $this->response->error("Failed to update payment status", 500);
        }
    }

    public function deleteOrder($id) {
        if ($this->order->deleteOrder($id)) {
            echo $this->response->success(['message' => 'Order deleted successfully']);
        } else {
            echo $this->response->error("Failed to delete order", 500);
        }
    }
}
?>
