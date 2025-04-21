<?php
require_once __DIR__ . '/../config/jwt_config.php';
require_once __DIR__ . '/../utils/Response.php';

class Auth {
    // Hàm mã hóa base64url (thay thế cho base64 thông thường)
    private static function base64UrlEncode($data) {
        $base64 = base64_encode($data);
        return str_replace(['+', '/', '='], ['-', '_', ''], $base64);
    }

    // Hàm giải mã base64url
    private static function base64UrlDecode($data) {
        $base64 = str_replace(['-', '_'], ['+', '/'], $data);
        $mod4 = strlen($base64) % 4;
        if ($mod4) {
            $base64 .= substr('====', $mod4);
        }
        return base64_decode($base64);
    }

    // Tạo JWT token
    public static function createToken($user_id, $username, $is_admin) {
        $issued_at = time();
        $expiration = $issued_at + JWT_EXPIRATION;

        // Header
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];
        $header_encoded = self::base64UrlEncode(json_encode($header));

        // Payload
        $payload = [
            'iss' => JWT_ISSUER,
            'iat' => $issued_at,
            'exp' => $expiration,
            'sub' => $user_id,
            'username' => $username,
            'is_admin' => $is_admin
        ];
        $payload_encoded = self::base64UrlEncode(json_encode($payload));

        // Signature
        $signature = hash_hmac('sha256', "$header_encoded.$payload_encoded", JWT_SECRET, true);
        $signature_encoded = self::base64UrlEncode($signature);

        // Token hoàn chỉnh
        return "$header_encoded.$payload_encoded.$signature_encoded";
    }

    // Xác minh JWT token
    public static function verifyToken() {
        $headers = apache_request_headers();
        if (!isset($headers['Authorization'])) {
            return ['success' => false, 'message' => 'Token missing'];
        }

        $token = str_replace('Bearer ', '', $headers['Authorization']);
        $token_parts = explode('.', $token);

        if (count($token_parts) !== 3) {
            return ['success' => false, 'message' => 'Invalid token format'];
        }

        list($header_encoded, $payload_encoded, $signature_encoded) = $token_parts;

        // Xác minh signature
        $expected_signature = hash_hmac('sha256', "$header_encoded.$payload_encoded", JWT_SECRET, true);
        $expected_signature_encoded = self::base64UrlEncode($expected_signature);

        if ($signature_encoded !== $expected_signature_encoded) {
            return ['success' => false, 'message' => 'Invalid signature'];
        }

        // Giải mã payload
        $payload = json_decode(self::base64UrlDecode($payload_encoded), true);
        if (!$payload) {
            return ['success' => false, 'message' => 'Invalid payload'];
        }

        // Kiểm tra thời gian hết hạn
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return ['success' => false, 'message' => 'Token expired'];
        }

        return ['success' => true, 'data' => $payload];
    }

    // Middleware bảo vệ endpoint
    public static function protect($is_admin_required = false) {
        $response = new Response();
        $auth = self::verifyToken();

        if (!$auth['success']) {
            echo $response->unauthorized($auth['message']);
            exit();
        }

        if ($is_admin_required && !$auth['data']['is_admin']) {
            echo $response->unauthorized("Admin access required");
            exit();
        }

        return $auth['data']; // Trả về thông tin user từ token
    }
}
?>