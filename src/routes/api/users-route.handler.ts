import express from "express";
import Container from "typedi";
import { UsersController } from "../../controllers/users.controller";
import validateTokenMiddleware from "../../middlewares/validate-token.middleware";
import validateRoleMiddleware from "./../../middlewares/validate-role.middleware";

const { create, index, show, destroy } = Container.get(UsersController);

const usersRouteHandler = (router: express.Router) => {
    router.post("/admins", create);
    router.post("/users", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], create);
    router.get("/users", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], index);
    router.get("/users/:id", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], show);
    router.delete("/users/:id", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], destroy);
};

export default usersRouteHandler;
