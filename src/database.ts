import { Pool } from "pg";

const databaseConnection = new Pool({
    host: process.env.POSTGRES_DATABASE,
    database: process.env.POSTGRES_LOCALHOST,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD
});

export default databaseConnection;
