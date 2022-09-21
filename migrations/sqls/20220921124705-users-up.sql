CREATE TABLE users(
    id SERIAL PRIMARY  KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(150) NOT NULL,
    password_digist VARCHAR(255),
    lastName VARCHAR(150),
    firstname VARCHAR(150)
)