import express from "express";
import Container from "typedi";
import validateRoleMiddleware from "../../middlewares/validate-role.middleware";
import validateTokenMiddleware from "../../middlewares/validate-token.middleware";
import { ProductsController } from "../../controllers/products.controller";
import { ProductsService } from "../../services/products.service";

const { index, show, create, destroy } = Container.get(ProductsController);
const { productsByCategory } = Container.get(ProductsService);

const productsRouteHandler = (router: express.Router) => {
    // Public
    router.get("/products", index);
    router.get("/products/:id", show);
    router.get("/products/category/:id", productsByCategory);
    // Admin
    router.post("/products", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], create);
    router.delete("/products/:id", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], destroy);
};

export default productsRouteHandler;
