CREATE TABLE users(
    id SERIAL PRIMARY  KEY,
    username VARCHAR(150),
    name VARCHAR(150),
    email VARCHAR(150),
    password_digist VARCHAR(255)
)