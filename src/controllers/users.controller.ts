import { Service } from "typedi";
import { Request, Response } from "express";
import { UsersModel } from "../models/user.model";
import { User } from "../interfaces/User";
import { ErrorResponsesService } from "../services/error-responses.service";

@Service()
export class UsersController {
    constructor(private _usersModel: UsersModel, private _errorResponseService: ErrorResponsesService) {}

    public index = async (req: Request, res: Response) => {
        try {
            const usersRes = await this._usersModel.index();
            res.status(usersRes.status).json(usersRes);
        } catch (err: any) {
            console.log(err);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const userRes = await this._usersModel.show(req.params.id);
            res.status(userRes.status).json(userRes);
        } catch (err: any) {
            console.log(err);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };

    public create = async (req: Request, res: Response) => {

        try {
            const user: User = {
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                role: "regular"
            };

            const newUserRes = await this._usersModel.create(user);
            res.status(newUserRes.status).json(newUserRes);
        } catch (err: any) {
            console.log(err);

            if (err?.sqlError?.code === "23502") {
                // Databse error - not_null_violation
                res.status(this._errorResponseService.nullValues().status).json(this._errorResponseService.nullValues());
                return;
            }
            if (err?.sqlError?.code === "23505") {
                // Databse error - unique_violation
                res.status(this._errorResponseService.dublicatedValues().status).json(this._errorResponseService.dublicatedValues());
                return;
            }

            // Backend error
            const backendError = this._errorResponseService.createError(err.error, err.status);
            res.status(err.status).json(backendError);
        }
    };

    public destroy = async (req: Request, res: Response) => {
        try {
            const deletedUserRes = await this._usersModel.destroy(req.params.id);
            res.status(deletedUserRes.status).json(deletedUserRes);
        } catch (err: any) {
            console.log(err);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };
}
