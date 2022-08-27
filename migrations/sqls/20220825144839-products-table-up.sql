CREATE TABLE products (
    id SERIAL PRIMARY  KEY,
    name VARCHAR(150),
    stock integer,
    vendor VARCHAR(255),
    type VARCHAR(100),
    description text
);