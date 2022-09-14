# Store front Backend API (Node, Express, PostgresSQL)

This project for Udacity EgFwd Fullstack Nanodegree project

## How to run Image the Store front API project:

First, open terminal inside project directory, and run these commands

-   `npm i` for installing needed dependencies.
-   `npm start` for running development environment (through port will be 4000).
-   `npm run build` for building the production version.
-   `npm run serve` for running the production version (through port will be 8000).
-   `npm run test` for running implemneted unit tests (through port will be 6000).

## Used ports:
| Port              | Usage                           | Location           |
| ----------------- | ------------------------------- | ------------------ |
| 4000              | running app in development mode | `.env.development` |
| 6000              | running app tests               | `.env.test`        |  
| 8000              | running app in production mode  | `.env.production`  |
| 5432              | Postgres Database               | All env files      |

## Application API documentation:

### Not authorized/public APIs:
| Endpoint                                          | Method | Auth | Role    | Usage                                       |
| ------------------------------------------------- | ------ | ---- | ------- | ------------------------------------------- |
| `http://localhost:{{PORT}}/login`                 | POST   | No   |         | login user                                  |
| `http://localhost:{{PORT}}/register`              | POST   | No   |         | create new user                             |
| ------------------------------------------------- | ------ | ---- | ------- | ------------------------------------------- |
| `http://localhost:{{PORT}}/products/:id`          | GET    | No   |         | Getting a single product with id            |
| `http://localhost:{{PORT}}/products/category/:id` | GET    | No   |         | Getting all products related to category id |
| `http://localhost:{{PORT}}/products`              | POST   | Yes  | Admin   | Will create a new product                   |
| `http://localhost:{{PORT}}/products/:id`          | DELETE | Yes  | Admin   | Will delete a product with id               |
| ------------------------------------------------- | ------ | ---- | ------- | ------------------------------------------- |



## Download Postman API collection:

-   An exported file from Postman is [avaliable here](https://drive.google.com/file/d/1wWgc6PAcKh6tE17ZeZduJUKldNPseLF3/view?usp=sharing)




## Application environments:

-   `.env.development`
-   `.env.production`
-   `.env.test`

### 1. For development

create `.env.development` file in add directory

```
NODE_ENV=development

APP_BACKEND_BASE_URL=http://localhost
APP_BACKEND_PORT=4000

POSTGRES_DATABASE=store_front
POSTGRES_HOST=127.0.0.1
POSTGRES_USERNAME=root
POSTGRES_PASSWORD=root
POSTGRES_PORT=5432

BCRYPT_PASSWORD=kG5tfs
SALT_ROUNDS=8
TOKEN_SECRET=JWTTOKENSERCRET

ADMIN_NAME=first_admin
ADMIN_EMAIL=first_admin@admin
ADMIN_PASSWORD=Admin123
```

### 2. For production

create `.env.production` file in add directory

```
NODE_ENV=production

APP_BACKEND_BASE_URL=http://localhost
APP_BACKEND_PORT=5000

POSTGRES_DATABASE=store_front
POSTGRES_HOST=127.0.0.1
POSTGRES_USERNAME=root
POSTGRES_PASSWORD=root
POSTGRES_PORT=5432

BCRYPT_PASSWORD=kds7ys.8G5s7ys.8$%tfs
SALT_ROUNDS=10
TOKEN_SECRET=JWTTOKENSERCRET

ADMIN_NAME=first_admin
ADMIN_EMAIL=first_admin@admin
ADMIN_PASSWORD=Xds7ys.8G23.43f*gs^R
```

### 3. For testing

create `.env.test` file in add directory

```
NODE_ENV=development

APP_BACKEND_BASE_URL=http://localhost
APP_BACKEND_PORT=4000

POSTGRES_DATABASE=store_front
POSTGRES_HOST=127.0.0.1
POSTGRES_USERNAME=root
POSTGRES_PASSWORD=root
POSTGRES_PORT=5432

BCRYPT_PASSWORD=kG5tfs
SALT_ROUNDS=8
TOKEN_SECRET=JWTTOKENSERCRET

ADMIN_NAME=first_admin
ADMIN_EMAIL=first_admin@admin
ADMIN_PASSWORD=Admin123
```

## Database setup and configration:

### 1. Create the needed databases

1- Open cmd or terminal
2- Conenct to postgres by typing: `psql -h 127.0.0.1 -U postgres postgres`
2- Enter your password (use postgres)
3- Create a root user if doesnt exists `CREATE USER root WITH PASSWORD 'root';`
3- Exit psql terminal by `\q` and login again with root account: `psql -h 127.0.0.1 -U root postgres`
4- Type paswword `root`
5- Create 3 databases
    1- `CREATE DATABASE store_front;`
    2- `CREATE DATABASE store_front_dev;`
    3- `CREATE DATABASE store_front_test;`

### 2. Create databse config file

Create `database.json` file in add directory

```
{
    "test": {
        "driver": "pg",
        "host": "127.0.0.1",
        "database": "store_front_test",
        "user": "root",
        "password": "root"
    },
    "development": {
        "driver": "pg",
        "host": "127.0.0.1",
        "database": "store_front_dev",
        "user": "root",
        "password": "root"
    },
    "production": {
        "driver": "pg",
        "host": "127.0.0.1",
        "database": "store_front",
        "user": "root",
        "password": "root"
    },
    "sql-file" : true
}
```

## Database tables

-   migrations
-   users
-   categories
-   products
-   orders
-   order_products
-   reviews

## Database tables schema

**1. users table**

| Name            | Data type | Length | constrains     | 
| --------------- | --------- | ------ | -------------- |
| id              | integer   |        | PRI SERIAL KEY |
| firstname       | varchar   | 150    | NOT NULL       |
| lastname        | --------- | 150    | NOT NULL       |
| username        | --------- | 150    | NOT NULL       |
| email           | --------- | 150    | NOT NULL       |
| password_digist | --------- | 250    | NOT NULL       |
| role            | --------- | 150    | NOT NULL       |

**2. orders  table**

| Name            | Data type | Length | constrains     | 
| --------------- | --------- | ------ | -------------- |
| id              | integer   |        | PRI SERIAL KEY |
| status          | varchar   | 64     | NOT NULL       |
| total           | float     |        | NOT NULL       |
| user_id         | integer   |        | NOT NULL       |


**3. products  table**

| Name            | Data type | Length | constrains     | 
| --------------- | --------- | ------ | -------------- |
| id              | integer   |        | PRI SERIAL KEY |
| quantity        | integer   |        | NOT NULL       |
| order_id        | integer   |        | NOT NULL       |
| product_id      | integer   |        | NOT NULL       |

**4. order_products  table**

| Name            | Data type | Length | constrains     | 
| --------------- | --------- | ------ | -------------- |
| id              | integer   |        | PRI SERIAL KEY |
| name            | varchar   | 150    | NOT NULL       |
| stock           | integer   |        | NOT NULL       |
| price           | float     |        | NOT NULL       |
| user_id         | integer   |        | NOT NULL       |
| category_id     | integer   |        |                |

**5. review table**

| Name            | Data type | Length | constrains     | 
| --------------- | --------- | ------ | -------------- |
| id              | integer   |        | NOT NULL       |
| service_rating  | float     |        | NOT NULL       |
| feedback        | text      |        | NOT NULL       |

**6. categories table**

| Name            | Data type | Length | constrains     | 
| --------------- | --------- | ------ | -------------- |
| id              | integer   |        | PRI SERIAL KEY |
| name            | varchar   | 150    | NOT NULL       |
| description     | varchar   | 255    |                |

**7. migration table (auto created by db-migrate)**

| Name            | Data type | Length | constrains     | 
| --------------- | --------- | ------ | -------------- |
| id              | integer   |        | PRI SERIAL KEY |
| name            | varchar   | 255    | NOT NULL       |
| run_on          | timestamp | 255    | NOT NULL       |