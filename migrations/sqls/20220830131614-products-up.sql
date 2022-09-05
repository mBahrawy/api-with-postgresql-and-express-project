CREATE TABLE products(
    id SERIAL PRIMARY  KEY,
    name VARCHAR(150) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    price FLOAT NOT NULL CHECK (price >= 0),
    category VARCHAR(150),
    user_id INT REFERENCES users(id)
)