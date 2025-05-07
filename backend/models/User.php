<?php
// Đảm bảo các require_once này đúng và đã được sửa bằng __DIR__ nếu cần
require_once __DIR__ . '/../utils/Database.php';

class User {
    private $db;     // Nên lưu instance của Database Singleton
    private $conn;   // Lưu kết nối mysqli

    public function __construct() {
        // *** SỬA LỖI Ở ĐÂY: Sử dụng getInstance() thay vì new Database() ***
        $this->db = Database::getInstance();
        $this->conn = $this->db->getConnection();

        // Thêm kiểm tra kết nối (quan trọng)
        if ($this->conn === null || $this->conn->connect_error) {
             // Ném Exception để Controller hoặc API router có thể bắt và xử lý
             throw new Exception("Database connection failed in User model: " . ($this->conn ? $this->conn->connect_error : 'Connection object is null'));
        }
    }

    // Đăng ký người dùng mới (mặc định là customer)
    public function register($first_name, $last_name, $username, $password, $email, $phone_number, $address) {
        // Mã hóa mật khẩu
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        // Ảnh mặc định
        $default_imageurl = 'https://example.com/default.jpg'; // Hoặc null nếu cho phép

        // Bắt đầu transaction
        $this->conn->begin_transaction();

        try {
            // Thêm vào bảng Users
            $query = "INSERT INTO users (first_name, last_name, username, password, email, phone_number, address, imageurl)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            if ($stmt === false) {
                 throw new Exception("Prepare failed (register user): " . $this->conn->error);
            }
            // Đảm bảo kiểu dữ liệu đúng (8 chuỗi 's')
            $stmt->bind_param("ssssssss", $first_name, $last_name, $username, $hashed_password, $email, $phone_number, $address, $default_imageurl);

            if (!$stmt->execute()) {
                $error = $stmt->error;
                $stmt->close();
                // Kiểm tra lỗi trùng lặp username/email nếu có constraint
                if ($this->conn->errno == 1062) { // Mã lỗi MySQL cho duplicate entry
                    throw new Exception("Username or Email already exists.");
                }
                throw new Exception("Execute failed (register user): " . $error);
            }
            $user_id = $this->conn->insert_id;
            $stmt->close();

            // Thêm vào bảng Customers (mặc định)
            $membership_level = 'basic';
            $customer_query = "INSERT INTO customers (user_id, membership_level) VALUES (?, ?)";
            $customer_stmt = $this->conn->prepare($customer_query);
             if ($customer_stmt === false) {
                 throw new Exception("Prepare failed (register customer): " . $this->conn->error);
            }
            $customer_stmt->bind_param("is", $user_id, $membership_level);

            if (!$customer_stmt->execute()) {
                 $error = $customer_stmt->error;
                 $customer_stmt->close();
                throw new Exception("Execute failed (register customer): " . $error);
            }
             $customer_stmt->close();

            // Commit transaction nếu mọi thứ thành công
            $this->conn->commit();
            return $user_id; // Trả về ID người dùng mới

        } catch (Exception $e) {
            // Rollback transaction nếu có lỗi
            $this->conn->rollback();
            error_log("Registration error: " . $e->getMessage()); // Ghi log lỗi
            // Ném lại lỗi để controller xử lý và trả về thông báo phù hợp
            throw $e; // Re-throw the exception
        }
    }

    // Đăng nhập
    public function login($username_or_email, $password) {
        try {
            $query = "SELECT u.*, c.membership_level, a.user_id IS NOT NULL as is_admin
                      FROM users u
                      LEFT JOIN customers c ON u.user_id = c.user_id
                      LEFT JOIN admins a ON u.user_id = a.user_id
                      WHERE u.username = ? OR u.email = ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (login): " . $this->conn->error);
            }
            $stmt->bind_param("ss", $username_or_email, $username_or_email);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();

            if ($user && password_verify($password, $user['password'])) {
                unset($user['password']); // Không trả về mật khẩu hash
                return $user; // Trả về thông tin user nếu đăng nhập thành công
            }

            return false; // Sai username/email hoặc mật khẩu

        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            return false; // Trả về false nếu có lỗi xảy ra
        }
    }

    // Lấy thông tin người dùng theo ID (bao gồm vai trò)
    public function getUserById($id) {
         try {
            $query = "SELECT u.*, c.membership_level, a.user_id IS NOT NULL as is_admin
                      FROM users u
                      LEFT JOIN customers c ON u.user_id = c.user_id
                      LEFT JOIN admins a ON u.user_id = a.user_id
                      WHERE u.user_id = ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (getUserById): " . $this->conn->error);
            }
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            $stmt->close();

            if ($user) {
                unset($user['password']);
                return $user;
            }
            return null; // Không tìm thấy user

        } catch (Exception $e) {
            error_log("Get user by ID error: " . $e->getMessage());
            return null;
        }
    }

    // Cập nhật thông tin người dùng
    public function updateUser($id, $first_name, $last_name, $username, $email, $phone_number, $address, $password = null, $imageurl = null) {
        // Bắt đầu transaction (mặc dù chỉ update 1 bảng chính, vẫn nên dùng nếu có logic phức tạp hơn sau này)
        $this->conn->begin_transaction();

        try {
            $params = [];
            $types = "";
            $sql_parts = [];

            // Xây dựng câu query động dựa trên các trường được cung cấp
            if ($first_name !== null) { $sql_parts[] = "first_name = ?"; $params[] = $first_name; $types .= "s"; }
            if ($last_name !== null) { $sql_parts[] = "last_name = ?"; $params[] = $last_name; $types .= "s"; }
            if ($username !== null) { $sql_parts[] = "username = ?"; $params[] = $username; $types .= "s"; }
            if ($email !== null) { $sql_parts[] = "email = ?"; $params[] = $email; $types .= "s"; }
            if ($phone_number !== null) { $sql_parts[] = "phone_number = ?"; $params[] = $phone_number; $types .= "s"; }
            if ($address !== null) { $sql_parts[] = "address = ?"; $params[] = $address; $types .= "s"; }
            if ($imageurl !== null) { $sql_parts[] = "imageurl = ?"; $params[] = $imageurl; $types .= "s"; }
            if ($password !== null) {
                 $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                 $sql_parts[] = "password = ?"; $params[] = $hashed_password; $types .= "s";
            }

            // Nếu không có trường nào để cập nhật
            if (empty($sql_parts)) {
                $this->conn->rollback(); // Không cần commit gì cả
                return true; // Hoặc false tùy logic bạn muốn (không có gì thay đổi)
            }

            $query = "UPDATE users SET " . implode(", ", $sql_parts) . " WHERE user_id = ?";
            $params[] = $id; // Thêm user_id vào cuối
            $types .= "i";

            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (updateUser): " . $this->conn->error);
            }
            // Bind params động
            $stmt->bind_param($types, ...$params);

            if (!$stmt->execute()) {
                 $error = $stmt->error;
                 $stmt->close();
                 // Kiểm tra lỗi trùng lặp username/email nếu có constraint
                 if ($this->conn->errno == 1062) {
                     throw new Exception("Username or Email already exists.");
                 }
                throw new Exception("Execute failed (updateUser): " . $error);
            }
             $stmt->close();

            // Không cần gọi ensureRoleExists ở đây trừ khi bạn muốn thay đổi vai trò khi update
            // $this->ensureRoleExists($id);

            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            $this->conn->rollback();
            error_log("Update user error: " . $e->getMessage());
             throw $e; // Ném lại lỗi
        }
    }

    // Đảm bảo vai trò (customer hoặc admin) tồn tại - Có thể không cần thiết nếu logic đăng ký luôn tạo role
    private function ensureRoleExists($user_id) {
        // Logic này có thể cần xem xét lại tùy thuộc vào luồng ứng dụng
        // Ví dụ: Nếu admin có thể được tạo trực tiếp mà không qua đăng ký customer trước?
        try {
            $check_query = "SELECT
                                (SELECT COUNT(*) FROM customers WHERE user_id = ?) as customer_count,
                                (SELECT COUNT(*) FROM admins WHERE user_id = ?) as admin_count";
            $stmt = $this->conn->prepare($check_query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (ensureRoleExists check): " . $this->conn->error);
            }
            $stmt->bind_param("ii", $user_id, $user_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $counts = $result->fetch_assoc();
            $stmt->close();

            if ($counts && $counts['customer_count'] == 0 && $counts['admin_count'] == 0) {
                // Mặc định thêm vào customers nếu không có vai trò nào
                $query = "INSERT INTO customers (user_id, membership_level) VALUES (?, 'basic')";
                $insert_stmt = $this->conn->prepare($query);
                 if ($insert_stmt === false) {
                     throw new Exception("Prepare failed (ensureRoleExists insert): " . $this->conn->error);
                 }
                $insert_stmt->bind_param("i", $user_id);
                if (!$insert_stmt->execute()) {
                     $error = $insert_stmt->error;
                     $insert_stmt->close();
                     throw new Exception("Execute failed (ensureRoleExists insert): " . $error);
                 }
                 $insert_stmt->close();
            }
        } catch (Exception $e) {
             error_log("Ensure role exists error for user {$user_id}: " . $e->getMessage());
             // Quyết định xem có nên throw lỗi này ra ngoài không
             // throw $e;
        }
    }

    // Cập nhật cấp độ thành viên cho khách hàng
    public function updateMembershipLevel($user_id, $membership_level) {
         try {
            $query = "UPDATE customers SET membership_level = ? WHERE user_id = ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (updateMembershipLevel): " . $this->conn->error);
            }
            $stmt->bind_param("si", $membership_level, $user_id);
             $success = $stmt->execute();
             $error = $stmt->error;
             $stmt->close();
             if (!$success) {
                 throw new Exception("Execute failed (updateMembershipLevel): " . $error);
             }
            return $success;
        } catch (Exception $e) {
            error_log("Update membership level error: " . $e->getMessage());
             throw $e;
        }
    }

    // Chuyển người dùng thành admin
    public function makeAdmin($user_id) {
        $this->conn->begin_transaction();
        try {
            // Xóa khỏi customers nếu tồn tại
            $delete_query = "DELETE FROM customers WHERE user_id = ?";
            $delete_stmt = $this->conn->prepare($delete_query);
             if ($delete_stmt === false) {
                 throw new Exception("Prepare failed (makeAdmin delete): " . $this->conn->error);
            }
            $delete_stmt->bind_param("i", $user_id);
            $delete_stmt->execute(); // Không cần kiểm tra lỗi ở đây vì user có thể không phải là customer
            $delete_stmt->close();

            // Thêm vào admins (Sử dụng INSERT IGNORE để tránh lỗi nếu đã là admin)
            $insert_query = "INSERT IGNORE INTO admins (user_id) VALUES (?)";
            $insert_stmt = $this->conn->prepare($insert_query);
             if ($insert_stmt === false) {
                 throw new Exception("Prepare failed (makeAdmin insert): " . $this->conn->error);
            }
            $insert_stmt->bind_param("i", $user_id);
            if (!$insert_stmt->execute()) {
                 $error = $insert_stmt->error;
                 $insert_stmt->close();
                 throw new Exception("Execute failed (makeAdmin insert): " . $error);
             }
             $insert_stmt->close();

            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            $this->conn->rollback();
            error_log("Make admin error: " . $e->getMessage());
             throw $e;
        }
    }

    // Xóa người dùng (cả vai trò sẽ tự động xóa nhờ ON DELETE CASCADE trong DB)
    public function deleteUser($id) {
        try {
            $query = "DELETE FROM users WHERE user_id = ?";
            $stmt = $this->conn->prepare($query);
             if ($stmt === false) {
                 throw new Exception("Prepare failed (deleteUser): " . $this->conn->error);
            }
            $stmt->bind_param("i", $id);
             $success = $stmt->execute();
             $error = $stmt->error;
             $stmt->close();
             if (!$success) {
                 throw new Exception("Execute failed (deleteUser): " . $error);
             }
            // Kiểm tra xem có hàng nào bị ảnh hưởng không
            return $this->conn->affected_rows > 0;

        } catch (Exception $e) {
            error_log("Delete user error: " . $e->getMessage());
             throw $e;
        }
    }

    // Không cần __destruct để đóng kết nối vì Database Singleton sẽ quản lý
    // public function __destruct() {
    //     // $this->db->closeConnection(); // Không cần thiết
    // }
}
?>
