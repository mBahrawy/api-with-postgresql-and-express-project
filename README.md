# Store front Backend API (Node, Express, PostgresSQL)

This project for Udacity EgFwd Fullstack Nanodegree project

## Download Postman API collection:

-   An exported file from Postman is [avaliable here](https://drive.google.com/drive/folders/1SNfdUVb3rMMiqzdrqPD5ZS6Pw9FhDsp8?usp=sharing)

## How to run Image the Store front API project:

First, open terminal inside project directory, and run these commands

-   `npm i` for installing needed dependencies.
-   `npm start` for running development environment (through port will be 4000).
-   `npm run build` for building the production version.
-   `npm run serve` for running the production version (through port will be 8000).
-   `npm run test` for running implemneted unit tests (through port will be 6000).

## Used ports:
| Port              | Usage                           |
| ----------------- | ------------------------------- |
| 4000              | running app in development mode |
| 6000              | running app tests               |  
| 8000              | running app in production mode  |
| 5432              | Postgres Database               |

## Users and roles
| Role              | Description                           |
| ----------------- | ------------------------------------- |
| Admin             | An administrator user acccount for the app, It will be create once at the first time you start the app. You can change login info for the `.env` file. The info inside `.env` can be modifed once per app installation, or edit mamually inside database. |
| Regular           | Normal user, or clint                 |  


## Application API documentation:
- Used Authentication type is `Bearer` by JWT plugin    

### Not authorized/public APIs:
| Endpoint                                          | Method | Auth | Role/Constrain           | Usage                                       | Body sample      |
| ------------------------------------------------- | ------ | ---- | ------------------------ | ------------------------------------------- |----------------- |
| `/login`                                          | POST   | No   |                          | login user, works with for all user roles | <code>{ &nbsp;"username": "user",&nbsp;"password": "user123"}</code>   |
| `/register`                                       | POST   | No   |                          | create new user                             | <code>{<br><br>&nbsp;"firstname": "user",<br>&nbsp;"lastname": "user",<br>&nbsp;"username": "user",<br>&nbsp;"email": "user@user.com",<br>&nbsp;"password": "user123"<br>}</code> |
| ----                                              | ----   | ---- | ----                     | ----                                        |                  |
| `/products/:id`                                   | GET    | No   |                          | Getting a single product with product id            |                  |
| `/products/category/:id`                          | GET    | No   |                          | Getting all products related to category id |                  |
| `/products`                                       | POST   | Yes  | Admin only               | Will create a new product                   | <code>{<br><br>&nbsp;"name": "USB cable 3",<br>&nbsp;"price": 10,<br>&nbsp;"stock": 250<br>}</code> |
| `/products/:id`                                   | DELETE | Yes  | Admin only               | Will delete a product with id               |                  |
| ----                                              | ----   | ---- | ----                     | ----                                        |                  |
| `/orders`                                         | GET    | Yes  | Admin only               | Getting all orders                          |                  |
| `/orders/:id`                                     | GET    | Yes  | Admin<br> or order_owner | Get order details with                      |                  |
| `/orders`                                         | POST   | Yes  | Any role                 | Create new order, Empty or with products    | <code>{<br>&nbsp; "products": [<br>&nbsp; &nbsp;{ "id": 11, "quantity": 2 },<br>&nbsp; &nbsp;{ "id": 12, "quantity": 3 }<br>&nbsp;]<br>}</code> |
| `/orders/:id/products`                            | PUT    | Yes  | Admin<br> or order_owner | Add a product to order, must be with status is 'open'    |                  |
| `/orders/:id/complete`                            | PUT    | Yes  | order_owner only         | Change order status from 'open' to 'completed',<br> It must be an order with products and its previous status is 'opne', <br>User can add a 0-5 star rate and leave a text feedback.    | <code>{<br>&nbsp;"service_rating": 2.5,<br>&nbsp;"feedback": "good service."<br>}</code> |
| ----                                              | ----   | ---- | ----                     | ----                                        |                  |
| `/orders/categories`                              | GET    | NO   |                          | Getting all added categories    |  |
| `/orders/categories/:d`                           | GET    | NO   |                          | Getting a single category information by category id    |  |
| `/orders/categories`                              | POST   | Yes  | Admin only               | Will create a new category    | <code>{<br>&nbsp;"name": "Mobiles",<br>&nbsp;"description": "All about mobiles"<br>}</code> |
| `/orders/categories/:d`                           | DELETE | Yes  | Admin only               | Will delete a category    |  |
| ----                                              | ----   | ---- | ----                     | ----                                        |                  |
| `/orders/reviews`                                 | GET    | Yes  | Admin only               | Get all reviews, please note that review id is the same crosponsind order id   |   |
| `/orders/reviews/:id`                             | GET    | Yes  | Admin only               | Get a single review with order id   |   |
| `/orders/reviews`                                 | POST   | Yes  | order_owner only         | Will leave a review for an order, It must be completed, have products, and wasn't  already reviwed    | <code>{<br><br>&nbsp;"id": 13,<br>&nbsp;"service_rating": 1.5,<br>&nbsp;"feedback": "good service."<br>}</code> |
| ----                                              | ----   | ---- | ----                     | ----                                        |                  |
| `/orders/users`                                   | GET    | Yes  | Admin only               | Get all users in databse   |   |
| `/orders/users/:id`                               | GET    | Yes  | Admin only               | Get a single user with user id   |   |
| `/orders/users/:id`                               | DELETE | Yes  | Admin only               | Delete a user with user id   |   |




## Application environment file:
Create `.env` in app directory

```
# Auto genrated admin account on first time loading the application
ADMIN_NAME=first_admin
ADMIN_EMAIL=first_admin@admin
ADMIN_PASSWORD=Admin123

# Application ports
APP_BACKEND_PORT_DEVELOPMENT=4000
APP_BACKEND_PORT_PRODUCTION=5000
APP_BACKEND_PORT_TEST=6000

# Application base url/domains
APP_BACKEND_BASE_URL_development=http://localhost
APP_BACKEND_BASE_URL_production=http://localhost
APP_BACKEND_BASE_URL_test=http://localhost

# Application databases
POSTGRES_DATABASE_development=store_front
POSTGRES_DATABASE_production=store_front_dev
POSTGRES_DATABASE_test=store_front_test

# Postgres databse connection
POSTGRES_HOST=127.0.0.1
POSTGRES_USERNAME=root
POSTGRES_PASSWORD=root
POSTGRES_PORT=5432

# JWD securing tokens
BCRYPT_PASSWORD=kds7ys.8G5$%tfs
SALT_ROUNDS=12
TOKEN_SECRET=JWTTOKENSERCRET
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

## ERD Diagram
![Store front app ERD](https://lh3.googleusercontent.com/fife/AAbDypA0rsoXhib4gDvwpTGqNC1Gi7gN6kiPz_ev8Cptvri1CgivLWRfoBlDz-Lbg_Z_QgPsCZ6hAE1Qj8NDVkSggogF_Bb-ynyEwFKfdUyDLt0YldlelHbyowXlTbptuRm8n-SDYJdyKYK785p84CQG3UTJJTsujRp8DJaGS5rOcetjRq96E1zkes9LFYI4_VBImL3N0QAP2q7Vbj461yiUg5viMd5WXEMeq-u9n8Sra-Q21jfK4qag51qdJ_8rHoB2gL1wKtRGLRBXSv-vXSMDfDFvyjRI5LJTphcWmZ71dd5NubSd5CrwN-gEOl_rXUH4nWuLhcpWqPsUObKkLAzIjdEaXhafmWGytkzN82uJ89PFoOvNVBtUw5KrDG148YUT1W2TZrTOdn5sQAhoLbzX6SWFbxEfwhZFgacmhyExeTvEo3FQyE6S5zcJM-RPpS0JDlqdz5FbKUxaNtTpyuOrPVojG_mrxOEBVUg4Jxb8DZNMRiNGNq7cY0WFUK8hOtRCynXKnkZotKIRHMvTzW6ZBgZMYVgYaf6dNHxsEVcDSZN4-ZueF9XlJ9-wQWkBmPsa3uDKKkx-xgf0gOSicH1mW6LWUU78svyaARP7mPbyU-8AGJa5pj1I_Udsj8TUVaOWaSVoXuJNd-k1qg1fxgEe_ibc18WKtd_8VDUYCgugrHgme0CoQu5syHLNjlp7h_NZ86nlkbHzGNpBBre4wsLGMSRf0z4m7Tkt6pBE5_UHtfqPa_I8KEAJsI60aeTSDFkNAz9eJpXwA0q1E_-pka5GT6YYXsegx-KITWRomMfdKo88aAC1Z7TGklm5yvwx8unzrZXDAsmoeJy8hlolMgG4Kwg8O-OL2yVkK6DG2iO0EwYUARbtggDUsClmEG-Ml0dJF63udhSITu7Ba2kO9F0mnEaICqowso3nilCUzhDg-cX6EMklqNu_V4eNr4_svgaF8wFDSmAHvuvfVNmkpD_sWEa5OB8G3yXV09osagOyqUhG-DfwKV5LTLruyKEOQAROQGmbep6LTLdjYjY_5J-peIi3EuQgruAb1xohApc1m2fzgvQ3SZHgUSp49Crz24Pz1dEOE-KJlCcL1g-vxLFvVEhGSJULjfkq-0CQZFQXGcVauQbUNH4sxWLDWJEMEO-T5AeG93mDYlnwFCNemy_EQNrNi9tXI8sY9YMpN2q6Br4e7DpwRT7r78goDVK3T5xESrzLiNM9UPCGv8yw69oLTCwfaeM20qosQQegc3iaCVemVyUC9wKQwZRUMP_n2DFeghsP1RhN9MXADZFjUYkScZLnNZJVVC8cNuy62E-jzSFa=w1203-h882)
