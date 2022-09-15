import { Request, Response } from "express";
import Container from "typedi";
import { ErrorResponsesService } from "../services/error-responses.service";
import myCustomValidationResult from "../tests/helpers/express-validator-formatter";

const emitError = (req: Request, res: Response, next: Function) => {
    const errors = myCustomValidationResult(req);
    const { validationErrors } = Container.get(ErrorResponsesService);

    if (!errors.isEmpty()) {
        const error = validationErrors(errors.array());
        console.log(error);
        
        return res.status(error.status).json(error);
    }
    next();
};

export default emitError;
