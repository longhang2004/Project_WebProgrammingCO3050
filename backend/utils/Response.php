<?php
class Response {
    public function success($data, $statusCode = 200) {
        http_response_code($statusCode);
        return json_encode([
            'success' => true,
            'data' => $data,
            'message' => 'Operation successful'
        ]);
    }

    public function error($message, $statusCode = 400) {
        http_response_code($statusCode);
        return json_encode([
            'success' => false,
            'message' => $message,
            'data' => null
        ]);
    }

    public function notFound($message = "Resource not found") {
        return $this->error($message, 404);
    }

    public function unauthorized($message = "Unauthorized access") {
        return $this->error($message, 401);
    }

    public function serverError($message = "Internal server error") {
        return $this->error($message, 500);
    }
}
?>