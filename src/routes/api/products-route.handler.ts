import express from "express";
import Container from "typedi";
import validateRoleMiddleware from "../../middlewares/validate-role.middleware";
import validateTokenMiddleware from "../../middlewares/validate-token.middleware";
import { ProductsController } from "../../controllers/products.controller";
import { ProductsService } from "../../services/products.service";
import { param } from "express-validator";
import emitError from "../../middlewares/errors-emiter.middleware";

const { index, show, create, destroy } = Container.get(ProductsController);
const { productsByCategory } = Container.get(ProductsService);

const productsRouteHandler = (router: express.Router) => {
    // Public
    router.get("/products", index);
    router.get("/products/:id", [param("id").isNumeric().withMessage("Must send a valid product id"), emitError], show);
    router.get(
        "/products/category/:id",
        [param("id").isNumeric().withMessage("Must send a valid category id"), emitError],
        productsByCategory
    );

    // Admin
    router.post("/products", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], create);
    router.delete(
        "/products/:id",
        [
            param("id").isNumeric().withMessage("Must send a valid product id"),
            emitError,
            validateTokenMiddleware,
            validateRoleMiddleware.bind(this, ["admin"])
        ],
        destroy
    );
};

export default productsRouteHandler;
