import Container, { Service } from "typedi";
import { Request, Response } from "express";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { User } from "../interfaces/User";
import { AuthService } from "../services/auth.service";
import { ErrorResponsesService } from "../services/error-responses.service";

interface LoginResponse extends ErrorResponse {
    user?: User;
}

@Service()
export class AuthController {
    constructor(private _errorResponseService: ErrorResponsesService) {}

    public login = async (req: Request, res: Response) => {
        const { createError } = Container.get(ErrorResponsesService);

        try {
            const auth = Container.get(AuthService);
            const loginResponse: LoginResponse = await auth.login(req.body.username, req.body.password);
            res.status(loginResponse.status).json(loginResponse);
        } catch (err: any) {

            const errorResponse: ErrorResponse = createError(err.message, 500);
            res.status(errorResponse.status).json(errorResponse);
        }
    };
    public register = async (req: Request, res: Response) => {
        try {
            const auth = Container.get(AuthService);

            const user: User = {
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                role: "regular"
            };

            const newUserRes = await auth.register(user);
            res.status(newUserRes.status).json(newUserRes);
        } catch (err: any) {
            console.log(err);
            res.status(err.status).json(err.errors);
        }
    };
}
