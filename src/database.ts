import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const databaseConnection = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USERNAME,
    password: `${process.env.POSTGRES_PASSWORD}`,
    port: Number(process.env.POSTGRES_PORT)
});

export default databaseConnection;
