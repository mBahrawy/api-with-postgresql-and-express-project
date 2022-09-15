import { Service } from "typedi";
import { Request, Response } from "express";
import { UsersModel } from "../models/user.model";
import { ErrorResponsesService } from "../services/error-responses.service";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";

@Service()
export class UsersController {
    constructor(private _usersModel: UsersModel, private _errorResponseService: ErrorResponsesService) {}

    public index = async (req: Request, res: Response) => {
        try {
            const usersRes = await this._usersModel.index();
            res.status(usersRes.status).json(usersRes);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const userRes = await this._usersModel.show(req.params.id);
            res.status(userRes.status).json(userRes);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };

    public destroy = async (req: Request, res: Response) => {
        try {
            const deletedUserRes = await this._usersModel.destroy(req.params.id);
            res.status(deletedUserRes.status).json(deletedUserRes);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };
}
