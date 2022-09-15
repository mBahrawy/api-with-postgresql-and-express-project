import express from "express";
import Container from "typedi";
import { CategoriesController } from "../../controllers/categories.controller";
import validateRoleMiddleware from "../../middlewares/validate-role.middleware";
import validateTokenMiddleware from "../../middlewares/validate-token.middleware";
import { body, param } from "express-validator";
import emitError from "../../middlewares/errors-emiter.middleware";

const { index, show, create, destroy } = Container.get(CategoriesController);

const categoriesRouteHandler = (router: express.Router) => {
    // Public
    router.get("/categories", index);
    router.get("/categories/:id", show);
    // Admin
    router.post(
        "/categories",
        [
            body("name").exists().withMessage("Must add a category name"),
            body("description").exists().withMessage("Must add a category description"),
            emitError,
            validateTokenMiddleware,
            validateRoleMiddleware.bind(this, ["admin"])
        ],
        create
    );
    router.delete(
        "/categories/:id",
        [
            param("id").isNumeric().withMessage("Must send a valid category id"),
            emitError,
            validateTokenMiddleware,
            validateRoleMiddleware.bind(this, ["admin"])
        ],
        destroy
    );
};

export default categoriesRouteHandler;
