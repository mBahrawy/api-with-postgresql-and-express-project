import express, { Request, Response, Router } from "express";
import logger from "../utilities/logging-untilities";

const routes: Router = express.Router();

// Home route
routes.get("/", logger, (req: Request, res: Response) => {
    res.status(200).send(`<h2>Welcome to store front API</h2>`);
});

// Backedend routes
routes.get("*", logger, (req: Request, res: Response) => {
    res.status(404).send(`<h2>Sorry, no data found in this route, go to home route for more options on '/'</h2>`);
});

export default routes;
