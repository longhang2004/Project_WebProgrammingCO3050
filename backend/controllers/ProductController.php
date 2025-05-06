<?php
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../utils/Response.php';

class ProductController {
    private $product;
    private $response;

    public function __construct() {
        $this->product = new Product();
        $this->response = new Response();
    }

    public function getAllProducts() {
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;
        $perPage = isset($_GET['per_page']) && is_numeric($_GET['per_page']) ? intval($_GET['per_page']) : 10;

        $products = $this->product->getAllProducts($page, $perPage);
        if ($products['data']) {
            echo $this->response->success($products);
        } else {
            echo $this->response->error("No products found", 404);
        }
    }

    public function getProductByName() {
        $name = isset($_GET['name']) ? $_GET['name'] : null;
        if ($name) {
            $product = $this->product->getProductByName($name);
            if ($product) {
                echo $this->response->success($product);
            } else {
                echo $this->response->error("Product not found", 404);
            }
        } else {
            echo $this->response->error("Missing product name", 400);
        }
    }

    public function getAllSmartphones() {
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;
        $perPage = isset($_GET['per_page']) && is_numeric($_GET['per_page']) ? intval($_GET['per_page']) : 10;

        $smartphones = $this->product->getAllSmartphones($page, $perPage);
        if ($smartphones['data']) {
            echo $this->response->success($smartphones);
        } else {
            echo $this->response->error("No smartphones found", 404);
        }
    }

    public function getAllLaptops() {
        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;
        $perPage = isset($_GET['per_page']) && is_numeric($_GET['per_page']) ? intval($_GET['per_page']) : 10;

        $laptops = $this->product->getAllLaptops($page, $perPage);
        if ($laptops['data']) {
            echo $this->response->success($laptops);
        } else {
            echo $this->response->error("No laptops found", 404);
        }
    }

    public function getProductById($id) {
        $product = $this->product->getProductById($id);
        if ($product) {
            echo $this->response->success($product);
        } else {
            echo $this->response->error("Product not found", 404);
        }
    }

    public function createProduct() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['name']) || !isset($data['description']) || !isset($data['price']) || 
            !isset($data['stock']) || !isset($data['manufacturer']) || !isset($data['warranty_policy'])) {
            echo $this->response->error("Missing required fields", 400);
            return;
        }

        $name = $data['name'];
        $description = $data['description'];
        $price = floatval($data['price']);
        $stock = intval($data['stock']);
        $rated_stars = isset($data['rated_stars']) ? floatval($data['rated_stars']) : 0.0;
        $warranty_period = isset($data['warranty_period']) ? intval($data['warranty_period']) : 0;
        $manufacturer = $data['manufacturer'];
        $warranty_policy = $data['warranty_policy'];
        $imageurl = isset($data['imageurl']) ? $data['imageurl'] : 'https://example.com/default-product.jpg';

        $product_id = $this->product->createProduct($name, $description, $price, $stock, $rated_stars, $warranty_period, $manufacturer, $warranty_policy, $imageurl);

        if ($product_id) {
            // Thêm chi tiết nếu là smartphone
            if (isset($data['details']) && $data['details']['type'] === 'smartphone') {
                $this->product->createSmartphone(
                    $product_id,
                    $data['details']['processor'],
                    $data['details']['camera'],
                    $data['details']['battery'],
                    $data['details']['screen_description'],
                    $data['details']['RAM_ROM'],
                    $data['details']['sim_connectivity']
                );
            }

            // Thêm chi tiết nếu là laptop
            if (isset($data['details']) && $data['details']['type'] === 'laptop') {
                $this->product->createLaptop(
                    $product_id,
                    $data['details']['CPU'],
                    $data['details']['GPU'],
                    $data['details']['RAM'],
                    $data['details']['storage'],
                    $data['details']['screen_description'],
                    $data['details']['battery'],
                    $data['details']['ports']
                );
            }

            echo $this->response->success(['message' => 'Product created successfully', 'product_id' => $product_id]);
        } else {
            echo $this->response->error("Failed to create product", 500);
        }
    }

    public function updateProduct($id) {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['name']) || !isset($data['description']) || !isset($data['price']) || 
            !isset($data['stock']) || !isset($data['manufacturer']) || !isset($data['warranty_policy'])) {
            echo $this->response->error("Missing required fields", 400);
            return;
        }

        $name = $data['name'];
        $description = $data['description'];
        $price = floatval($data['price']);
        $stock = intval($data['stock']);
        $rated_stars = isset($data['rated_stars']) ? floatval($data['rated_stars']) : 0.0;
        $warranty_period = isset($data['warranty_period']) ? intval($data['warranty_period']) : 0;
        $manufacturer = $data['manufacturer'];
        $warranty_policy = $data['warranty_policy'];
        $imageurl = isset($data['imageurl']) ? $data['imageurl'] : null;

        if ($this->product->updateProduct($id, $name, $description, $price, $stock, $rated_stars, $warranty_period, $manufacturer, $warranty_policy, $imageurl)) {
            // Cập nhật chi tiết nếu là smartphone
            if (isset($data['details']) && $data['details']['type'] === 'smartphone') {
                $this->product->updateSmartphone(
                    $id,
                    $data['details']['processor'],
                    $data['details']['camera'],
                    $data['details']['battery'],
                    $data['details']['screen_description'],
                    $data['details']['RAM_ROM'],
                    $data['details']['sim_connectivity']
                );
            }

            // Cập nhật chi tiết nếu là laptop
            if (isset($data['details']) && $data['details']['type'] === 'laptop') {
                $this->product->updateLaptop(
                    $id,
                    $data['details']['CPU'],
                    $data['details']['GPU'],
                    $data['details']['RAM'],
                    $data['details']['storage'],
                    $data['details']['screen_description'],
                    $data['details']['battery'],
                    $data['details']['ports']
                );
            }

            echo $this->response->success(['message' => 'Product updated successfully']);
        } else {
            echo $this->response->error("Failed to update product", 500);
        }
    }

    public function deleteProduct($id) {
        if ($this->product->deleteProduct($id)) {
            echo $this->response->success(['message' => 'Product deleted successfully']);
        } else {
            echo $this->response->error("Failed to delete product", 500);
        }
    }
}
?>