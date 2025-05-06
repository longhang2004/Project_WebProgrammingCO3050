<?php
// File: backend/utils/Database.php

require_once __DIR__ . '/../config/db_config.php';

class Database {
    private $conn;
    private static $instance = null;

    // Singleton pattern để tránh nhiều kết nối
    public static function getInstance() {
        if (self::$instance === null) {
            // Khối try...catch để bắt lỗi ngay cả khi khởi tạo instance
            try {
                self::$instance = new Database();
            } catch (Exception $e) {
                // Ghi log lỗi và có thể ném lại hoặc xử lý khác
                error_log("Database Singleton Instantiation Error: " . $e->getMessage());
                // Quan trọng: Quyết định xem có nên trả về null hay ném lại lỗi
                // Ném lại lỗi sẽ làm dừng quá trình nếu DB là bắt buộc
                throw $e;
                // Hoặc return null; // Nếu muốn cho phép ứng dụng tiếp tục mà không có DB (cẩn thận)
            }
        }
        return self::$instance;
    }

    // Constructor là private để đảm bảo Singleton
    private function __construct() {
        // Tắt báo cáo lỗi mysqli nội bộ để tự xử lý bằng exception
        mysqli_report(MYSQLI_REPORT_OFF);

        // Sử dụng @ để chặn warning mặc định, vì chúng ta sẽ kiểm tra connect_error
        $this->conn = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

        // *** FIX: Thay die() bằng throw new Exception() ***
        if ($this->conn->connect_error) {
            // Ném Exception để các lớp gọi đến có thể bắt và xử lý
            throw new Exception("Database Connection Failed: (" . $this->conn->connect_errno . ") " . $this->conn->connect_error);
        }

        // (Tùy chọn) Thiết lập charset sau khi kết nối thành công
        if (!$this->conn->set_charset("utf8mb4")) {
             error_log("Error loading character set utf8mb4: " . $this->conn->error);
             // Có thể throw Exception ở đây nếu charset là bắt buộc
        }
    }

    // Trả về đối tượng kết nối mysqli
    public function getConnection() {
        // Kiểm tra lại instance và connection trước khi trả về (an toàn hơn)
        if (self::$instance === null || $this->conn === null || $this->conn->connect_error) {
             // Có thể thử kết nối lại hoặc trả về null/ném lỗi
             error_log("Attempted to get connection when instance or connection is invalid.");
             return null; // Hoặc throw new Exception("Database connection not available.");
        }
        return $this->conn;
    }

    // Thực thi query (nên hạn chế dùng trực tiếp, ưu tiên prepared statements)
    public function query($sql) {
        $connection = $this->getConnection();
        if (!$connection) return false; // Trả về false nếu không có kết nối
        return $connection->query($sql);
    }

    // Chuẩn bị statement
    public function prepare($sql) {
         $connection = $this->getConnection();
         if (!$connection) return false; // Trả về false nếu không có kết nối
        return $connection->prepare($sql);
    }

    // Đóng kết nối (ít khi cần gọi thủ công với Singleton)
    public function closeConnection() {
        if ($this->conn) {
            $this->conn->close();
            $this->conn = null; // Đặt lại conn
        }
        // Không nên đặt self::$instance = null ở đây trừ khi có lý do đặc biệt
        // self::$instance = null;
    }

    // Hủy clone và wakeup để đảm bảo Singleton
    private function __clone() {}
    public function __wakeup() {}

    // (Tùy chọn) Destructor để đóng kết nối khi đối tượng bị hủy (ít dùng với Singleton)
    // public function __destruct() {
    //     $this->closeConnection();
    // }
}
?>
