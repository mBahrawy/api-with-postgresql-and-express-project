CREATE TABLE categories(
    id SERIAL PRIMARY  KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    description VARCHAR(255)
)