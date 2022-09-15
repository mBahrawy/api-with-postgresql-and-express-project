import { Request, Response } from "express";
import myCustomValidationResult from "../services/express-validator-formatter.service";

const emitError = (req: Request, res: Response, next: Function) => {
    const errors = myCustomValidationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export default emitError;
