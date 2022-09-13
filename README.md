# Store front Backend API (Node, Express, PostgresSQL)
This project for Udacity EgFwd Fullstack Nanodegree project 

## How to run Image the Store front API project:
First, open terminal inside project directory, and run these commands

- `npm i` for installing needed dependencies.
- `npm start` for running development environment (through port will be 4000).
- `npm run build` for building the production version.
- `npm run serve` for running the production version (through port will be 8000).
- `npm run test` for running implemneted unit tests (through port will be 6000).


## Download Postman API collection:
- An exported file from Postman is (avaliable here)[https://drive.google.com/file/d/1wWgc6PAcKh6tE17ZeZduJUKldNPseLF3/view?usp=sharing]

## Preparing application environments:
- `.env.development`
- `.env.production`
- `.env.test`

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

## Preparing application database configration:

### 1. Create the needed databases
Create 3 databases by using PgAdmin software or by psql cli
- `store_front`
- `store_front_dev`
- `store_front_test`

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

