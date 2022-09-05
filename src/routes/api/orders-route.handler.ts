import express from "express";
import Container from "typedi";
import { OrdersController } from "../../controllers/orders.controller";
import validateTokenMiddleware from "../../middlewares/validate-token.middleware";
import { OrdersService } from "../../services/orders.service";

const { index, show, create } = Container.get(OrdersController);
const { addProduct } = Container.get(OrdersService);

const ordersRouteHandler = (router: express.Router) => {
    router.get("/orders", index);
    router.get("/orders/:id", show);
    router.post("/orders/:id/products", addProduct);
    router.post("/orders", create);
};

export default ordersRouteHandler;
