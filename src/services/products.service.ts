import { Service } from "typedi";
import { Request, Response } from "express";
import { ErrorResponsesService } from "./error-responses.service";
import { DatabaseError } from "../interfaces/responses/DatabaseError";
import { ProductsModel } from "../models/product.model";

@Service()
export class ProductsService {
    constructor(private _productsModel: ProductsModel, private _errorResponseService: ErrorResponsesService) {}

    public productsByCategory = async (req: Request, res: Response) => {
        try {
            const category_id = Number(req.params.id);

            if (!category_id) {
                res.status(this._errorResponseService.nullValues().status).json(this._errorResponseService.nullValues());
                return;
            }

            const productsByCategoryResponse = await this._productsModel.getProductsByCategory(category_id);
            res.status(productsByCategoryResponse.status).json(productsByCategoryResponse);
        } catch (e: unknown) {
            const dbErr = e as DatabaseError;
            console.log(e);
            const err = this._errorResponseService.doesntExsistsError(`${dbErr.message} ${dbErr.sqlError.error}`);
            res.status(err.status).json(err);
        }
    };
}
