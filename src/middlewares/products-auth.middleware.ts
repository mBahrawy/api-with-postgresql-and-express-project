import { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { JWT } from "../services/jwt.service";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { ProductsModel } from "../models/product.model";
import { Product } from "../interfaces/Product";

interface ProductResponse extends ErrorResponse {
    product?: Product;
}

const productsAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const jwt = Container.get(JWT);
    const modal = Container.get(ProductsModel);

    const forbiddenErrorResponse = {
        status: 403,
        error: "Not authorized action"
    };

    if (!req.headers.authorization) return forbiddenErrorResponse;

    const token = req.headers.authorization;
    const productRes = (await modal.show(req.params.id)) as ProductResponse;
    const createdUserId = productRes.product?.user_id as number;

    if (!jwt.isValidUserWithToken(token, createdUserId)) {
        res.status(forbiddenErrorResponse.status).json(forbiddenErrorResponse);
        return;
    }
    next();
};

export default productsAuthMiddleware;
