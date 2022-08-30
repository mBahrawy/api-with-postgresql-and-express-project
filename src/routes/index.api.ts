import express, { Request, Response, Router } from "express";
import booksRouteHandler from "./api/books-route.handler";
import usersRouteHandler from "./api/users-route.handler";
import logger from "../services/logging.service";
import loginRouteHandler from "./api/login-route.handler";

const routes: Router = express.Router();

// for parsing application/json
routes.use(express.json());

// for parsing application/x-www-form-urlencoded
routes.use(express.urlencoded({ extended: true }));

// Home route
routes.get("/", logger, (req: Request, res: Response) => {
    res.status(200).send(`<h2>Welcome to store front API</h2>`);
});

booksRouteHandler(routes);
usersRouteHandler(routes);
loginRouteHandler(routes);

// Backedend routes
routes.get("*", logger, (req: Request, res: Response) => {
    res.status(404).send(`<h2>Sorry, no data found in this route, go to home route for more options on '/'</h2>`);
});

export default routes;
