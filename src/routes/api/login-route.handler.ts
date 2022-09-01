import express, { Request, Response } from "express";
import Container from "typedi";
import { DatabaseError } from "../../interfaces/responses/DatabaseError";
import { ErrorResponse } from "../../interfaces/responses/ErrorResponse";
import { User } from "../../interfaces/User";
import { AuthService } from "../../services/auth.service";

interface LoginResponse extends ErrorResponse {
    user?: User;
}

const loginController = async (req: Request, res: Response) => {
    try {
        const auth = Container.get(AuthService);
        const loginResponse: LoginResponse = await auth.login(req.body.username, req.body.password);
        res.status(loginResponse.status).json(loginResponse);
    } catch (err: unknown) {
        const databaseError = err as DatabaseError;
        const errorResponse: ErrorResponse = {
            status: 500,
            error: databaseError.message
        };
        res.status(errorResponse.status).json(errorResponse);
    }
};

const loginRouteHandler = (router: express.Router) => {
    router.get("/login", loginController);
};

export default loginRouteHandler;
