import express, { Request, Response } from "express";
import { LoginRespond } from "../../interfaces/responds/loginResponde";
import { AuthService } from "../../services/auth.service";

const loginController = async (req: Request, res: Response) => {
    AuthService.login(req.body.username, req.body.password)
        .then((user: LoginRespond) => res.status(user.status).json(user))
        .catch((err: Error) => res.status(500).json(err.message));
};

const loginRouteHandler = (router: express.Router) => {
    router.get("/login", loginController);
};

export default loginRouteHandler;
