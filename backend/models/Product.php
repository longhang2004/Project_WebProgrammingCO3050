<?php
require_once '../utils/Database.php';

class Product {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    // Lấy tất cả sản phẩm với pagination
    public function getAllProducts($page = 1, $perPage = 10) {
        $offset = ($page - 1) * $perPage;

        $query = "SELECT p.*, 
                  s.processor, s.camera, s.battery, s.screen_description, s.RAM_ROM, s.sim_connectivity,
                  l.CPU, l.GPU, l.RAM, l.storage, l.screen_description AS laptop_screen, l.battery AS laptop_battery, l.ports
                  FROM products p
                  LEFT JOIN smartphones s ON p.product_id = s.product_id
                  LEFT JOIN laptops l ON p.product_id = l.product_id
                  ORDER BY p.created_at DESC
                  LIMIT ? OFFSET ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $perPage, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        $products = [];

        while ($row = $result->fetch_assoc()) {
            $products[] = $this->formatProduct($row);
        }

        // Lấy tổng số bản ghi để tính tổng số trang
        $countQuery = "SELECT COUNT(*) as total FROM products";
        $countResult = $this->conn->query($countQuery);
        $total = $countResult->fetch_assoc()['total'];
        $totalPages = ceil($total / $perPage);

        return [
            'data' => $products,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total_items' => $total,
                'total_pages' => $totalPages
            ]
        ];
    }

    // Lấy tất cả smartphone với pagination
    public function getAllSmartphones($page = 1, $perPage = 10) {
        $offset = ($page - 1) * $perPage;

        $query = "SELECT p.*, s.* 
                  FROM products p
                  JOIN smartphones s ON p.product_id = s.product_id
                  ORDER BY p.created_at DESC
                  LIMIT ? OFFSET ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $perPage, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        $smartphones = [];

        while ($row = $result->fetch_assoc()) {
            $smartphones[] = $this->formatSmartphone($row);
        }

        $countQuery = "SELECT COUNT(*) as total FROM products p JOIN smartphones s ON p.product_id = s.product_id";
        $countResult = $this->conn->query($countQuery);
        $total = $countResult->fetch_assoc()['total'];
        $totalPages = ceil($total / $perPage);

        return [
            'data' => $smartphones,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total_items' => $total,
                'total_pages' => $totalPages
            ]
        ];
    }

    // Lấy tất cả laptop với pagination
    public function getAllLaptops($page = 1, $perPage = 10) {
        $offset = ($page - 1) * $perPage;

        $query = "SELECT p.*, l.* 
                  FROM products p
                  JOIN laptops l ON p.product_id = l.product_id
                  ORDER BY p.created_at DESC
                  LIMIT ? OFFSET ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $perPage, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        $laptops = [];

        while ($row = $result->fetch_assoc()) {
            $laptops[] = $this->formatLaptop($row);
        }

        $countQuery = "SELECT COUNT(*) as total FROM products p JOIN laptops l ON p.product_id = l.product_id";
        $countResult = $this->conn->query($countQuery);
        $total = $countResult->fetch_assoc()['total'];
        $totalPages = ceil($total / $perPage);

        return [
            'data' => $laptops,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total_items' => $total,
                'total_pages' => $totalPages
            ]
        ];
    }

    // Lấy sản phẩm theo ID (không cần pagination)
    public function getProductById($id) {
        $query = "SELECT p.*, 
                  s.processor, s.camera, s.battery, s.screen_description, s.RAM_ROM, s.sim_connectivity,
                  l.CPU, l.GPU, l.RAM, l.storage, l.screen_description AS laptop_screen, l.battery AS laptop_battery, l.ports
                  FROM products p
                  LEFT JOIN smartphones s ON p.product_id = s.product_id
                  LEFT JOIN laptops l ON p.product_id = l.product_id
                  WHERE p.product_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $product = $result->fetch_assoc();
        return $this->formatProduct($product);
    }

    // Thêm mới sản phẩm (chỉ vào bảng Products, chi tiết sẽ được thêm sau)
    public function createProduct($name, $description, $price, $stock, $rated_stars, $warranty_period, $manufacturer, $warranty_policy, $imageurl) {
        $query = "INSERT INTO products (name, description, price, stock, rated_stars, warranty_period, manufacturer, warranty_policy, imageurl) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssdidisss", $name, $description, $price, $stock, $rated_stars, $warranty_period, $manufacturer, $warranty_policy, $imageurl);

        if ($stmt->execute()) {
            return $this->conn->insert_id; // Trả về product_id vừa tạo
        }

        return false;
    }

    // Thêm chi tiết smartphone
    public function createSmartphone($product_id, $processor, $camera, $battery, $screen_description, $ram_rom, $sim_connectivity) {
        $query = "INSERT INTO smartphones (product_id, processor, camera, battery, screen_description, RAM_ROM, sim_connectivity) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("issssss", $product_id, $processor, $camera, $battery, $screen_description, $ram_rom, $sim_connectivity);

        return $stmt->execute();
    }

    // Thêm chi tiết laptop
    public function createLaptop($product_id, $cpu, $gpu, $ram, $storage, $screen_description, $battery, $ports) {
        $query = "INSERT INTO laptops (product_id, CPU, GPU, RAM, storage, screen_description, battery, ports) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("isssssss", $product_id, $cpu, $gpu, $ram, $storage, $screen_description, $battery, $ports);

        return $stmt->execute();
    }

    // Cập nhật sản phẩm (chỉ bảng Products)
    public function updateProduct($id, $name, $description, $price, $stock, $rated_stars, $warranty_period, $manufacturer, $warranty_policy, $imageurl) {
        $query = "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, rated_stars = ?, warranty_period = ?, manufacturer = ?, warranty_policy = ?, imageurl = ? WHERE product_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssdidisssi", $name, $description, $price, $stock, $rated_stars, $warranty_period, $manufacturer, $warranty_policy, $imageurl, $id);

        return $stmt->execute();
    }

    // Cập nhật chi tiết smartphone
    public function updateSmartphone($product_id, $processor, $camera, $battery, $screen_description, $ram_rom, $sim_connectivity) {
        $query = "UPDATE smartphones SET processor = ?, camera = ?, battery = ?, screen_description = ?, RAM_ROM = ?, sim_connectivity = ? WHERE product_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssssssi", $processor, $camera, $battery, $screen_description, $ram_rom, $sim_connectivity, $product_id);

        return $stmt->execute();
    }

    // Cập nhật chi tiết laptop
    public function updateLaptop($product_id, $cpu, $gpu, $ram, $storage, $screen_description, $battery, $ports) {
        $query = "UPDATE laptops SET CPU = ?, GPU = ?, RAM = ?, storage = ?, screen_description = ?, battery = ?, ports = ? WHERE product_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sssssssi", $cpu, $gpu, $ram, $storage, $screen_description, $battery, $ports, $product_id);

        return $stmt->execute();
    }

    // Xóa sản phẩm (cả bảng Products và các bảng con sẽ tự động xóa nhờ ON DELETE CASCADE)
    public function deleteProduct($id) {
        $query = "DELETE FROM products WHERE product_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);

        return $stmt->execute();
    }

    // Format sản phẩm để đảm bảo dữ liệu nhất quán
    private function formatProduct($row) {
        if (!$row) return null;

        $product = [
            'product_id' => $row['product_id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'price' => $row['price'],
            'stock' => $row['stock'],
            'rated_stars' => $row['rated_stars'],
            'warranty_period' => $row['warranty_period'],
            'manufacturer' => $row['manufacturer'],
            'warranty_policy' => $row['warranty_policy'],
            'imageurl' => $row['imageurl'],
            'created_at' => $row['created_at']
        ];

        // Thêm thông tin chi tiết nếu là smartphone
        if ($row['processor']) {
            $product['details'] = [
                'type' => 'smartphone',
                'processor' => $row['processor'],
                'camera' => $row['camera'],
                'battery' => $row['battery'],
                'screen_description' => $row['screen_description'],
                'RAM_ROM' => $row['RAM_ROM'],
                'sim_connectivity' => $row['sim_connectivity']
            ];
        }

        // Thêm thông tin chi tiết nếu là laptop
        if ($row['CPU']) {
            $product['details'] = [
                'type' => 'laptop',
                'CPU' => $row['CPU'],
                'GPU' => $row['GPU'],
                'RAM' => $row['RAM'],
                'storage' => $row['storage'],
                'screen_description' => $row['laptop_screen'],
                'battery' => $row['laptop_battery'],
                'ports' => $row['ports']
            ];
        }

        return $product;
    }

    // Format smartphone
    private function formatSmartphone($row) {
        if (!$row) return null;

        return [
            'product_id' => $row['product_id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'price' => $row['price'],
            'stock' => $row['stock'],
            'rated_stars' => $row['rated_stars'],
            'warranty_period' => $row['warranty_period'],
            'manufacturer' => $row['manufacturer'],
            'warranty_policy' => $row['warranty_policy'],
            'imageurl' => $row['imageurl'],
            'created_at' => $row['created_at'],
            'details' => [
                'type' => 'smartphone',
                'processor' => $row['processor'],
                'camera' => $row['camera'],
                'battery' => $row['battery'],
                'screen_description' => $row['screen_description'],
                'RAM_ROM' => $row['RAM_ROM'],
                'sim_connectivity' => $row['sim_connectivity']
            ]
        ];
    }

    // Format laptop
    private function formatLaptop($row) {
        if (!$row) return null;

        return [
            'product_id' => $row['product_id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'price' => $row['price'],
            'stock' => $row['stock'],
            'rated_stars' => $row['rated_stars'],
            'warranty_period' => $row['warranty_period'],
            'manufacturer' => $row['manufacturer'],
            'warranty_policy' => $row['warranty_policy'],
            'imageurl' => $row['imageurl'],
            'created_at' => $row['created_at'],
            'details' => [
                'type' => 'laptop',
                'CPU' => $row['CPU'],
                'GPU' => $row['GPU'],
                'RAM' => $row['RAM'],
                'storage' => $row['storage'],
                'screen_description' => $row['screen_description'],
                'battery' => $row['battery'],
                'ports' => $row['ports']
            ]
        ];
    }

    public function __destruct() {
        $this->db->closeConnection();
    }
}
?>
