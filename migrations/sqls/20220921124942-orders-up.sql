CREATE TABLE orders(
    id SERIAL PRIMARY  KEY,
    status VARCHAR(64) NOT NULL,
    total FLOAT NOT NULL CHECK (total >= 0),
    user_id INT REFERENCES users(id)
)