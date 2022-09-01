import express from "express";
import Container from "typedi";
import { UsersController } from "../../controllers/users.controller";
import validateTokenMiddleware from "../../middlewares/validate-token.middleware";
import validateRoleMiddleware from "./../../middlewares/validate-role.middleware";

const users = Container.get(UsersController);

const usersRouteHandler = (router: express.Router) => {
    router.post("/create-user", users.create);
    router.get("/all-users", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], users.index);
    router.get("/get-user/:id", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], users.show);
    router.delete("/delete-user/:id", [validateTokenMiddleware, validateRoleMiddleware.bind(this, ["admin"])], users.destroy);
};

export default usersRouteHandler;
