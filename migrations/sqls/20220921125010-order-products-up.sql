CREATE TABLE order_products(
    id SERIAL PRIMARY  KEY,
    quantity INT NOT NULL CHECK (quantity >= 1),
    order_id INT REFERENCES orders(id),
    product_id INT REFERENCES products(id)
)