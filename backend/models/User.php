<?php
require_once __DIR__ . '/../utils/Database.php';

class User {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = Database::getInstance(); // Sử dụng Singleton
        $this->conn = $this->db->getConnection();
    }

    // Đăng ký người dùng mới (mặc định là customer)
    public function register($first_name, $last_name, $username, $password, $email, $phone_number, $address) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
        $this->conn->begin_transaction();
    
        try {
            $query = "INSERT INTO users (first_name, last_name, username, password, email, phone_number, address, imageurl) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, 'https://example.com/default.jpg')";
            $stmt = $this->conn->prepare($query);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }
            $stmt->bind_param("sssssss", $first_name, $last_name, $username, $hashed_password, $email, $phone_number, $address);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }
            $user_id = $this->conn->insert_id;
    
            $membership_level = 'basic';
            $customer_query = "INSERT INTO customers (user_id, membership_level) VALUES (?, ?)";
            $customer_stmt = $this->conn->prepare($customer_query);
            if (!$customer_stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }
            $customer_stmt->bind_param("is", $user_id, $membership_level);
            if (!$customer_stmt->execute()) {
                throw new Exception("Execute failed: " . $customer_stmt->error);
            }
    
            $this->conn->commit();
            return $user_id;
    
        } catch (Exception $e) {
            $this->conn->rollback();
            error_log("Register error: " . $e->getMessage()); // Ghi log lỗi
            return false;
        }
    }

    // Đăng nhập
    public function login($username_or_email, $password) {
        $query = "SELECT u.*, c.membership_level, a.user_id IS NOT NULL as is_admin 
                  FROM users u 
                  LEFT JOIN customers c ON u.user_id = c.user_id 
                  LEFT JOIN admins a ON u.user_id = a.user_id 
                  WHERE u.username = ? OR u.email = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $username_or_email, $username_or_email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($user = $result->fetch_assoc()) {
            if (password_verify($password, $user['password'])) {
                unset($user['password']); // Không trả về mật khẩu
                return $user;
            }
        }

        return false;
    }

    // Lấy thông tin người dùng theo ID (bao gồm vai trò)
    public function getUserById($id) {
        $query = "SELECT u.*, c.membership_level, a.user_id IS NOT NULL as is_admin 
                  FROM users u 
                  LEFT JOIN customers c ON u.user_id = c.user_id 
                  LEFT JOIN admins a ON u.user_id = a.user_id 
                  WHERE u.user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $user = $result->fetch_assoc();
        if ($user) {
            unset($user['password']); // Không trả về mật khẩu
            return $user;
        }

        return null;
    }

    // Cập nhật thông tin người dùng
    public function updateUser($id, $first_name, $last_name, $username, $email, $phone_number, $address, $password = null, $imageurl = null) {
        $this->conn->begin_transaction();

        try {
            // Cập nhật bảng Users
            if ($password) {
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $query = "UPDATE users SET first_name = ?, last_name = ?, username = ?, email = ?, phone_number = ?, address = ?, password = ?, imageurl = ? WHERE user_id = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param("ssssssssi", $first_name, $last_name, $username, $email, $phone_number, $address, $hashed_password, $imageurl, $id);
            } else {
                $query = "UPDATE users SET first_name = ?, last_name = ?, username = ?, email = ?, phone_number = ?, address = ?, imageurl = ? WHERE user_id = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param("sssssssi", $first_name, $last_name, $username, $email, $phone_number, $address, $imageurl, $id);
            }
            $stmt->execute();

            // Cập nhật hoặc kiểm tra vai trò (nếu cần)
            $this->ensureRoleExists($id);

            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            $this->conn->rollback();
            return false;
        }
    }

    // Đảm bảo vai trò (customer hoặc admin) tồn tại
    private function ensureRoleExists($user_id) {
        $check_query = "SELECT COUNT(*) as count FROM customers WHERE user_id = ? UNION SELECT COUNT(*) FROM admins WHERE user_id = ?";
        $stmt = $this->conn->prepare($check_query);
        $stmt->bind_param("ii", $user_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $counts = [];
        while ($row = $result->fetch_assoc()) {
            $counts[] = $row['count'];
        }

        if ($counts[0] == 0 && $counts[1] == 0) {
            // Mặc định thêm vào customers nếu không có vai trò nào
            $query = "INSERT INTO customers (user_id, membership_level) VALUES (?, 'basic')";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
        }
    }

    // Cập nhật cấp độ thành viên cho khách hàng
    public function updateMembershipLevel($user_id, $membership_level) {
        $query = "UPDATE customers SET membership_level = ? WHERE user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("si", $membership_level, $user_id);

        return $stmt->execute();
    }

    // Chuyển người dùng thành admin
    public function makeAdmin($user_id) {
        $this->conn->begin_transaction();

        try {
            // Xóa khỏi customers nếu tồn tại
            $delete_query = "DELETE FROM customers WHERE user_id = ?";
            $delete_stmt = $this->conn->prepare($delete_query);
            $delete_stmt->bind_param("i", $user_id);
            $delete_stmt->execute();

            // Thêm vào admins
            $insert_query = "INSERT INTO admins (user_id) VALUES (?)";
            $insert_stmt = $this->conn->prepare($insert_query);
            $insert_stmt->bind_param("i", $user_id);
            $insert_stmt->execute();

            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            $this->conn->rollback();
            return false;
        }
    }

    // Xóa người dùng (cả vai trò sẽ tự động xóa nhờ ON DELETE CASCADE)
    public function deleteUser($id) {
        $query = "DELETE FROM users WHERE user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);

        return $stmt->execute();
    }

    public function __destruct() {
        $this->db->closeConnection();
    }
}
?>
