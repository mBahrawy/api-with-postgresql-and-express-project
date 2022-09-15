import { Service } from "typedi";
import { Request, Response } from "express";
import { CategoriesModel } from "../models/category.model";
import { Category } from "../interfaces/Category";
import { JWT } from "../services/jwt.service";
import { ErrorResponsesService } from "../services/error-responses.service";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";

@Service()
export class CategoriesController {
    constructor(private _categoriesModel: CategoriesModel, private _jwt: JWT, private _errorResponseService: ErrorResponsesService) {}

    public index = async (req: Request, res: Response) => {
        try {
            const categoriesRes = await this._categoriesModel.index();
            res.status(categoriesRes.status).json(categoriesRes);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const categoryRes = await this._categoriesModel.show(req.params.id);
            res.status(categoryRes.status).json(categoryRes);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
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
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };

    public destroy = async (req: Request, res: Response) => {
        try {
            const deletedProductRes = await this._categoriesModel.destroy(req.params.id);
            res.status(deletedProductRes.status).json(deletedProductRes);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };
}
