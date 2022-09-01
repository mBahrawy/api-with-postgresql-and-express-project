import { Service } from "typedi";
import { Request, Response } from "express";
import { ProductsModel } from "../models/product.model";
import { Product } from "../interfaces/Product";
import { JWT } from "./../services/jwt.service";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { DatabaseError } from "../interfaces/responses/DatabaseError";

@Service()
export class ProductsController {
    constructor(private _productsModel: ProductsModel, private jwt: JWT) {}

    private _serverErrorResponse = {
        error: "Something went wrong, please try later",
        status: 500
    };

    private _nullValuesResponse: ErrorResponse = {
        error: "Some inputs are required, please check them and try again.",
        status: 400
    };

    public index = async (req: Request, res: Response) => {
        try {
            const productsRes = await this._productsModel.index();
            res.status(productsRes.status).json(productsRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._serverErrorResponse.status).json(this._serverErrorResponse);
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const productRes = await this._productsModel.show(req.params.id);
            res.status(productRes.status).json(productRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._serverErrorResponse.status).json(this._serverErrorResponse);
        }
    };

    public create = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            if (!token) throw new Error("Can't create product, check auth");

            const userId = this.jwt.decodedToken(token).user.id as number;

            const product: Product = {
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,
                user_id: this.jwt.decodedToken(token).user.id as number
            };

            const newProductRes = await this._productsModel.create(product, userId);
            res.status(newProductRes.status).json(newProductRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);

            switch (databseError.sqlError.code) {
                case "23502": // not_null_violation
                    res.status(this._nullValuesResponse.status).json(this._nullValuesResponse);
                    break;
                default:
                    res.status(this._serverErrorResponse.status).json(this._serverErrorResponse);
            }
        }
    };

    public destroy = async (req: Request, res: Response) => {
        try {
            const deletedProductRes = await this._productsModel.delete(req.params.id);
            res.status(deletedProductRes.status).json(deletedProductRes);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._serverErrorResponse.status).json(this._serverErrorResponse);
        }
    };
}
