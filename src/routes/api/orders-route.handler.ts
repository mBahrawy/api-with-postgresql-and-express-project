import express from "express";
import Container from "typedi";
import { OrdersController } from "../../controllers/orders.controller";
import validateRoleMiddleware from "../../middlewares/validate-role.middleware";
import validateTokenMiddleware from "../../middlewares/validate-token.middleware";
import { OrdersService } from "../../services/orders.service";
import { body, param } from "express-validator";

import emitError from "../../middlewares/errors-emiter.middleware";

const { index, show, create } = Container.get(OrdersController);
const { addProduct } = Container.get(OrdersService);
const { completeOrder } = Container.get(OrdersService);

const ordersRouteHandler = (router: express.Router) => {
    // User
    router.get(
        "/orders/:id",
        [param("id").isNumeric().withMessage("Must send a valid order id"), emitError, validateTokenMiddleware],
        show
    );
    router.put(
        "/orders/:id/products",
        [param("id").isNumeric().withMessage("Must send a valid order id"), emitError, validateTokenMiddleware],
        addProduct
    );
    router.post("/orders", [validateTokenMiddleware], create);
    router.put(
        "/orders/:id/complete",
        [param("id").isNumeric().withMessage("Must send a valid order id"), emitError, validateTokenMiddleware],
        completeOrder
    );
    // Admin
    router.get("/orders", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], index);
};

export default ordersRouteHandler;
