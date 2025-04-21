USE webproject;

-- Basic SELECT queries for each table

-- 1. Select all users
SELECT * FROM Users;

SELECT * FROM Customers;
SELECT * FROM Admins;

-- 2. Select all customers with their user information
SELECT u.*, c.membership_level
FROM Customers c
JOIN Users u ON c.user_id = u.user_id;

-- 3. Select all admins with their user information
SELECT u.*, a.user_id AS admin_id
FROM Admins a
JOIN Users u ON a.user_id = u.user_id;

-- 4. Select all products
SELECT * FROM Products;

-- 5. Select all smartphones with their product details
SELECT p.*, s.*
FROM Smartphones s
JOIN Products p ON s.product_id = p.product_id;

-- 6. Select all laptops with their product details
SELECT p.*, l.*
FROM Laptops l
JOIN Products p ON l.product_id = p.product_id;

-- 7. Select all orders
SELECT * FROM Orders;

-- 8. Select all posts
SELECT * FROM Posts;

-- 9. Select all questions and answers
SELECT * FROM QuestionAndAnswers;

-- 10. Select all cart items
SELECT * FROM Carts;

-- 11. Select all reviews
SELECT * FROM Reviews;

-- 12. Select all order items
SELECT * FROM OrderItems;

-- 13. Select all comments
SELECT * FROM Comments;

-- Advanced queries with JOINs

-- 14. Select orders with customer information
SELECT o.*, u.first_name, u.last_name, u.email
FROM Orders o
JOIN Customers c ON o.user_id = c.user_id
JOIN Users u ON c.user_id = u.user_id;

-- 15. Select order items with product information
SELECT oi.*, o.order_date, p.name, p.price
FROM OrderItems oi
JOIN Orders o ON oi.order_id = o.order_id
JOIN Products p ON oi.product_id = p.product_id;

-- 16. Select reviews with user and product information
SELECT r.*, u.username, p.name AS product_name
FROM Reviews r
JOIN Users u ON r.user_id = u.user_id
JOIN Products p ON r.product_id = p.product_id;

-- 17. Select posts with admin information
SELECT p.*, u.username, u.email
FROM Posts p
JOIN Admins a ON p.user_id = a.user_id
JOIN Users u ON a.user_id = u.user_id;

-- 18. Select comments with user and post information
SELECT c.*, u.username, p.content AS post_content
FROM Comments c
JOIN Users u ON c.user_id = u.user_id
JOIN Posts p ON c.post_id = p.post_id;

-- 19. Select cart items with user and product information
SELECT c.*, u.username, p.name AS product_name, p.price
FROM Carts c
JOIN Customers cu ON c.user_id = cu.user_id
JOIN Users u ON cu.user_id = u.user_id
JOIN Products p ON c.product_id = p.product_id;

-- 20. Select questions and their replies
SELECT q1.question AS original_question, q1.created_at AS question_time,
    q2.question AS reply, q2.created_at AS reply_time
FROM QuestionAndAnswers q1
LEFT JOIN QuestionAndAnswers q2 ON q1.qna_id = q2.reply_qna_id
WHERE q1.reply_qna_id IS NULL;