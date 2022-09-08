import { Service } from "typedi";
import { Request, Response } from "express";
import { UsersModel } from "../models/user.model";
import { User, userRole, USER_ROLES_ARR } from "../interfaces/User";
import { DatabaseError } from "./../interfaces/responses/DatabaseError";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { ErrorResponsesService } from "../services/error-responses.service";

type params = [userRole, Request, Response];

@Service()
export class UsersController {
    constructor(private _usersModel: UsersModel, private _errorResponseService: ErrorResponsesService) {}

    public index = async (req: Request, res: Response) => {
        try {
            const usersRes = await this._usersModel.index();
            res.status(usersRes.status).json(usersRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const userRes = await this._usersModel.show(req.params.id);
            res.status(userRes.status).json(userRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };

    public create = async (...params: params) => {
        const [role, req, res] = params;

        try {
            const user: User = {
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                role: role
            };

            const newUserRes = await this._usersModel.create(user);
            res.status(newUserRes.status).json(newUserRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            switch (databseError.sqlError.code) {
                case "23502": {
                    // not_null_violation
                    const dbErr = this._errorResponseService.nullValues("Some inputs are required, please check them and try again.");
                    res.status(dbErr.status).json(dbErr);
                    break;
                }
                case "23505": {
                    // unique_violation
                    const dbErr = this._errorResponseService.dublicatedValues("Username/Email is already exsists in databse.");
                    res.status(dbErr.status).json(dbErr);
                    break;
                }
                default:
                    res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
            }
        }
    };

    public destroy = async (req: Request, res: Response) => {
        try {
            const deletedUserRes = await this._usersModel.delete(req.params.id);
            res.status(deletedUserRes.status).json(deletedUserRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };
}
