import express from "express";
import Container from "typedi";
import validateTokenMiddleware from "../../middlewares/validate-token.middleware";
import validateRoleMiddleware from "./../../middlewares/validate-role.middleware";
import { UsersController } from "../../controllers/users.controller";

const { index, show, destroy } = Container.get(UsersController);

const usersRouteHandler = (router: express.Router) => {
    // Admin
    router.get("/users", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], index);
    router.get("/users/:id", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], show);
    router.delete("/users/:id", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], destroy);
};

export default usersRouteHandler;
