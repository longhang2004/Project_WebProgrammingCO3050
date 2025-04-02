USE webproject;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    imageurl VARCHAR(255) DEFAULT 'https://example.com/default.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Customers (
    user_id INT PRIMARY KEY,
    membership_level ENUM('basic', 'premium', 'gold') DEFAULT 'basic',  -- Membership levels can be basic, premium, or gold
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE  -- Ensures that if a user is deleted, their customer record is also deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Admins (
    user_id INT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE  -- Ensures that if a user is deleted, their admin record is also deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    rated_stars DECIMAL(2, 1) DEFAULT 0.0 CHECK (rated_stars BETWEEN 0.0 AND 5.0),  -- Rating stars between 0.0 and 5.0
    warranty_period INT DEFAULT 0,  -- Warranty period in months
    manufacturer VARCHAR(100) NOT NULL,
    warranty_policy TEXT NOT NULL,
    imageurl VARCHAR(255) DEFAULT 'https://example.com/default-product.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Smartphones (
    product_id INT PRIMARY KEY,
    processor VARCHAR(100) NOT NULL,
    camera VARCHAR(100) NOT NULL,
    battery VARCHAR(100) NOT NULL,
    screen_description VARCHAR(100) NOT NULL,
    RAM_ROM VARCHAR(100) NOT NULL,
    sim_connectivity VARCHAR(100) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE  -- Ensures that if a product is deleted, its smartphone record is also deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Laptops (
    product_id INT PRIMARY KEY,
    CPU VARCHAR(100) NOT NULL,
    GPU VARCHAR(100) NOT NULL,
    RAM VARCHAR(100) NOT NULL,
    storage VARCHAR(100) NOT NULL,
    screen_description VARCHAR(100) NOT NULL,
    battery VARCHAR(100) NOT NULL,
    ports VARCHAR(100) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE  -- Ensures that if a product is deleted, its laptop record is also deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10, 2) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    payment_method ENUM('credit_card', 'paypal', 'bank_transfer') NOT NULL,  -- Payment methods can be credit card, PayPal, or bank transfer
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',  -- Payment status can be pending, completed, or failed
    status ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES customers(user_id) ON DELETE CASCADE  -- Ensures that if a customer is deleted, their orders are also deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admins(user_id) ON DELETE CASCADE  -- Ensures that if a user is deleted, their posts are also deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE QuestionAndAnswers (
    user_id INT NOT NULL,
    qna_id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reply_qna_id INT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,  -- Ensures that if a user is deleted, their Q&A records are also deleted
    FOREIGN KEY (reply_qna_id) REFERENCES QuestionAndAnswers(qna_id) ON DELETE CASCADE  -- Ensures that if a Q&A record is deleted, its replies are also deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES customers(user_id) ON DELETE CASCADE,  -- Ensures that if a customer is deleted, their cart records are also deleted
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE  -- Ensures that if a product is deleted, its cart records are also deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating DECIMAL(2, 1) CHECK (rating BETWEEN 0.0 AND 5.0),  -- Rating stars between 0.0 and 5.0
    review_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,  -- Ensures that if a user is deleted, their reviews are also deleted
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE  -- Ensures that if a product is deleted, its reviews are also deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE OrderItems (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,  -- Ensures that if an order is deleted, its order items are also deleted
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE  -- Ensures that if a product is deleted, its order items are also deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATe TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,  -- Ensures that if a user is deleted, their comments are also deleted
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE  -- Ensures that if a post is deleted, its comments are also deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;