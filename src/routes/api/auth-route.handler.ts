import express from "express";
import { body } from "express-validator";
import { AuthController } from "./../../controllers/auth.controller";
import Container from "typedi";
import emitError from "../../middlewares/errors-emiter.middleware";

const { login, register } = Container.get(AuthController);

const authRouteHandler = (router: express.Router) => {
    // Public
    router.post(
        "/login",
        [
            body("username").exists().withMessage("Must send a username"),
            body("password").exists().withMessage("Must send a password").isLength({ min: 6 }).withMessage("Password min length is 6"),
            emitError
        ],
        login
    );

    router.post(
        "/register",
        [
            body("username").exists().withMessage("Must send a username"),
            body("password").exists().withMessage("Must send a password").isLength({ min: 6 }).withMessage("Password min length is 6"),
            body("firstname").isAlpha().withMessage("Must send a valid first name"),
            body("lastname").isAlpha().withMessage("Must send a valid last name"),
            body("email").isEmail().withMessage("Must send valid email"),
            emitError
        ],
        register
    );
};

export default authRouteHandler;
