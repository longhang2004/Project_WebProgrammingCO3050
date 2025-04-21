<?php
require_once __DIR__ . '/../utils/Database.php';

class Order {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = Database::getInstance(); // Sử dụng Singleton
        $this->conn = $this->db->getConnection();
    }

    // Lấy tất cả đơn hàng với pagination
    public function getAllOrders($page = 1, $perPage = 10) {
        $offset = ($page - 1) * $perPage;

        $query = "SELECT o.*, u.username, 
                  COUNT(oi.order_item_id) as item_count, SUM(oi.quantity) as total_quantity 
                  FROM orders o 
                  JOIN customers u ON o.user_id = u.user_id 
                  LEFT JOIN orderitems oi ON o.order_id = oi.order_id 
                  GROUP BY o.order_id, o.user_id, o.order_date, o.total_price, o.shipping_address, 
                  o.payment_method, o.payment_status, o.status 
                  ORDER BY o.order_date DESC
                  LIMIT ? OFFSET ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $perPage, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        $orders = [];

        while ($row = $result->fetch_assoc()) {
            $row['items'] = $this->getOrderItems($row['order_id']);
            $orders[] = $row;
        }

        // Lấy tổng số bản ghi để tính tổng số trang
        $countQuery = "SELECT COUNT(*) as total FROM orders";
        $countResult = $this->conn->query($countQuery);
        $total = $countResult->fetch_assoc()['total'];
        $totalPages = ceil($total / $perPage);

        return [
            'data' => $orders,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total_items' => $total,
                'total_pages' => $totalPages
            ]
        ];
    }

    // Lấy đơn hàng theo ID (không cần pagination)
    public function getOrderById($id) {
        $query = "SELECT o.*, u.username 
                  FROM orders o 
                  JOIN customers u ON o.user_id = u.user_id 
                  WHERE o.order_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $order = $result->fetch_assoc();

        if ($order) {
            $order['items'] = $this->getOrderItems($id);
            return $order;
        }

        return null;
    }

    // Lấy chi tiết các mục của một đơn hàng
    private function getOrderItems($order_id) {
        $query = "SELECT oi.*, p.name, p.price 
                  FROM orderitems oi 
                  JOIN products p ON oi.product_id = p.product_id 
                  WHERE oi.order_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $items = [];

        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }

        return $items;
    }

    // Thêm mới đơn hàng và các mục đơn hàng
    public function createOrder($user_id, $shipping_address, $payment_method, $order_items) {
        // Bắt đầu transaction
        $this->conn->begin_transaction();

        try {
            // Thêm vào bảng Orders
            $query = "INSERT INTO orders (user_id, total_price, shipping_address, payment_method, payment_status) 
                      VALUES (?, 0, ?, ?, 'pending')";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("iss", $user_id, $shipping_address, $payment_method);
            $stmt->execute();
            $order_id = $this->conn->insert_id;

            // Tính tổng giá và thêm các mục đơn hàng
            $total_price = 0;
            foreach ($order_items as $item) {
                $product_id = $item['product_id'];
                $quantity = $item['quantity'];

                // Lấy giá sản phẩm từ bảng Products
                $product_query = "SELECT price FROM products WHERE product_id = ?";
                $product_stmt = $this->conn->prepare($product_query);
                $product_stmt->bind_param("i", $product_id);
                $product_stmt->execute();
                $product_result = $product_stmt->get_result();
                $product = $product_result->fetch_assoc();

                if (!$product) {
                    throw new Exception("Product not found");
                }

                $item_price = $product['price'] * $quantity;
                $total_price += $item_price;

                // Thêm vào bảng OrderItems
                $item_query = "INSERT INTO orderitems (order_id, product_id, quantity) VALUES (?, ?, ?)";
                $item_stmt = $this->conn->prepare($item_query);
                $item_stmt->bind_param("iii", $order_id, $product_id, $quantity);
                $item_stmt->execute();
            }

            // Cập nhật tổng giá trong bảng Orders
            $update_query = "UPDATE orders SET total_price = ? WHERE order_id = ?";
            $update_stmt = $this->conn->prepare($update_query);
            $update_stmt->bind_param("di", $total_price, $order_id);
            $update_stmt->execute();

            $this->conn->commit();
            return $order_id;

        } catch (Exception $e) {
            $this->conn->rollback();
            return false;
        }
    }

    // Cập nhật trạng thái đơn hàng
    public function updateOrderStatus($id, $status) {
        $query = "UPDATE orders SET status = ? WHERE order_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("si", $status, $id);

        return $stmt->execute();
    }

    // Cập nhật trạng thái thanh toán
    public function updatePaymentStatus($id, $payment_status) {
        $query = "UPDATE orders SET payment_status = ? WHERE order_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("si", $payment_status, $id);

        return $stmt->execute();
    }

    // Xóa đơn hàng (cả OrderItems sẽ tự động xóa nhờ ON DELETE CASCADE)
    public function deleteOrder($id) {
        $query = "DELETE FROM orders WHERE order_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);

        return $stmt->execute();
    }

    public function __destruct() {
        $this->db->closeConnection();
    }
}
?>
