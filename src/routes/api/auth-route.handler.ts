import express from "express";
import Container from "typedi";
import { loginController } from "../../controllers/login.controller";
import { UsersController } from "../../controllers/users.controller";

const { create } = Container.get(UsersController);

const authRouteHandler = (router: express.Router) => {
    // Public
    router.get("/login", loginController);
    router.post("/register", create.bind(this, "regular"));
    router.post("/register/admin", create.bind(this, "admin"));
};

export default authRouteHandler;
