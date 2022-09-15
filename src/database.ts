import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const {
    NODE_ENV,
    POSTGRES_HOST,
    POSTGRES_DATABASE_development,
    POSTGRES_DATABASE_test,
    POSTGRES_DATABASE_production,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD,
    POSTGRES_PORT
} = process.env;

let databaseConnection;

if (NODE_ENV === "development") {
    databaseConnection = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DATABASE_development,
        user: POSTGRES_USERNAME,
        password: `${POSTGRES_PASSWORD}`,
        port: Number(POSTGRES_PORT)
    });
}
if (NODE_ENV === "production") {
    databaseConnection = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DATABASE_production,
        user: POSTGRES_USERNAME,
        password: `${POSTGRES_PASSWORD}`,
        port: Number(POSTGRES_PORT)
    });
}
if (NODE_ENV === "test") {
    databaseConnection = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DATABASE_test,
        user: POSTGRES_USERNAME,
        password: `${POSTGRES_PASSWORD}`,
        port: Number(POSTGRES_PORT)
    });
}

export default databaseConnection;
