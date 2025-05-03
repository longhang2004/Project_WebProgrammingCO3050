<?php
// Đảm bảo các require_once đúng và đã được sửa bằng __DIR__
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Response.php';

class UserController {
    private $user;
    private $response;

    public function __construct() {
        try {
            $this->user = new User(); // Model User đã được sửa để dùng DB Singleton
            $this->response = new Response();
        } catch (Exception $e) {
            // Xử lý lỗi nếu không khởi tạo được Model (ví dụ: lỗi kết nối DB trong constructor User)
            // Ghi log lỗi quan trọng hơn là echo trực tiếp ở đây
            error_log("Failed to instantiate UserController components: " . $e->getMessage());
            // Chuẩn bị sẵn một cách để trả lỗi từ controller nếu cần
            // Ví dụ: throw new Exception("Controller initialization failed.");
            // Hoặc set một trạng thái lỗi nội bộ
        }
    }

    public function register() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            // Kiểm tra dữ liệu JSON hợp lệ
            if (json_last_error() !== JSON_ERROR_NONE) {
                echo $this->response->error("Invalid JSON data received.", 400);
                return;
            }

            // Kiểm tra các trường bắt buộc
            $requiredFields = ['first_name', 'last_name', 'username', 'password', 'email', 'phone_number', 'address'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || trim($data[$field]) === '') {
                    echo $this->response->error("Missing required field: " . $field, 400);
                    return;
                }
            }

            // Validate email format
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                 echo $this->response->error("Invalid email format.", 400);
                 return;
            }
             // Validate password length (ví dụ)
             if (strlen($data['password']) < 6) {
                 echo $this->response->error("Password must be at least 6 characters long.", 400);
                 return;
             }


            // Gọi model để đăng ký
            $user_id = $this->user->register(
                $data['first_name'],
                $data['last_name'],
                $data['username'],
                $data['password'],
                $data['email'],
                $data['phone_number'],
                $data['address']
            );

             // Model sẽ throw Exception nếu lỗi, nên không cần kiểm tra $user_id === false ở đây nữa
             // Nếu không có exception, nghĩa là thành công
            echo $this->response->success(['message' => 'User registered successfully', 'user_id' => $user_id], 201); // 201 Created

        } catch (Exception $e) {
             // Bắt lỗi từ Model (ví dụ: trùng username/email, lỗi DB)
             // Trả về lỗi phù hợp cho client
             if ($e->getMessage() === "Username or Email already exists.") {
                 echo $this->response->error($e->getMessage(), 409); // 409 Conflict
             } else {
                 // Lỗi server khác
                 error_log("Registration Controller Error: " . $e->getMessage()); // Ghi log lỗi chi tiết
                 echo $this->response->error("Failed to register user due to an internal error.", 500);
             }
        }
    }

    public function login() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

             if (json_last_error() !== JSON_ERROR_NONE) {
                echo $this->response->error("Invalid JSON data received.", 400);
                return;
            }

            if (!isset($data['username_or_email']) || !isset($data['password'])) {
                echo $this->response->error("Missing username/email or password", 400);
                return;
            }

            $username_or_email = $data['username_or_email'];
            $password = $data['password'];

            $user = $this->user->login($username_or_email, $password);

            if ($user) {
                // *** SỬA LỖI: KHỞI TẠO VÀ LƯU SESSION ***
                // Đảm bảo session_start() được gọi trước khi thao tác với $_SESSION
                if (session_status() === PHP_SESSION_NONE) {
                    session_start();
                }

                // Lưu thông tin cần thiết vào session
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['is_admin'] = (bool)$user['is_admin']; // Lưu trạng thái admin
                // Bạn có thể lưu thêm thông tin khác nếu cần

                // Trả về thông tin user (đã bỏ password hash trong model) và thông báo thành công
                echo $this->response->success(['user' => $user, 'message' => 'Login successful']);
            } else {
                // Sai thông tin đăng nhập
                echo $this->response->error("Invalid username/email or password", 401); // 401 Unauthorized
            }
        } catch (Exception $e) {
             // Bắt lỗi từ Model (ví dụ: lỗi DB khi truy vấn)
             error_log("Login Controller Error: " . $e->getMessage());
             echo $this->response->error("Login failed due to an internal error.", 500);
        }
    }

    public function getUserById($id) {
        // Validate ID
        if (!is_numeric($id) || $id <= 0) {
             echo $this->response->error("Invalid User ID.", 400);
             return;
        }
        $userId = intval($id);

        try {
            $user = $this->user->getUserById($userId);
            if ($user) {
                echo $this->response->success($user);
            } else {
                echo $this->response->error("User not found", 404); // 404 Not Found
            }
        } catch (Exception $e) {
             error_log("Get User By ID Controller Error: " . $e->getMessage());
             echo $this->response->error("Failed to retrieve user information.", 500);
        }
    }

    public function updateUser($id) {
         // Validate ID
        if (!is_numeric($id) || $id <= 0) {
             echo $this->response->error("Invalid User ID.", 400);
             return;
        }
        $userId = intval($id);

        // --- Xác thực quyền ---
        // Chỉ cho phép admin hoặc chính user đó cập nhật thông tin của họ
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (!isset($_SESSION['user_id']) || ($_SESSION['user_id'] != $userId && !$_SESSION['is_admin'])) {
             echo $this->response->unauthorized("You are not authorized to update this user.");
             return;
        }
        // --- Kết thúc xác thực quyền ---


        try {
            $data = json_decode(file_get_contents("php://input"), true);

             if (json_last_error() !== JSON_ERROR_NONE) {
                echo $this->response->error("Invalid JSON data received.", 400);
                return;
            }

            // Lấy các trường dữ liệu (cho phép null để không bắt buộc cập nhật mọi trường)
            $first_name = isset($data['first_name']) ? trim($data['first_name']) : null;
            $last_name = isset($data['last_name']) ? trim($data['last_name']) : null;
            $username = isset($data['username']) ? trim($data['username']) : null;
            $email = isset($data['email']) ? trim($data['email']) : null;
            $phone_number = isset($data['phone_number']) ? trim($data['phone_number']) : null;
            $address = isset($data['address']) ? trim($data['address']) : null;
            $password = isset($data['password']) && $data['password'] !== '' ? $data['password'] : null; // Chỉ cập nhật nếu password không rỗng
            $imageurl = isset($data['imageurl']) ? trim($data['imageurl']) : null;

             // Validate dữ liệu nếu được cung cấp
             if ($email !== null && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                 echo $this->response->error("Invalid email format.", 400);
                 return;
             }
             if ($password !== null && strlen($password) < 6) {
                 echo $this->response->error("Password must be at least 6 characters long.", 400);
                 return;
             }
             // Thêm các validation khác nếu cần

            // Gọi model để cập nhật (Model đã được sửa để xử lý các trường null)
            $success = $this->user->updateUser(
                $userId, $first_name, $last_name, $username, $email,
                $phone_number, $address, $password, $imageurl
            );

            // Model sẽ throw Exception nếu lỗi
            echo $this->response->success(['message' => 'User updated successfully']);

        } catch (Exception $e) {
             if ($e->getMessage() === "Username or Email already exists.") {
                 echo $this->response->error($e->getMessage(), 409); // 409 Conflict
             } else {
                 error_log("Update User Controller Error: " . $e->getMessage());
                 echo $this->response->error("Failed to update user due to an internal error.", 500);
             }
        }
    }

    public function updateMembershipLevel($id) {
         // Validate ID
        if (!is_numeric($id) || $id <= 0) {
             echo $this->response->error("Invalid User ID.", 400);
             return;
        }
        $userId = intval($id);

         // --- Xác thực quyền (Chỉ admin?) ---
         if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
         if (!isset($_SESSION['user_id']) || !$_SESSION['is_admin']) {
             echo $this->response->unauthorized("Only administrators can update membership levels.");
             return;
         }
         // --- Kết thúc xác thực quyền ---

        try {
            $data = json_decode(file_get_contents("php://input"), true);

             if (json_last_error() !== JSON_ERROR_NONE) {
                echo $this->response->error("Invalid JSON data received.", 400);
                return;
            }

            if (!isset($data['membership_level']) || trim($data['membership_level']) === '') {
                echo $this->response->error("Missing membership level", 400);
                return;
            }
            // Thêm validation cho giá trị membership_level nếu cần

            $membership_level = trim($data['membership_level']);

            $success = $this->user->updateMembershipLevel($userId, $membership_level);

            // Model sẽ throw Exception nếu lỗi
            echo $this->response->success(['message' => 'Membership level updated successfully']);

        } catch (Exception $e) {
             error_log("Update Membership Controller Error: " . $e->getMessage());
             echo $this->response->error("Failed to update membership level.", 500);
        }
    }

    public function makeAdmin($id) {
         // Validate ID
        if (!is_numeric($id) || $id <= 0) {
             echo $this->response->error("Invalid User ID.", 400);
             return;
        }
        $userId = intval($id);

         // --- Xác thực quyền (Chỉ admin?) ---
         if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
         if (!isset($_SESSION['user_id']) || !$_SESSION['is_admin']) {
             echo $this->response->unauthorized("Only administrators can promote users.");
             return;
         }
         // --- Kết thúc xác thực quyền ---

        try {
            $success = $this->user->makeAdmin($userId);

            // Model sẽ throw Exception nếu lỗi
            echo $this->response->success(['message' => 'User promoted to admin successfully']);

        } catch (Exception $e) {
             error_log("Make Admin Controller Error: " . $e->getMessage());
             echo $this->response->error("Failed to promote user to admin.", 500);
        }
    }

    public function deleteUser($id) {
        // Validate ID
        if (!is_numeric($id) || $id <= 0) {
             echo $this->response->error("Invalid User ID.", 400);
             return;
        }
        $userId = intval($id);

         // --- Xác thực quyền (Chỉ admin?) ---
         if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
         // Ngăn user tự xóa mình hoặc chỉ admin mới được xóa?
         if (!isset($_SESSION['user_id']) || !$_SESSION['is_admin']) { // Ví dụ: Chỉ admin được xóa
             echo $this->response->unauthorized("Only administrators can delete users.");
             return;
         }
         if ($_SESSION['user_id'] == $userId) { // Ví dụ: Admin không được tự xóa mình
             echo $this->response->error("Cannot delete your own account.", 403); // 403 Forbidden
             return;
         }
         // --- Kết thúc xác thực quyền ---

        try {
            $deleted = $this->user->deleteUser($userId);

            if ($deleted) {
                echo $this->response->success(['message' => 'User deleted successfully']);
            } else {
                 // Model trả về false nếu không tìm thấy user để xóa
                 echo $this->response->error("User not found or already deleted.", 404);
            }
        } catch (Exception $e) {
             error_log("Delete User Controller Error: " . $e->getMessage());
             echo $this->response->error("Failed to delete user.", 500);
        }
    }
}
?>
