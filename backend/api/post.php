<?php
require_once __DIR__ . '/../controllers/PostController.php';

$controller = new PostController();

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;

$controller->getAllPosts($limit, $page);
