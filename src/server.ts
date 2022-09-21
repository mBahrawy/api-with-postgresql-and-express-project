import "reflect-metadata";
import express, { Application } from "express";
import morgan from "morgan";
import routes from "./routes/index.api";
import path from "path";
import cors from "cors";
import * as dotenv from "dotenv";
import { Container } from "typedi";
import { CreateAdmin } from "./services/create-admin.service";
import { exit } from "node:process";

// Defining app base folder
global.__basedir = __dirname;

dotenv.config();
const { NODE_ENV, APP_BACKEND_PORT_DEVELOPMENT, APP_BACKEND_PORT_PRODUCTION, APP_BACKEND_PORT_TEST } = process.env;

console.log("NODE_ENV--->", NODE_ENV);
console.log("APP_BACKEND_PORT_PRODUCTION--->", APP_BACKEND_PORT_PRODUCTION);


if (NODE_ENV) {
    console.log(`App started in ${NODE_ENV} mode`);
} else {
    console.log("Error, Undefined app mode, check .env file.");
    exit(1);
}

let PORT;
NODE_ENV === "development" && (PORT = APP_BACKEND_PORT_DEVELOPMENT);
NODE_ENV === "production" && (PORT = APP_BACKEND_PORT_PRODUCTION);
NODE_ENV === "test" && (PORT = APP_BACKEND_PORT_TEST);

// Creating admin
const { createAdmin } = Container.get(CreateAdmin);
createAdmin();

// create an instance server
const app: Application = express();

// HTTP request logger middleware
app.use(morgan("dev"));

// Require static assets from public folder
app.use("/public", express.static(path.join(__dirname, "./public")));

// CORS
app.use(
    cors({
        origin: ["http://localhost:3000"]
    })
);
app.use("/", routes);

// start express server
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is starting at port: ${PORT}`);
});

export default app;
