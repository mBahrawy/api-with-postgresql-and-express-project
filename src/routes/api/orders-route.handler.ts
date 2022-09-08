import express from "express";
import Container from "typedi";
import { OrdersController } from "../../controllers/orders.controller";
import validateRoleMiddleware from "../../middlewares/validate-role.middleware";
import validateTokenMiddleware from "../../middlewares/validate-token.middleware";
import { OrdersService } from "../../services/orders.service";

const { index, show, create } = Container.get(OrdersController);
const { addProduct } = Container.get(OrdersService);

const ordersRouteHandler = (router: express.Router) => {
    // User
    router.get("/orders/:id", [validateTokenMiddleware], show);
    router.put("/orders/:id/products", [validateTokenMiddleware], addProduct);
    router.post("/orders", [validateTokenMiddleware], create);
    // Admin
    router.get("/orders", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], index);
};

export default ordersRouteHandler;
