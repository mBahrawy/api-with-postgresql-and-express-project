import express from "express";
import { loginController } from "../../controllers/login.controller";

const authRouteHandler = (router: express.Router) => {
    // Public
    router.get("/login", loginController);
    router.post("/register");
};

export default authRouteHandler;
