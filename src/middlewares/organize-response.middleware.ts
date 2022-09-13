import { Request, Response } from "express";

const organizeResponse = (req: Request, res: Response, next: Function): void => {
    next();
};

export default organizeResponse;
