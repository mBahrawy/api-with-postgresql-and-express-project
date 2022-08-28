## SQL commands
- connection :
    `psql -h 127.0.0.1 -U <user> <database>`
- restart postgres   (windows):
    `pg_ctl -D "C:\Program Files\PostgreSQL\14\data" restart`
- create user:
    `CREATE USER shopping_user WITH PASSWORD 'password123';`
- grant user previleges:
    `GRANT ALL PRIVILEGES ON DATABASE shopping TO shopping_user;`

- create database:
    `CREATE DATABASE my_new_databse;`
- create table:
    `CREATE TABLE users(id SERIAL PRIMARY KEY,name VARCHAR(100), bio textSE, children integer, created date);`

- insert record (create):
    `INSERT INTO users (name, bio, children, created) VALUES ('Ahmed', 'A techer', 1, '2021-12-3');`
- select record(read):
    `SELECT * FROM users LIMIT 5;`
- select record, with limit, range, similar, not null child (read):
    `SELECT * FROM users LIMIT 5 WHERE date BETWEEN '2021-01-01' AND '2021-01-31' LIKE '%teacher%' WHERE children IN NOT NULL;`
- update record (update):
    `UPDATE users SET children = 2 WHERE id=1;`   
- delete record (delete):
    `DELETE FROM users WHERE id=1`   
- adding a foreign key:
    `ALTER TABLE users ADD FOREIGN KEY (order_id) REFERENCES order(id);`    

## psql meta commands     
- connect to database:
    `\c my_new_databse`
- display all databses:
    `\l`
- display all tables:
    `\dt`
- exit psql command:
    `\q`
- show users:
    `\du`

## for DB migration
npm install -g `db-migrate`
db-migrate create books-table --sql-file
