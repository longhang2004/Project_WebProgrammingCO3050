<?php
require_once __DIR__ . '/../config/db_config.php';

class Database {
    private $conn;
    private static $instance = null;

    // Singleton pattern để tránh nhiều kết nối
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function getConnection() {
        return $this->conn;
    }

    // Thực thi query
    public function query($sql) {
        return $this->conn->query($sql);
    }

    // Chuẩn bị statement
    public function prepare($sql) {
        return $this->conn->prepare($sql);
    }

    // Đóng kết nối
    public function closeConnection() {
        if ($this->conn) {
            $this->conn->close();
            self::$instance = null;
        }
    }

    // Hủy clone và wakeup để đảm bảo Singleton
    private function __clone() {}
    public function __wakeup() {}
}
?>