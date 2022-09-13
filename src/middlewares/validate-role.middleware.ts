import { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { userRole } from "../interfaces/User";
import { JWT } from "../services/jwt.service";

type params = [userRole[], Request, Response, NextFunction];

const validateRoleMiddleware = (...params: params) => {
    const [rolesArr, req, res, next] = params;

    const jwt = Container.get(JWT);

    const forbiddenErrorResponse = {
        status: 403,
        error: "You are not authorized, you must be an admin to do this action."
    };

    const decodedUserRole = jwt.decodedToken(req.headers.authorization as string).user.role as userRole;

    if (!rolesArr.includes(decodedUserRole)) {
        res.status(forbiddenErrorResponse.status).json(forbiddenErrorResponse);
        return;
    }

    next();
};

export default validateRoleMiddleware;
