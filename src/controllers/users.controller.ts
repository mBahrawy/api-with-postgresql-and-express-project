import { Service } from "typedi";
import { Request, Response } from "express";
import { UsersModel } from "../models/user.model";
import { User } from "../interfaces/User";
import { DatabaseError } from "./../interfaces/responses/DatabaseError";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";

@Service()
export class UsersController {
    constructor(private _usersModel: UsersModel) {}

    private _serverErrorResponse = {
        error: "Something went wrong, please try later",
        status: 500
    };

    private _nullValuesResponse: ErrorResponse = {
        error: "Some inputs are required, please check them and try again.",
        status: 400
    };

    private _dublicatedValuesResponse: ErrorResponse = {
        error: "Username/Email is already exsists in databse.",
        status: 400
    };

    public index = async (req: Request, res: Response) => {
        try {
            const usersRes = await this._usersModel.index();
            res.status(usersRes.status).json(usersRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._serverErrorResponse.status).json(this._serverErrorResponse);
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const userRes = await this._usersModel.show(req.params.id);
            res.status(userRes.status).json(userRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._serverErrorResponse.status).json(this._serverErrorResponse);
        }
    };

    public create = async (req: Request, res: Response) => {
        try {
            const user: User = {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            };

            const newUserRes = await this._usersModel.create(user);
            res.status(newUserRes.status).json(newUserRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            switch (databseError.sqlError.code) {
                case "23502": // not_null_violation
                    res.status(this._nullValuesResponse.status).json(this._nullValuesResponse);
                    break;
                case "23505": // unique_violation
                    res.status(this._dublicatedValuesResponse.status).json(this._dublicatedValuesResponse);
                    break;
                default:
                    res.status(this._serverErrorResponse.status).json(this._serverErrorResponse);
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
            res.status(this._serverErrorResponse.status).json(this._serverErrorResponse);
        }
    };
}
 