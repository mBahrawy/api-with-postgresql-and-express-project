import { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { JWT } from "../services/jwt.service";

const validateTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const jwt = Container.get(JWT);

    const notAuthErrorResponse = {
        status: 401,
        error: "Not authorized action"
    };

    if (!req.headers.authorization || !jwt.isValidToken(req.headers.authorization)) {
        res.status(notAuthErrorResponse.status).json(notAuthErrorResponse);
        return;
    }

    next();
};

export default validateTokenMiddleware;
