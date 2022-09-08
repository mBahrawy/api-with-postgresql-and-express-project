import express from "express";
import Container from "typedi";
import { CategoriesController } from "../../controllers/categories.controller";
import validateRoleMiddleware from "../../middlewares/validate-role.middleware";
import validateTokenMiddleware from "../../middlewares/validate-token.middleware";

const { index, show, create, destroy } = Container.get(CategoriesController);

const categoriesRouteHandler = (router: express.Router) => {
    router.get("/categories", index);
    router.get("/categories/:id", show);
    router.post("/categories", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], create);
    router.delete("/categories/:id", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], destroy);
};

export default categoriesRouteHandler;
