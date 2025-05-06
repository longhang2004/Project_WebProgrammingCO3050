<?php
// Hiển thị tất cả lỗi để debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Session Debug Info</h1>";

// Kiểm tra các cài đặt session quan trọng
echo "<h2>Settings:</h2>";
echo "session.save_path: <b>" . ini_get('session.save_path') . "</b><br>";
echo "session.cookie_path: <b>" . ini_get('session.cookie_path') . "</b><br>";
echo "session.cookie_domain: <b>" . (ini_get('session.cookie_domain') ?: '<i>Empty (OK)</i>') . "</b><br>";
echo "session.use_cookies: <b>" . ini_get('session.use_cookies') . "</b><br>";
echo "session.use_only_cookies: <b>" . ini_get('session.use_only_cookies') . "</b><br>";

echo "<hr>";

// Khởi tạo session nếu chưa có
echo "<h2>Session Status & ID:</h2>";
if (session_status() === PHP_SESSION_NONE) {
    // Cố gắng đặt lại cookie path trước khi start (để đảm bảo)
    ini_set('session.cookie_path', '/');
    session_start();
    echo "Session started now.<br>";
} else {
    echo "Session already active.<br>";
}

// In ra session ID hiện tại
echo "Current Session ID: <b>" . session_id() . "</b><br>";

echo "<hr>";

// Thử ghi và đọc dữ liệu session
echo "<h2>Session Data Test:</h2>";
$currentTime = date('Y-m-d H:i:s');
if (!isset($_SESSION['first_visit'])) {
    $_SESSION['first_visit'] = $currentTime;
    echo "Setting 'first_visit' to: " . $currentTime . "<br>";
} else {
    echo "'first_visit' was set at: " . $_SESSION['first_visit'] . "<br>";
}

// Cập nhật biến session trên mỗi lần tải lại
$_SESSION['last_visit'] = $currentTime;
echo "Setting/Updating 'last_visit' to: " . $currentTime . "<br>";

echo "<br>Current Session Data Array:<br>";
echo "<pre>";
print_r($_SESSION);
echo "</pre>";

echo "<hr>";
echo "<p><i>Refresh this page multiple times to check if the Session ID changes and if 'first_visit' persists.</i></p>";
?>