import express from "express";
import Container from "typedi";
import { ProductsController } from "../../controllers/products.controller";
import productsAuthMiddleware from "../../middlewares/products-auth.middleware";
import validateTokenMiddleware from "../../middlewares/validate-token.middleware";

const { index, show, create, destroy } = Container.get(ProductsController);

const productsRouteHandler = (router: express.Router) => {
    router.get("/products", index);
    router.get("/products/:id", show);
    router.post("/products", [validateTokenMiddleware], create);
    router.delete("/products/:id", [validateTokenMiddleware, productsAuthMiddleware], destroy);
};

export default productsRouteHandler;
