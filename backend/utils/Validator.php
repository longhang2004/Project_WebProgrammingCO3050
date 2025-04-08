<?php
class Validator {
    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public static function validateString($string, $minLength = 1, $maxLength = 255) {
        $string = trim($string);
        return !empty($string) && strlen($string) >= $minLength && strlen($string) <= $maxLength;
    }

    public static function validateNumber($number, $min = 0, $max = PHP_INT_MAX) {
        return is_numeric($number) && $number >= $min && $number <= $max;
    }

    public static function sanitizeInput($data) {
        return htmlspecialchars(strip_tags(trim($data)));
    }
}
?>