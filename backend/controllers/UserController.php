<?php
require_once '../models/User.php';
require_once '../utils/Response.php';

class UserController {
    private $user;
    private $response;

    public function __construct() {
        $this->user = new User();
        $this->response = new Response();
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['first_name']) || !isset($data['last_name']) || !isset($data['username']) || 
            !isset($data['password']) || !isset($data['email']) || !isset($data['phone_number']) || !isset($data['address'])) {
            echo $this->response->error("Missing required fields", 400);
            return;
        }

        $first_name = $data['first_name'];
        $last_name = $data['last_name'];
        $username = $data['username'];
        $password = $data['password'];
        $email = $data['email'];
        $phone_number = $data['phone_number'];
        $address = $data['address'];

        $user_id = $this->user->register($first_name, $last_name, $username, $password, $email, $phone_number, $address);

        if ($user_id) {
            echo $this->response->success(['message' => 'User registered successfully', 'user_id' => $user_id]);
        } else {
            echo $this->response->error("Failed to register user", 500);
        }
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['username_or_email']) || !isset($data['password'])) {
            echo $this->response->error("Missing required fields", 400);
            return;
        }

        $username_or_email = $data['username_or_email'];
        $password = $data['password'];

        $user = $this->user->login($username_or_email, $password);

        if ($user) {
            echo $this->response->success(['user' => $user, 'message' => 'Login successful']);
        } else {
            echo $this->response->error("Invalid credentials", 401);
        }
    }

    public function getUserById($id) {
        $user = $this->user->getUserById($id);
        if ($user) {
            echo $this->response->success($user);
        } else {
            echo $this->response->error("User not found", 404);
        }
    }

    public function updateUser($id) {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['first_name']) || !isset($data['last_name']) || !isset($data['username']) || 
            !isset($data['email']) || !isset($data['phone_number']) || !isset($data['address'])) {
            echo $this->response->error("Missing required fields", 400);
            return;
        }

        $first_name = $data['first_name'];
        $last_name = $data['last_name'];
        $username = $data['username'];
        $email = $data['email'];
        $phone_number = $data['phone_number'];
        $address = $data['address'];
        $password = isset($data['password']) ? $data['password'] : null;
        $imageurl = isset($data['imageurl']) ? $data['imageurl'] : null;

        if ($this->user->updateUser($id, $first_name, $last_name, $username, $email, $phone_number, $address, $password, $imageurl)) {
            echo $this->response->success(['message' => 'User updated successfully']);
        } else {
            echo $this->response->error("Failed to update user", 500);
        }
    }

    public function updateMembershipLevel($id) {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['membership_level'])) {
            echo $this->response->error("Missing membership level", 400);
            return;
        }

        $membership_level = $data['membership_level'];

        if ($this->user->updateMembershipLevel($id, $membership_level)) {
            echo $this->response->success(['message' => 'Membership level updated successfully']);
        } else {
            echo $this->response->error("Failed to update membership level", 500);
        }
    }

    public function makeAdmin($id) {
        if ($this->user->makeAdmin($id)) {
            echo $this->response->success(['message' => 'User promoted to admin successfully']);
        } else {
            echo $this->response->error("Failed to promote user to admin", 500);
        }
    }

    public function deleteUser($id) {
        if ($this->user->deleteUser($id)) {
            echo $this->response->success(['message' => 'User deleted successfully']);
        } else {
            echo $this->response->error("Failed to delete user", 500);
        }
    }
}
?>
