import { Request, Response } from "express";

const logger = (req: Request, res: Response, next: Function): void => {
    const url = req.url;
    // eslint-disable-next-line no-console
    console.log(`${url} was visited`);
    next();
};

export default logger;
