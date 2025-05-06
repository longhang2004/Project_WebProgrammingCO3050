<?php
define('JWT_SECRET', 'your-secret-key-32-chars-long'); // Khóa bí mật (ít nhất 32 ký tự)
define('JWT_ALGORITHM', 'HS256'); // Thuật toán sử dụng (HS256 là HMAC SHA256)
define('JWT_EXPIRATION', 3600); // Thời gian sống (1 giờ)
define('JWT_ISSUER', 'http://localhost:8888/backend'); // Issuer
?>