import express from "express";
import Container from "typedi";
import { UsersController } from "../../controllers/users.controller";

const users = Container.get(UsersController);

const usersRouteHandler = (router: express.Router) => {
    router.get("/all-users", users.index);
    router.get("/get-user/:id", users.show);
    router.post("/create-user", users.create);
    router.delete("/delete-user/:id", users.destroy);
};

export default usersRouteHandler;
