import { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { OrdersModel } from "../models/order.modal";
import { Order } from "../interfaces/Order";
import { Request, Response } from "express";
import { ErrorResponsesService } from "./error-responses.service";
import { DatabaseError } from './../interfaces/responses/DatabaseError';


@Service()
export class OrdersService {
    constructor(private _ordersModel: OrdersModel, private _errorResponseService: ErrorResponsesService) {}

    public addProduct = async (req: Request, res: Response) => {
        try {
            const order_id = Number(req.params.id);
            const product_id = Number(req.body.product_id);
            const quantity = Number(req.body.quantity);

            if (!order_id || !product_id || !quantity) {
                res.status(this._errorResponseService.nullValues().status).json(this._errorResponseService.nullValues());
                return;
            }

            const addedItemResponse = await this._ordersModel.addProduct(quantity, order_id, product_id);
            res.status(addedItemResponse.status).json(addedItemResponse);
        } catch (e: unknown) {
            const dbErr = e as DatabaseError;
            console.log(e);
            const err = this._errorResponseService.doesntExsistsError(`${dbErr.message} ${dbErr.sqlError.error}`);
            res.status(err.status).json(err);
        }
    };
}
