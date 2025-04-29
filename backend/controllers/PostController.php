<?php
require_once __DIR__ . '/../models/Post.php';
require_once __DIR__ . '/../utils/Response.php';

class PostController {
    private $postModel;

    public function __construct() {
        $this->postModel = new Post();
    }

    public function getAllPosts($limit = 10, $page = 1) {
        $offset = ($page - 1) * $limit;
        $posts = $this->postModel->getAll($limit, $offset);
        Response::json($posts);
    }
}
