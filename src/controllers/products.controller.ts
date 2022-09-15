import { Service } from "typedi";
import { Request, Response } from "express";
import { ProductsModel } from "../models/product.model";
import { Product } from "../interfaces/Product";
import { JWT } from "./../services/jwt.service";
import { ErrorResponsesService } from "../services/error-responses.service";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";

@Service()
export class ProductsController {
    constructor(private _productsModel: ProductsModel, private _jwt: JWT, private _errorResponseService: ErrorResponsesService) {}

    public index = async (req: Request, res: Response) => {
        try {
            const productsRes = await this._productsModel.index();
            res.status(productsRes.status).json(productsRes);
        } catch (err: any) {
            console.log(err);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const productRes = await this._productsModel.show(req.params.id);
            res.status(productRes.status).json(productRes);
        } catch (err: any) {
            console.log(err);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };

    public create = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            if (!token) throw new Error("Can't create product, check auth");

            const user_id = this._jwt.decodedToken(token).user.id as number;

            const product: Product = {
                name: req.body.name,
                price: req.body.price,
                stock: req.body.stock,
                ...(Number(req.body.category_id) && { category_id: Number(req.body.category_id) }),
                user_id
            };

            const newProductRes = await this._productsModel.create(product);
            res.status(newProductRes.status).json(newProductRes);
        } catch (err: any) {
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
            if (err?.sqlError?.code === "23503") {
                // Databse error - foreign_key_violation
                const error = this._errorResponseService.entityRelationError("This product is related to an order, cant be deleted.");
                res.status(error.status).json(error);
                return;
            }

            // Backend error
            const backendError = this._errorResponseService.createError(err.error, err.status);
            res.status(err.status).json(backendError);
        }
    };

    public destroy = async (req: Request, res: Response) => {
        try {
            const deletedProductRes = await this._productsModel.destroy(req.params.id);
            res.status(deletedProductRes.status).json(deletedProductRes);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };
}
