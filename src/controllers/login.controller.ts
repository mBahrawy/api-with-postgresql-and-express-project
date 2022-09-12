import Container from "typedi";
import { Request, Response } from "express";
import { DatabaseError } from "../interfaces/responses/DatabaseError";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { User } from "../interfaces/User";
import { AuthService } from "../services/auth.service";

interface LoginResponse extends ErrorResponse {
    user?: User;
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const auth = Container.get(AuthService);
        const loginResponse: LoginResponse = await auth.login(req.body.username, req.body.password);
        res.status(loginResponse.status).json(loginResponse);
    } catch (err: any) {
        const errorResponse: ErrorResponse = {
            status: 500,
            error: err.message
        };
        res.status(errorResponse.status).json(errorResponse);
    }
};