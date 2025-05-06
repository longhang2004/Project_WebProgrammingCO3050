<?php
require_once __DIR__ . '/../utils/Database.php'; // Đảm bảo require_once này đúng

class Product {
    private $db;     // Nên lưu instance của Database Singleton
    private $conn;   // Lưu kết nối mysqli

    public function __construct() {
        // SỬA Ở ĐÂY: Sử dụng phương thức getInstance() để lấy đối tượng Database
        $this->db = Database::getInstance();
        // Lấy kết nối mysqli từ đối tượng Database
        $this->conn = $this->db->getConnection();

        // Thêm kiểm tra kết nối (tùy chọn nhưng nên có)
        if ($this->conn === null || $this->conn->connect_error) {
             // Xử lý lỗi kết nối ở đây, ví dụ: throw exception hoặc die()
             // Tránh die() trong class, nên throw exception để controller xử lý
             throw new Exception("Failed to connect to database in Product model.");
        }
    }

    // Lấy tất cả sản phẩm với pagination
    public function getAllProducts($page = 1, $perPage = 10) {
        $offset = ($page - 1) * $perPage;
        $products = [];
        $total = 0;
        $totalPages = 0;

        try {
            $query = "SELECT p.*,
                           s.processor, s.camera, s.battery, s.screen_description, s.RAM_ROM, s.sim_connectivity,
                           l.CPU, l.GPU, l.RAM, l.storage, l.screen_description AS laptop_screen, l.battery AS laptop_battery, l.ports
                    FROM products p
                    LEFT JOIN smartphones s ON p.product_id = s.product_id
                    LEFT JOIN laptops l ON p.product_id = l.product_id
                    ORDER BY p.created_at DESC
                    LIMIT ? OFFSET ?";
            $stmt = $this->conn->prepare($query);
            if ($stmt === false) {
                 throw new Exception("Prepare failed (getAllProducts): " . $this->conn->error);
            }
            $stmt->bind_param("ii", $perPage, $offset);
            $stmt->execute();
            $result = $stmt->get_result();

            while ($row = $result->fetch_assoc()) {
                $products[] = $this->formatProduct($row);
            }
            $stmt->close(); // Đóng statement

            // Lấy tổng số bản ghi để tính tổng số trang
            $countQuery = "SELECT COUNT(*) as total FROM products";
            $countResult = $this->conn->query($countQuery);
             if ($countResult === false) {
                 throw new Exception("Query failed (getAllProducts count): " . $this->conn->error);
            }
            $totalRow = $countResult->fetch_assoc();
            $total = $totalRow ? (int)$totalRow['total'] : 0;
            $totalPages = ceil($total / $perPage);
            $countResult->free(); // Giải phóng kết quả

        } catch (Exception $e) {
            // Xử lý lỗi (ví dụ: log lỗi, trả về mảng rỗng hoặc thông báo lỗi)
            error_log("Database error in getAllProducts: " . $e->getMessage()); // Ghi log lỗi
            // Có thể throw lại lỗi để controller xử lý hoặc trả về cấu trúc lỗi
            // return ['error' => $e->getMessage()];
             return [
                'data' => [],
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $perPage,
                    'total_items' => 0,
                    'total_pages' => 0
                ],
                 'error' => 'Could not fetch products.' // Thông báo lỗi chung chung cho client
            ];
        }

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
        $smartphones = [];
        $total = 0;
        $totalPages = 0;

         try {
            $query = "SELECT p.*, s.*
                      FROM products p
                      JOIN smartphones s ON p.product_id = s.product_id
                      ORDER BY p.created_at DESC
                      LIMIT ? OFFSET ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (getAllSmartphones): " . $this->conn->error);
            }
            $stmt->bind_param("ii", $perPage, $offset);
            $stmt->execute();
            $result = $stmt->get_result();

            while ($row = $result->fetch_assoc()) {
                $smartphones[] = $this->formatSmartphone($row);
            }
             $stmt->close();

            $countQuery = "SELECT COUNT(*) as total FROM products p JOIN smartphones s ON p.product_id = s.product_id";
            $countResult = $this->conn->query($countQuery);
             if ($countResult === false) {
                 throw new Exception("Query failed (getAllSmartphones count): " . $this->conn->error);
            }
            $totalRow = $countResult->fetch_assoc();
            $total = $totalRow ? (int)$totalRow['total'] : 0;
            $totalPages = ceil($total / $perPage);
             $countResult->free();

        } catch (Exception $e) {
            error_log("Database error in getAllSmartphones: " . $e->getMessage());
             return [
                'data' => [],
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $perPage,
                    'total_items' => 0,
                    'total_pages' => 0
                ],
                 'error' => 'Could not fetch smartphones.'
            ];
        }

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
        $laptops = [];
        $total = 0;
        $totalPages = 0;

         try {
            $query = "SELECT p.*, l.*
                      FROM products p
                      JOIN laptops l ON p.product_id = l.product_id
                      ORDER BY p.created_at DESC
                      LIMIT ? OFFSET ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (getAllLaptops): " . $this->conn->error);
            }
            $stmt->bind_param("ii", $perPage, $offset);
            $stmt->execute();
            $result = $stmt->get_result();

            while ($row = $result->fetch_assoc()) {
                $laptops[] = $this->formatLaptop($row);
            }
             $stmt->close();

            $countQuery = "SELECT COUNT(*) as total FROM products p JOIN laptops l ON p.product_id = l.product_id";
            $countResult = $this->conn->query($countQuery);
             if ($countResult === false) {
                 throw new Exception("Query failed (getAllLaptops count): " . $this->conn->error);
            }
            $totalRow = $countResult->fetch_assoc();
            $total = $totalRow ? (int)$totalRow['total'] : 0;
            $totalPages = ceil($total / $perPage);
             $countResult->free();

        } catch (Exception $e) {
            error_log("Database error in getAllLaptops: " . $e->getMessage());
             return [
                'data' => [],
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $perPage,
                    'total_items' => 0,
                    'total_pages' => 0
                ],
                 'error' => 'Could not fetch laptops.'
            ];
        }

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
         try {
            $query = "SELECT p.*,
                           s.processor, s.camera, s.battery, s.screen_description, s.RAM_ROM, s.sim_connectivity,
                           l.CPU, l.GPU, l.RAM, l.storage, l.screen_description AS laptop_screen, l.battery AS laptop_battery, l.ports
                    FROM products p
                    LEFT JOIN smartphones s ON p.product_id = s.product_id
                    LEFT JOIN laptops l ON p.product_id = l.product_id
                    WHERE p.product_id = ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (getProductById): " . $this->conn->error);
            }
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $product = $result->fetch_assoc();
             $stmt->close();

            return $this->formatProduct($product); // formatProduct sẽ trả về null nếu $product là false/null

        } catch (Exception $e) {
            error_log("Database error in getProductById: " . $e->getMessage());
            return null; // Hoặc trả về một thông báo lỗi
        }
    }

    // Lấy sản phẩm theo tên (không cần pagination)
    public function getProductByName($name) {
         try {
            $query = "SELECT p.*,
                           s.processor, s.camera, s.battery, s.screen_description, s.RAM_ROM, s.sim_connectivity,
                           l.CPU, l.GPU, l.RAM, l.storage, l.screen_description AS laptop_screen, l.battery AS laptop_battery, l.ports
                    FROM products p
                    LEFT JOIN smartphones s ON p.product_id = s.product_id
                    LEFT JOIN laptops l ON p.product_id = l.product_id
                    WHERE p.name LIKE ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (getProductByName): " . $this->conn->error);
            }
            $name = "%" . $name . "%"; // Thêm ký tự % để tìm kiếm theo tên
            $stmt->bind_param("s", $name);
            $stmt->execute();
            $result = $stmt->get_result();
            $products = [];

            while ($row = $result->fetch_assoc()) {
                $products[] = $this->formatProduct($row);
            }
             $stmt->close();

            return $products; // Trả về danh sách sản phẩm tìm được

        } catch (Exception $e) {
            error_log("Database error in getProductByName: " . $e->getMessage());
            return null; // Hoặc trả về một thông báo lỗi
        }
    }

    // Thêm mới sản phẩm (chỉ vào bảng Products, chi tiết sẽ được thêm sau)
    public function createProduct($name, $description, $price, $stock, $rated_stars, $warranty_period, $manufacturer, $warranty_policy, $imageurl) {
         try {
            $query = "INSERT INTO products (name, description, price, stock, rated_stars, warranty_period, manufacturer, warranty_policy, imageurl)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (createProduct): " . $this->conn->error);
            }
            // Chú ý kiểu dữ liệu: rated_stars có thể là float/double (d) hoặc int (i)
            $stmt->bind_param("ssdiissss", $name, $description, $price, $stock, $rated_stars, $warranty_period, $manufacturer, $warranty_policy, $imageurl);

            if ($stmt->execute()) {
                $insertId = $this->conn->insert_id;
                 $stmt->close();
                return $insertId; // Trả về product_id vừa tạo
            } else {
                 $error = $stmt->error;
                 $stmt->close();
                throw new Exception("Execute failed (createProduct): " . $error);
            }
        } catch (Exception $e) {
            error_log("Database error in createProduct: " . $e->getMessage());
            return false;
        }
    }

    // Thêm chi tiết smartphone
    public function createSmartphone($product_id, $processor, $camera, $battery, $screen_description, $ram_rom, $sim_connectivity) {
         try {
            $query = "INSERT INTO smartphones (product_id, processor, camera, battery, screen_description, RAM_ROM, sim_connectivity)
                      VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (createSmartphone): " . $this->conn->error);
            }
            $stmt->bind_param("issssss", $product_id, $processor, $camera, $battery, $screen_description, $ram_rom, $sim_connectivity);
            $success = $stmt->execute();
             $error = $stmt->error; // Lấy lỗi trước khi đóng
             $stmt->close();
             if (!$success) {
                 throw new Exception("Execute failed (createSmartphone): " . $error);
             }
            return $success;
        } catch (Exception $e) {
            error_log("Database error in createSmartphone: " . $e->getMessage());
            return false;
        }
    }

    // Thêm chi tiết laptop
    public function createLaptop($product_id, $cpu, $gpu, $ram, $storage, $screen_description, $battery, $ports) {
         try {
            $query = "INSERT INTO laptops (product_id, CPU, GPU, RAM, storage, screen_description, battery, ports)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (createLaptop): " . $this->conn->error);
            }
            $stmt->bind_param("isssssss", $product_id, $cpu, $gpu, $ram, $storage, $screen_description, $battery, $ports);
             $success = $stmt->execute();
             $error = $stmt->error;
             $stmt->close();
             if (!$success) {
                 throw new Exception("Execute failed (createLaptop): " . $error);
             }
            return $success;
        } catch (Exception $e) {
            error_log("Database error in createLaptop: " . $e->getMessage());
            return false;
        }
    }

    // Cập nhật sản phẩm (chỉ bảng Products)
    public function updateProduct($id, $name, $description, $price, $stock, $rated_stars, $warranty_period, $manufacturer, $warranty_policy, $imageurl) {
         try {
            $query = "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, rated_stars = ?, warranty_period = ?, manufacturer = ?, warranty_policy = ?, imageurl = ? WHERE product_id = ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (updateProduct): " . $this->conn->error);
            }
             // Chú ý kiểu dữ liệu: rated_stars có thể là float/double (d) hoặc int (i)
            $stmt->bind_param("ssdiissssi", $name, $description, $price, $stock, $rated_stars, $warranty_period, $manufacturer, $warranty_policy, $imageurl, $id);
             $success = $stmt->execute();
             $error = $stmt->error;
             $stmt->close();
             if (!$success) {
                 throw new Exception("Execute failed (updateProduct): " . $error);
             }
            return $success;
        } catch (Exception $e) {
            error_log("Database error in updateProduct: " . $e->getMessage());
            return false;
        }
    }

    // Cập nhật chi tiết smartphone
    public function updateSmartphone($product_id, $processor, $camera, $battery, $screen_description, $ram_rom, $sim_connectivity) {
         try {
            $query = "UPDATE smartphones SET processor = ?, camera = ?, battery = ?, screen_description = ?, RAM_ROM = ?, sim_connectivity = ? WHERE product_id = ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (updateSmartphone): " . $this->conn->error);
            }
            $stmt->bind_param("ssssssi", $processor, $camera, $battery, $screen_description, $ram_rom, $sim_connectivity, $product_id);
             $success = $stmt->execute();
             $error = $stmt->error;
             $stmt->close();
             if (!$success) {
                 throw new Exception("Execute failed (updateSmartphone): " . $error);
             }
            return $success;
        } catch (Exception $e) {
            error_log("Database error in updateSmartphone: " . $e->getMessage());
            return false;
        }
    }

    // Cập nhật chi tiết laptop
    public function updateLaptop($product_id, $cpu, $gpu, $ram, $storage, $screen_description, $battery, $ports) {
         try {
            $query = "UPDATE laptops SET CPU = ?, GPU = ?, RAM = ?, storage = ?, screen_description = ?, battery = ?, ports = ? WHERE product_id = ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (updateLaptop): " . $this->conn->error);
            }
            $stmt->bind_param("sssssssi", $cpu, $gpu, $ram, $storage, $screen_description, $battery, $ports, $product_id);
             $success = $stmt->execute();
             $error = $stmt->error;
             $stmt->close();
             if (!$success) {
                 throw new Exception("Execute failed (updateLaptop): " . $error);
             }
            return $success;
        } catch (Exception $e) {
            error_log("Database error in updateLaptop: " . $e->getMessage());
            return false;
        }
    }

    // Xóa sản phẩm (cả bảng Products và các bảng con sẽ tự động xóa nhờ ON DELETE CASCADE)
    public function deleteProduct($id) {
         try {
            $query = "DELETE FROM products WHERE product_id = ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (deleteProduct): " . $this->conn->error);
            }
            $stmt->bind_param("i", $id);
             $success = $stmt->execute();
             $error = $stmt->error;
             $stmt->close();
             if (!$success) {
                 throw new Exception("Execute failed (deleteProduct): " . $error);
             }
            return $success;
        } catch (Exception $e) {
            error_log("Database error in deleteProduct: " . $e->getMessage());
            return false;
        }
    }

    // Format sản phẩm để đảm bảo dữ liệu nhất quán
    private function formatProduct($row) {
        if (!$row) return null;

        $product = [
            'product_id' => isset($row['product_id']) ? (int)$row['product_id'] : null,
            'name' => isset($row['name']) ? $row['name'] : null,
            'description' => isset($row['description']) ? $row['description'] : null,
            'price' => isset($row['price']) ? (float)$row['price'] : null,
            'stock' => isset($row['stock']) ? (int)$row['stock'] : null,
            'rated_stars' => isset($row['rated_stars']) ? (float)$row['rated_stars'] : null,
            'warranty_period' => isset($row['warranty_period']) ? $row['warranty_period'] : null,
            'manufacturer' => isset($row['manufacturer']) ? $row['manufacturer'] : null,
            'warranty_policy' => isset($row['warranty_policy']) ? $row['warranty_policy'] : null,
            'imageurl' => isset($row['imageurl']) ? $row['imageurl'] : null,
            'created_at' => isset($row['created_at']) ? $row['created_at'] : null
        ];

        // Thêm thông tin chi tiết nếu là smartphone (kiểm tra cột đặc trưng của smartphone)
        if (isset($row['processor']) && $row['processor'] !== null) {
            $product['details'] = [
                'type' => 'smartphone',
                'processor' => $row['processor'],
                'camera' => isset($row['camera']) ? $row['camera'] : null,
                'battery' => isset($row['battery']) ? $row['battery'] : null, // Cột battery chung
                'screen_description' => isset($row['screen_description']) ? $row['screen_description'] : null, // Cột screen_description chung
                'RAM_ROM' => isset($row['RAM_ROM']) ? $row['RAM_ROM'] : null,
                'sim_connectivity' => isset($row['sim_connectivity']) ? $row['sim_connectivity'] : null
            ];
        }
        // Thêm thông tin chi tiết nếu là laptop (kiểm tra cột đặc trưng của laptop)
        elseif (isset($row['CPU']) && $row['CPU'] !== null) {
            $product['details'] = [
                'type' => 'laptop',
                'CPU' => $row['CPU'],
                'GPU' => isset($row['GPU']) ? $row['GPU'] : null,
                'RAM' => isset($row['RAM']) ? $row['RAM'] : null,
                'storage' => isset($row['storage']) ? $row['storage'] : null,
                'screen_description' => isset($row['laptop_screen']) ? $row['laptop_screen'] : null, // Dùng alias laptop_screen
                'battery' => isset($row['laptop_battery']) ? $row['laptop_battery'] : null, // Dùng alias laptop_battery
                'ports' => isset($row['ports']) ? $row['ports'] : null
            ];
        } else {
             // Nếu không có chi tiết smartphone hay laptop, có thể set details là null hoặc {}
             $product['details'] = null;
        }


        return $product;
    }

    // Format smartphone
    private function formatSmartphone($row) {
        if (!$row) return null;

        return [
            'product_id' => isset($row['product_id']) ? (int)$row['product_id'] : null,
            'name' => isset($row['name']) ? $row['name'] : null,
            'description' => isset($row['description']) ? $row['description'] : null,
            'price' => isset($row['price']) ? (float)$row['price'] : null,
            'stock' => isset($row['stock']) ? (int)$row['stock'] : null,
            'rated_stars' => isset($row['rated_stars']) ? (float)$row['rated_stars'] : null,
            'warranty_period' => isset($row['warranty_period']) ? $row['warranty_period'] : null,
            'manufacturer' => isset($row['manufacturer']) ? $row['manufacturer'] : null,
            'warranty_policy' => isset($row['warranty_policy']) ? $row['warranty_policy'] : null,
            'imageurl' => isset($row['imageurl']) ? $row['imageurl'] : null,
            'created_at' => isset($row['created_at']) ? $row['created_at'] : null,
            'details' => [
                'type' => 'smartphone',
                'processor' => isset($row['processor']) ? $row['processor'] : null,
                'camera' => isset($row['camera']) ? $row['camera'] : null,
                'battery' => isset($row['battery']) ? $row['battery'] : null,
                'screen_description' => isset($row['screen_description']) ? $row['screen_description'] : null,
                'RAM_ROM' => isset($row['RAM_ROM']) ? $row['RAM_ROM'] : null,
                'sim_connectivity' => isset($row['sim_connectivity']) ? $row['sim_connectivity'] : null
            ]
        ];
    }

    // Format laptop
    private function formatLaptop($row) {
        if (!$row) return null;

        return [
            'product_id' => isset($row['product_id']) ? (int)$row['product_id'] : null,
            'name' => isset($row['name']) ? $row['name'] : null,
            'description' => isset($row['description']) ? $row['description'] : null,
            'price' => isset($row['price']) ? (float)$row['price'] : null,
            'stock' => isset($row['stock']) ? (int)$row['stock'] : null,
            'rated_stars' => isset($row['rated_stars']) ? (float)$row['rated_stars'] : null,
            'warranty_period' => isset($row['warranty_period']) ? $row['warranty_period'] : null,
            'manufacturer' => isset($row['manufacturer']) ? $row['manufacturer'] : null,
            'warranty_policy' => isset($row['warranty_policy']) ? $row['warranty_policy'] : null,
            'imageurl' => isset($row['imageurl']) ? $row['imageurl'] : null,
            'created_at' => isset($row['created_at']) ? $row['created_at'] : null,
            'details' => [
                'type' => 'laptop',
                'CPU' => isset($row['CPU']) ? $row['CPU'] : null,
                'GPU' => isset($row['GPU']) ? $row['GPU'] : null,
                'RAM' => isset($row['RAM']) ? $row['RAM'] : null,
                'storage' => isset($row['storage']) ? $row['storage'] : null,
                // Sử dụng tên cột gốc từ bảng laptops nếu không có alias trong câu SELECT cụ thể
                'screen_description' => isset($row['screen_description']) ? $row['screen_description'] : null,
                'battery' => isset($row['battery']) ? $row['battery'] : null,
                'ports' => isset($row['ports']) ? $row['ports'] : null
            ]
        ];
    }


    // Không cần thiết phải gọi closeConnection trong __destruct
    // vì kết nối thường được quản lý trong suốt vòng đời request
    // và có thể được đóng bởi PHP khi script kết thúc.
    // public function __destruct() {
    //     // $this->db->closeConnection(); // Có thể gây lỗi nếu instance đã bị đóng ở nơi khác
    // }
}
?>
