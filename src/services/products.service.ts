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
        } catch (err: any) {
            // Databse error - not_null_violation
            if (err.code === "23502") {
                res.status(this._errorResponseService.nullValues().status).json(this._errorResponseService.nullValues());
                return;
            }

            // Backend error
            const backendError = this._errorResponseService.createError(err.error, err.status);
            res.status(err.status).json(backendError);
        }
    };
}
