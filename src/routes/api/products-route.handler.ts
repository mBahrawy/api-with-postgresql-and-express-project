import express from "express";
import Container from "typedi";
import { ProductsController } from "../../controllers/products.controller";
import productsAuthMiddleware from "../../middlewares/products-auth.middleware";
import validateTokenMiddleware from "../../middlewares/validateToken.middleware";

const products = Container.get(ProductsController);

const productsRouteHandler = (router: express.Router) => {
    router.get("/all-products", [validateTokenMiddleware], products.index);
    router.get("/get-product/:id", [validateTokenMiddleware, productsAuthMiddleware], products.show);
    router.post("/create-product", [validateTokenMiddleware], products.create);
    router.delete("/delete-product/:id", [validateTokenMiddleware, productsAuthMiddleware], products.destroy);
};

export default productsRouteHandler;
