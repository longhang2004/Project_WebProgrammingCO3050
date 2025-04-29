<?php
require_once __DIR__ . '/../utils/Database.php';

class Post {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance();
    }

    public function getAll($limit = 10, $offset = 0) {
        if ($this->conn instanceof PDO) {
            $stmt = $this->conn->prepare("SELECT * FROM Posts ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        } else {
            throw new Exception("Database connection is not a valid PDO instance.");
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
