USE webproject;

-- INSERT INTO Admins (user_id)
-- VALUES (6);

-- Insert sample users
INSERT INTO Users (first_name, last_name, username, password, email, phone_number, address, imageurl)
VALUES 
('John', 'Doe', 'johndoe', '$2a$10$X7VYhDtvpRXCLkZiuUVu3OnJHCkF2dNJCwI74S1v1oQVg.Jhe0NeO', 'john.doe@example.com', '1234567890', '123 Main St, City, Country', 'https://example.com/john.jpg'),
('Jane', 'Smith', 'janesmith', '$2a$10$X7VYhDtvpRXCLkZiuUVu3OnJHCkF2dNJCwI74S1v1oQVg.Jhe0NeO', 'jane.smith@example.com', '0987654321', '456 Oak St, City, Country', 'https://example.com/jane.jpg'),
('Admin', 'User', 'adminuser', '$2a$10$X7VYhDtvpRXCLkZiuUVu3OnJHCkF2dNJCwI74S1v1oQVg.Jhe0NeO', 'admin@example.com', '5551234567', '789 Admin Ave, City, Country', 'https://example.com/admin.jpg'),
('Sarah', 'Johnson', 'sarahj', '$2a$10$X7VYhDtvpRXCLkZiuUVu3OnJHCkF2dNJCwI74S1v1oQVg.Jhe0NeO', 'sarah.j@example.com', '7778889999', '234 Elm St, City, Country', 'https://example.com/sarah.jpg'),
('Robert', 'Williams', 'robertw', '$2a$10$X7VYhDtvpRXCLkZiuUVu3OnJHCkF2dNJCwI74S1v1oQVg.Jhe0NeO', 'robert.w@example.com', '3334445555', '567 Pine St, City, Country', 'https://example.com/robert.jpg');

-- Insert customers
INSERT INTO Customers (user_id, membership_level)
VALUES 
(1, 'basic'),
(2, 'premium'),
(4, 'gold'),
(5, 'basic');

-- Insert admin
INSERT INTO Admins (user_id)
VALUES (3);

-- Insert products
INSERT INTO Products (name, description, price, stock, rated_stars, warranty_period, manufacturer, warranty_policy, imageurl)
VALUES 
('iPhone 14', 'The latest iPhone with enhanced features and performance', 999.99, 100, 4.5, 12, 'Apple', 'One year limited warranty covering hardware defects', 'https://example.com/iphone14.jpg'),
('Samsung Galaxy S23', 'High-end Android smartphone with exceptional camera', 899.99, 75, 4.3, 12, 'Samsung', 'One year manufacturer warranty', 'https://example.com/galaxys23.jpg'),
('MacBook Pro 16"', 'Powerful laptop for professionals with M2 Pro chip', 2499.99, 50, 4.8, 24, 'Apple', 'One year limited warranty with option to purchase AppleCare+', 'https://example.com/macbookpro.jpg'),
('Dell XPS 15', 'Premium Windows laptop with 4K display', 1899.99, 40, 4.4, 12, 'Dell', 'One year hardware warranty with on-site service', 'https://example.com/dellxps15.jpg'),
('Google Pixel 7', 'Google flagship phone with exceptional camera capabilities', 699.99, 60, 4.6, 12, 'Google', 'Two year manufacturer warranty', 'https://example.com/pixel7.jpg');

-- Insert smartphone details
INSERT INTO Smartphones (product_id, processor, camera, battery, screen_description, RAM_ROM, sim_connectivity)
VALUES 
(1, 'A16 Bionic', '48MP main, 12MP ultrawide', '3,200 mAh', '6.1-inch Super Retina XDR display', '6GB RAM, 128GB/256GB/512GB ROM', 'Dual SIM, 5G'),
(2, 'Snapdragon 8 Gen 2', '200MP main, 12MP ultrawide, 10MP telephoto', '5,000 mAh', '6.8-inch Dynamic AMOLED 2X display', '8GB RAM, 256GB/512GB ROM', 'Dual SIM, 5G'),
(5, 'Google Tensor G2', '50MP main, 12MP ultrawide', '4,355 mAh', '6.3-inch OLED display', '8GB RAM, 128GB/256GB ROM', 'Dual SIM, 5G');

-- Insert laptop details
INSERT INTO Laptops (product_id, CPU, GPU, RAM, storage, screen_description, battery, ports)
VALUES 
(3, 'Apple M2 Pro with 10-core CPU', 'Apple M2 Pro with 16-core GPU', '16GB', '512GB SSD', '16.2-inch Liquid Retina XDR display', 'Up to 22 hours', 'Thunderbolt 4, HDMI, SDXC, MagSafe 3'),
(4, 'Intel Core i7-12700H', 'NVIDIA GeForce RTX 3050 Ti', '16GB', '1TB SSD', '15.6-inch 4K UHD+', '86WHr', 'Thunderbolt 4, USB-C, USB-A, HDMI, SD card reader');

-- Insert orders
INSERT INTO Orders (user_id, total_price, shipping_address, payment_method, payment_status, status)
VALUES 
(1, 999.99, '123 Main St, City, Country', 'credit_card', 'completed', 'delivered'),
(2, 2499.99, '456 Oak St, City, Country', 'paypal', 'completed', 'shipped'),
(4, 1599.98, '234 Elm St, City, Country', 'bank_transfer', 'completed', 'pending'),
(5, 699.99, '567 Pine St, City, Country', 'credit_card', 'pending', 'pending');

-- Insert posts
INSERT INTO Posts (user_id, content)
VALUES 
(3, 'Welcome to our new website! Check out the latest smartphones and laptops available now.'),
(3, 'Holiday Sale Coming Soon! Stay tuned for amazing discounts on all products.'),
(3, 'Tech Tip: Extend your laptop battery life by adjusting your power settings and screen brightness.');

-- Insert questions and answers
INSERT INTO QuestionAndAnswers (user_id, question, reply_qna_id)
VALUES 
(1, 'What is the return policy for smartphones?', NULL),
(3, 'Our return policy allows returns within 30 days of purchase for a full refund.', 1),
(2, 'How long is the warranty for the MacBook Pro?', NULL),
(3, 'The MacBook Pro comes with a one-year limited warranty, and you can purchase AppleCare+ for extended coverage.', 3),
(4, 'Do you offer international shipping?', NULL);

-- Insert cart items
INSERT INTO Carts (user_id, product_id, quantity)
VALUES 
(1, 2, 1),
(2, 3, 1),
(4, 1, 1),
(4, 4, 1),
(5, 5, 2);

-- Insert reviews
INSERT INTO Reviews (user_id, product_id, rating, review_text)
VALUES 
(1, 1, 4.5, 'Great phone with excellent camera quality and battery life!'),
(2, 3, 5.0, 'The MacBook Pro exceeds all my expectations. Perfect for professional work.'),
(4, 2, 4.0, 'The Samsung Galaxy S23 has a beautiful display, but the battery life could be better.'),
(5, 5, 4.8, 'The Pixel 7 has the best camera I have ever used on a smartphone.');

-- Insert order items
INSERT INTO OrderItems (order_id, product_id, quantity)
VALUES 
(1, 1, 1),
(2, 3, 1),
(3, 2, 1),
(3, 5, 1),
(4, 5, 1);

-- Insert comments
INSERT INTO Comments (user_id, post_id, content)
VALUES 
(1, 1, 'I love the new website design!'),
(2, 1, 'The product selection is excellent.'),
(4, 2, 'Looking forward to the holiday sale!'),
(5, 3, 'Thanks for the helpful tip.');