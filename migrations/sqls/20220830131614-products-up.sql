CREATE TABLE products(
    id SERIAL PRIMARY  KEY,
    name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 0),
    price FLOAT NOT NULL CHECK (price >= 0),
    user_id INT REFERENCES users(id)
)