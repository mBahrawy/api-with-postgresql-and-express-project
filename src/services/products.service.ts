import { Service } from "typedi";
import { Request, Response } from "express";
import { ErrorResponsesService } from "./error-responses.service";
import { ProductManagmentModel } from "../models/product-managment.model.ts";

@Service()
export class ProductsService {
    constructor(private _productManagmentModel: ProductManagmentModel, private _errorResponseService: ErrorResponsesService) {}

    public productsByCategory = async (req: Request, res: Response) => {
        try {
            const category_id = Number(req.params.id);

            if (!category_id) {
                res.status(this._errorResponseService.nullValues().status).json(this._errorResponseService.nullValues());
                return;
            }

            const productsByCategoryResponse = await this._productManagmentModel.getProductsByCategory(`${category_id}`);
            res.status(productsByCategoryResponse.status).json(productsByCategoryResponse);
        } catch (err: any) {
            console.log(err);

            if (err?.sqlError?.code === "23502") {
                // Databse error - not_null_violation
                res.status(this._errorResponseService.nullValues().status).json(this._errorResponseService.nullValues());
                return;
            }

            // Backend error
            const backendError = this._errorResponseService.createError(err.error, err.status);
            res.status(err.status).json(backendError);
        }
    };
}
