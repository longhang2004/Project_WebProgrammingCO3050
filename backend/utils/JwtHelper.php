<?php
// File: backend/utils/JwtHelper.php

// *** Define constants directly here as require_once was problematic ***
// *** IMPORTANT: Ensure these values match your intended configuration! ***
if (!defined('JWT_SECRET_KEY')) {
    // REPLACE THIS with your actual secret key! Keep it secret!
    define('JWT_SECRET_KEY', 'your-very-strong-and-secret-key-change-this-immediately');
}
if (!defined('JWT_ALGORITHM')) {
    define('JWT_ALGORITHM', 'HS256');
}
if (!defined('JWT_EXPIRATION_TIME')) {
    // Token expiration time in seconds (e.g., 3600 = 1 hour)
    define('JWT_EXPIRATION_TIME', 3600);
}
if (!defined('JWT_ISSUER')) {
    // Typically the URL of your application
    define('JWT_ISSUER', 'http://localhost/Project_WebProgrammingCO3050');
}
// *** End of direct definitions ***


class JwtHelper {

    /**
     * Mã hóa Base64URL (An toàn cho URL).
     * @param string $data Dữ liệu cần mã hóa.
     * @return string Chuỗi đã mã hóa Base64URL.
     */
    private static function base64UrlEncode(string $data): string {
        $base64 = base64_encode($data);
        $base64Url = strtr($base64, '+/', '-_');
        return rtrim($base64Url, '=');
    }

    /**
     * Giải mã Base64URL.
     * @param string $data Chuỗi Base64URL cần giải mã.
     * @return string|false Dữ liệu đã giải mã hoặc false nếu lỗi.
     */
    private static function base64UrlDecode(string $data) {
        $base64 = strtr($data, '-_', '+/');
        $paddedData = str_pad($base64, strlen($base64) % 4, '=', STR_PAD_RIGHT);
        return base64_decode($paddedData);
    }

    /**
     * Tạo một JWT mới.
     * @param array $payload Dữ liệu muốn đưa vào token (ví dụ: user_id, username).
     * @return string|false Chuỗi JWT hoặc false nếu lỗi.
     */
    public static function createJwt(array $payload) {
        // Check if constants are defined (as a safeguard)
        if (!defined('JWT_ALGORITHM') || !defined('JWT_SECRET_KEY') || !defined('JWT_EXPIRATION_TIME') || !defined('JWT_ISSUER')) {
             // Keep this error log as it indicates a fundamental problem if reached
             error_log("JWT Create Error: Core JWT configuration constants are not defined!");
             return false;
        }

        try {
            $header = json_encode(['alg' => JWT_ALGORITHM, 'typ' => 'JWT']);
            if ($header === false) {
                error_log("JWT Error: Failed to encode header."); // Keep essential error logs
                return false;
            }
            $encodedHeader = self::base64UrlEncode($header);

            $issuedAt = time();
            $expirationTime = $issuedAt + JWT_EXPIRATION_TIME;
            $payload['iat'] = $issuedAt;
            $payload['exp'] = $expirationTime;
            $payload['iss'] = JWT_ISSUER;

            $payloadJson = json_encode($payload);
             if ($payloadJson === false) {
                 // Keep essential error logs
                 error_log("JWT Error: Failed to encode payload. JSON Error: " . json_last_error_msg());
                 return false;
            }
            $encodedPayload = self::base64UrlEncode($payloadJson);

            $unsignedToken = $encodedHeader . '.' . $encodedPayload;
            $signature = hash_hmac('sha256', $unsignedToken, JWT_SECRET_KEY, true);
            if ($signature === false) {
                 error_log("JWT Error: Failed to create signature."); // Keep essential error logs
                 return false;
            }
            $encodedSignature = self::base64UrlEncode($signature);

            return $encodedHeader . '.' . $encodedPayload . '.' . $encodedSignature;

        } catch (Exception $e) {
            error_log("JWT Creation Exception: " . $e->getMessage()); // Keep exception logs
            return false;
        }
    }

    /**
     * Xác thực một JWT và trả về payload nếu hợp lệ.
     * @param string $token Chuỗi JWT cần xác thực.
     * @return array|false Mảng payload nếu token hợp lệ và chưa hết hạn, ngược lại trả về false.
     */
    public static function verifyJwt(string $token) {
         // Check if constants are defined (as a safeguard)
         if (!defined('JWT_ALGORITHM') || !defined('JWT_SECRET_KEY') || !defined('JWT_ISSUER')) {
              // Keep this error log
             error_log("JWT Verify Error: Core JWT configuration constants are not defined!");
             return false;
         }

        try {
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                // Keep essential error logs
                // error_log("JWT Verify Error: Invalid token structure.");
                return false; // Return false silently for invalid structure often
            }
            list($encodedHeader, $encodedPayload, $encodedSignature) = $parts;

            // Decode header (optional, but good practice)
            $headerJson = self::base64UrlDecode($encodedHeader);
            if ($headerJson === false) { return false; } // Silently fail
            $header = json_decode($headerJson, true);
            if (!$header || !isset($header['alg']) || $header['alg'] !== JWT_ALGORITHM) {
                // error_log("JWT Verify Error: Invalid or unsupported algorithm."); // Log might be noisy
                return false;
            }

            // Verify signature
            $unsignedToken = $encodedHeader . '.' . $encodedPayload;
            $expectedSignature = hash_hmac('sha256', $unsignedToken, JWT_SECRET_KEY, true);
            if ($expectedSignature === false) {
                 error_log("JWT Verify Error: Failed to recreate signature."); // Keep this log
                 return false;
            }
            $receivedSignature = self::base64UrlDecode($encodedSignature);
            if ($receivedSignature === false) { return false; } // Silently fail

            if (!hash_equals($expectedSignature, $receivedSignature)) {
                 // error_log("JWT Verify Error: Signature verification failed."); // Log might be noisy
                return false; // Signature mismatch
            }

            // Decode payload
            $payloadJson = self::base64UrlDecode($encodedPayload);
             if ($payloadJson === false) { return false; } // Silently fail
            $payload = json_decode($payloadJson, true);
            if (!$payload) {
                 // error_log("JWT Verify Error: Invalid payload JSON."); // Log might be noisy
                 return false;
            }

            // Validate claims (iss, exp)
            if (!isset($payload['iss']) || $payload['iss'] !== JWT_ISSUER) {
                 // error_log("JWT Verify Error: Invalid issuer."); // Log might be noisy
                 return false;
            }
            // Note: iat check is usually informational, exp is critical
            if (!isset($payload['exp']) || !is_numeric($payload['exp'])) {
                 // error_log("JWT Verify Error: Invalid expiration time format."); // Log might be noisy
                 return false;
            }
            if (time() >= $payload['exp']) {
                 // error_log("JWT Verify Error: Token has expired."); // Log might be noisy
                return false; // Token expired
            }

            // If all checks pass, return the payload
            return $payload;

        } catch (Exception $e) {
            error_log("JWT Verification Exception: " . $e->getMessage()); // Keep exception logs
            return false;
        }
    }
}
?>
