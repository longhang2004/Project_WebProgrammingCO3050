<?php
// File: backend/controllers/UserController.php

// require_once __DIR__ . '/../models/User.php'; // Đã có
// require_once __DIR__ . '/../utils/Response.php'; // Đã có
require_once __DIR__ . '/../utils/JwtHelper.php'; // *** THÊM HELPER JWT ***

class UserController {
    private $user;
    private $response;
    // private $jwtHelper; // Không cần nếu dùng static methods

    public function __construct() {
        try {
            $this->user = new User();
            $this->response = new Response();
            // $this->jwtHelper = new JwtHelper(); // Không cần nếu dùng static methods
        } catch (Exception $e) {
            error_log("Failed to instantiate UserController components: " . $e->getMessage());
            if (!isset($this->response)) {
                 $this->response = new Response();
            }
        }
    }

    // --- register(), getUserById(), updateUser(), etc. giữ nguyên ---
    public function register() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            // Kiểm tra dữ liệu JSON hợp lệ
            if (json_last_error() !== JSON_ERROR_NONE) {
                // Sử dụng response object để trả lỗi chuẩn
                echo $this->response->error("Invalid JSON data received.", 400);
                return;
            }

            // Kiểm tra các trường bắt buộc
            $requiredFields = ['first_name', 'last_name', 'username', 'password', 'email', 'phone_number', 'address'];
            foreach ($requiredFields as $field) {
                // Kiểm tra cả isset và không rỗng sau khi trim
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
             // Có thể thêm các validation khác (username format, phone number format, etc.)

            // Gọi model để đăng ký
            $user_id = $this->user->register(
                trim($data['first_name']), // Trim dữ liệu trước khi gửi vào model
                trim($data['last_name']),
                trim($data['username']),
                $data['password'], // Không trim password
                trim($data['email']),
                trim($data['phone_number']),
                trim($data['address'])
            );

             // Model sẽ throw Exception nếu lỗi, nên không cần kiểm tra $user_id === false ở đây nữa
             // Nếu không có exception, nghĩa là thành công
            echo $this->response->success(['message' => 'User registered successfully', 'user_id' => $user_id], 201); // 201 Created

        } catch (Exception $e) {
             // Bắt lỗi từ Model (ví dụ: trùng username/email, lỗi DB) hoặc validation
             // Trả về lỗi phù hợp cho client
             if ($e->getMessage() === "Username or Email already exists.") {
                 echo $this->response->error($e->getMessage(), 409); // 409 Conflict
             } elseif ($e->getCode() == 400) { // Lỗi validation từ controller
                 echo $this->response->error($e->getMessage(), 400);
             }
             else {
                 // Lỗi server khác
                 error_log("Registration Controller Error: " . $e->getMessage()); // Ghi log lỗi chi tiết
                 echo $this->response->error("Failed to register user due to an internal error.", 500);
             }
        }
    }


    public function login() {
        // Bỏ các log liên quan đến session ID cũ
        // $before_login_session_id = session_id();
        // error_log("DEBUG UserController::login - Session ID BEFORE login check: " . $before_login_session_id);

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            if (json_last_error() !== JSON_ERROR_NONE) { throw new Exception("Invalid JSON data received.", 400); }
            if (!isset($data['username_or_email']) || !isset($data['password'])) { throw new Exception("Missing username/email or password", 400); }

            $username_or_email = $data['username_or_email'];
            $password = $data['password'];

            $user = $this->user->login($username_or_email, $password);

            if ($user) {
                // *** THAY THẾ SESSION BẰNG JWT ***

                // Bỏ các lệnh session cũ
                // session_regenerate_id(false);
                // $_SESSION['user_id'] = $user['user_id'];
                // $_SESSION['username'] = $user['username'];
                // $_SESSION['is_admin'] = (bool)$user['is_admin'];

                // Tạo payload cho JWT (chỉ chứa thông tin cần thiết)
                $jwtPayload = [
                    'user_id' => $user['user_id'],
                    'username' => $user['username'],
                    'is_admin' => (bool)$user['is_admin']
                    // iat, exp, iss sẽ được thêm tự động bởi JwtHelper::createJwt
                ];

                // Tạo token
                $token = JwtHelper::createJwt($jwtPayload);

                if (!$token) {
                    // Lỗi khi tạo token (đã được log trong JwtHelper)
                    throw new Exception("Failed to generate authentication token.", 500);
                }

                // Gửi phản hồi thành công với token và thông tin user (trừ password)
                unset($user['password']); // Đảm bảo password không bị lộ
                echo $this->response->success([
                    'user' => $user,
                    'token' => $token, // *** TRẢ TOKEN VỀ CHO FRONTEND ***
                    'message' => 'Login successful'
                ]);

            } else {
                error_log("DEBUG UserController::login - Invalid credentials for: " . $username_or_email);
                echo $this->response->error("Invalid username/email or password", 401);
            }
        } catch (Exception $e) {
             error_log("Login Controller Error: " . $e->getMessage());
             $statusCode = ($e->getCode() >= 400 && $e->getCode() < 500) ? $e->getCode() : 500;
             $errorMessage = ($statusCode === 500) ? "Login failed due to an internal error." : $e->getMessage();
             echo $this->response->error($errorMessage, $statusCode);
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
                echo $this->response->success($user); // Model đã unset password
            } else {
                echo $this->response->error("User not found", 404);
            }
        } catch (Exception $e) {
             error_log("Get User By ID Controller Error: " . $e->getMessage());
             echo $this->response->error("Failed to retrieve user information.", 500);
        }
     }

     // *** HÀM updateUser() CẦN XÁC THỰC BẰNG TOKEN THAY VÌ SESSION ***
     public function updateUser($id) {
        // Validate ID
        if (!is_numeric($id) || $id <= 0) {
             echo $this->response->error("Invalid User ID.", 400);
             return;
        }
        $userIdToUpdate = intval($id);

        // --- Xác thực quyền bằng Token ---
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
        $token = null;
        if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }

        if (!$token) {
            echo $this->response->unauthorized("Authentication token not found.");
            return;
        }

        $decodedPayload = JwtHelper::verifyJwt($token);
        if (!$decodedPayload) {
             echo $this->response->unauthorized("Invalid or expired token.");
             return;
        }

        $loggedInUserId = $decodedPayload['user_id'] ?? null;
        $isAdmin = $decodedPayload['is_admin'] ?? false;

        // Kiểm tra quyền: User chỉ được sửa profile của chính mình, hoặc phải là admin
        if ($loggedInUserId != $userIdToUpdate && !$isAdmin) {
             echo $this->response->unauthorized("You are not authorized to update this user.");
             return;
        }
        // --- Kết thúc xác thực quyền ---


        try {
            $data = json_decode(file_get_contents("php://input"), true);
             if (json_last_error() !== JSON_ERROR_NONE) { throw new Exception("Invalid JSON data received.", 400); }

            // Lấy các trường dữ liệu (cho phép null)
            $first_name = isset($data['first_name']) ? trim($data['first_name']) : null;
            $last_name = isset($data['last_name']) ? trim($data['last_name']) : null;
            $username = isset($data['username']) ? trim($data['username']) : null;
            $email = isset($data['email']) ? trim($data['email']) : null;
            $phone_number = isset($data['phone_number']) ? trim($data['phone_number']) : null;
            $address = isset($data['address']) ? trim($data['address']) : null;
            $password = isset($data['password']) && $data['password'] !== '' ? $data['password'] : null;
            $imageurl = isset($data['imageurl']) ? trim($data['imageurl']) : null;

             // Validate dữ liệu nếu được cung cấp
             if ($email !== null && !filter_var($email, FILTER_VALIDATE_EMAIL)) { throw new Exception("Invalid email format.", 400); }
             if ($password !== null && strlen($password) < 6) { throw new Exception("Password must be at least 6 characters long.", 400); }
             // Thêm các validation khác nếu cần

             // Kiểm tra xem có dữ liệu nào để cập nhật không
             if ($first_name === null && $last_name === null && $username === null && $email === null && $phone_number === null && $address === null && $password === null && $imageurl === null) {
                 echo $this->response->error("No data provided for update.", 400);
                 return;
             }

            // Gọi model để cập nhật
            $success = $this->user->updateUser( $userIdToUpdate, $first_name, $last_name, $username, $email, $phone_number, $address, $password, $imageurl );

            // Model sẽ throw Exception nếu lỗi
            echo $this->response->success(['message' => 'User updated successfully']);

        } catch (Exception $e) {
             if ($e->getMessage() === "Username or Email already exists.") { echo $this->response->error($e->getMessage(), 409); }
             elseif ($e->getCode() == 400) { echo $this->response->error($e->getMessage(), 400); }
             else { error_log("Update User Controller Error: " . $e->getMessage()); echo $this->response->error("Failed to update user due to an internal error.", 500); }
        }
     }

     // *** CÁC HÀM ADMIN KHÁC (updateMembershipLevel, makeAdmin, deleteUser) CŨNG CẦN XÁC THỰC TOKEN VÀ KIỂM TRA is_admin ***
     public function updateMembershipLevel($id) {
         // Validate ID
        if (!is_numeric($id) || $id <= 0) { echo $this->response->error("Invalid User ID.", 400); return; }
        $userId = intval($id);

         // --- Xác thực quyền (Chỉ admin?) ---
         $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
         $token = null;
         if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) { $token = $matches[1]; }
         if (!$token) { echo $this->response->unauthorized("Authentication token not found."); return; }
         $decodedPayload = JwtHelper::verifyJwt($token);
         if (!$decodedPayload || !($decodedPayload['is_admin'] ?? false)) { echo $this->response->unauthorized("Admin privileges required."); return; }
         // --- Kết thúc xác thực quyền ---

        try {
            $data = json_decode(file_get_contents("php://input"), true);
             if (json_last_error() !== JSON_ERROR_NONE) { throw new Exception("Invalid JSON data received.", 400); }
             if (!isset($data['membership_level']) || trim($data['membership_level']) === '') { throw new Exception("Missing membership level", 400); }
             $allowed_levels = ['basic', 'premium', 'gold'];
             if (!in_array(trim($data['membership_level']), $allowed_levels)) { throw new Exception("Invalid membership level provided.", 400); }

            $membership_level = trim($data['membership_level']);
            $success = $this->user->updateMembershipLevel($userId, $membership_level);

            echo $this->response->success(['message' => 'Membership level updated successfully']);

        } catch (Exception $e) {
             error_log("Update Membership Controller Error: " . $e->getMessage());
             $statusCode = ($e->getCode() == 400) ? 400 : 500;
             $errorMessage = ($statusCode === 500) ? "Failed to update membership level." : $e->getMessage();
             echo $this->response->error($errorMessage, $statusCode);
        }
     }

     public function makeAdmin($id) {
         // Validate ID
        if (!is_numeric($id) || $id <= 0) { echo $this->response->error("Invalid User ID.", 400); return; }
        $userId = intval($id);

         // --- Xác thực quyền (Chỉ admin?) ---
         $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
         $token = null;
         if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) { $token = $matches[1]; }
         if (!$token) { echo $this->response->unauthorized("Authentication token not found."); return; }
         $decodedPayload = JwtHelper::verifyJwt($token);
         if (!$decodedPayload || !($decodedPayload['is_admin'] ?? false)) { echo $this->response->unauthorized("Admin privileges required."); return; }
         // --- Kết thúc xác thực quyền ---

        try {
            $success = $this->user->makeAdmin($userId);
            echo $this->response->success(['message' => 'User promoted to admin successfully']);
        } catch (Exception $e) {
             error_log("Make Admin Controller Error: " . $e->getMessage());
             echo $this->response->error("Failed to promote user to admin.", 500);
        }
     }

     public function deleteUser($id) {
        // Validate ID
        if (!is_numeric($id) || $id <= 0) { echo $this->response->error("Invalid User ID.", 400); return; }
        $userIdToDelete = intval($id);

         // --- Xác thực quyền (Chỉ admin?) ---
         $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
         $token = null;
         if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) { $token = $matches[1]; }
         if (!$token) { echo $this->response->unauthorized("Authentication token not found."); return; }
         $decodedPayload = JwtHelper::verifyJwt($token);
         if (!$decodedPayload || !($decodedPayload['is_admin'] ?? false)) { echo $this->response->unauthorized("Admin privileges required."); return; }
         $loggedInUserId = $decodedPayload['user_id'] ?? null;
         if ($loggedInUserId == $userIdToDelete) { echo $this->response->error("Cannot delete your own account.", 403); return; }
         // --- Kết thúc xác thực quyền ---

        try {
            $deleted = $this->user->deleteUser($userIdToDelete);
            if ($deleted) {
                echo $this->response->success(['message' => 'User deleted successfully']);
            } else {
                 echo $this->response->error("User not found or already deleted.", 404);
            }
        } catch (Exception $e) {
             error_log("Delete User Controller Error: " . $e->getMessage());
             echo $this->response->error("Failed to delete user.", 500);
        }
     }

}
?>