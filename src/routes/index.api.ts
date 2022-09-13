import express, { Request, Response, Router } from "express";
import usersRouteHandler from "./api/users-route.handler";
import logger from "../services/logging.service";
import authRouteHandler from "./api/auth-route.handler";
import productsRouteHandler from "./api/products-route.handler";
import ordersRouteHandler from "./api/orders-route.handler";
import categoriesRouteHandler from "./api/categories-route.handler";
import reviewsRouteHandler from "./api/reviews-route.handler";

const routes: Router = express.Router();

// for parsing application/json
routes.use(express.json());

// for parsing application/x-www-form-urlencoded
routes.use(express.urlencoded({ extended: true }));

// Home route
routes.get("/", logger, (req: Request, res: Response) => {
    res.status(200).send(`<h2>Welcome to store front API</h2>`);
});

reviewsRouteHandler(routes);
categoriesRouteHandler(routes);
productsRouteHandler(routes);
ordersRouteHandler(routes);
usersRouteHandler(routes);
authRouteHandler(routes);

// Backedend routes
routes.get("*", logger, (req: Request, res: Response) => {
    res.status(404).send(`<h2>Sorry, no data found in this route, go to home route for more options on '/'</h2>`);
});

export default routes;
