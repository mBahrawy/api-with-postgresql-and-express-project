import { Service } from "typedi";
import { Request, Response } from "express";
import { CategoriesModel } from "../models/category.model";
import { Category } from "../interfaces/Category";
import { JWT } from "../services/jwt.service";
import { DatabaseError } from "../interfaces/responses/DatabaseError";
import { ErrorResponsesService } from "../services/error-responses.service";

@Service()
export class CategoriesController {
    constructor(private _categoriesModel: CategoriesModel, private _jwt: JWT, private _errorResponseService: ErrorResponsesService) {}

    public index = async (req: Request, res: Response) => {
        try {
            const categoriesRes = await this._categoriesModel.index();
            res.status(categoriesRes.status).json(categoriesRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const categoryRes = await this._categoriesModel.show(req.params.id);
            res.status(categoryRes.status).json(categoryRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };

    public create = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            if (!token) throw new Error("Can't create category, check auth");
            const userId = this._jwt.decodedToken(token).user.id as number;

            const category: Category = {
                name: req.body.name,
                description: req.body.description || ""
            };

            const newCategoryRes = await this._categoriesModel.create(category);
            res.status(newCategoryRes.status).json(newCategoryRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            switch (databseError.sqlError.code) {
                case "23502": // not_null_violation
                    res.status(this._errorResponseService.nullValues().status).json(this._errorResponseService.nullValues());
                    break;
                case "23505": // unique_violation
                    res.status(this._errorResponseService.dublicatedValues().status).json(this._errorResponseService.dublicatedValues());
                    break;
                default:
                    res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
            }
        }
    };

    public destroy = async (req: Request, res: Response) => {
        try {
            const deletedProductRes = await this._categoriesModel.delete(req.params.id);
            res.status(deletedProductRes.status).json(deletedProductRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };
}
