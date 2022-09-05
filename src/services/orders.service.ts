import { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { OrdersModel } from "../models/order.modal";
import { Order } from "../interfaces/Order";
import { Request, Response } from "express";

interface OrderResponse extends ErrorResponse {
    order?: Order;
}

@Service()
export class OrdersService {
    constructor(private _ordersModel: OrdersModel) {}

    private _serverErrorResponse = {
        error: "Something went wrong, please try later",
        status: 500
    };

    private _nullValuesResponse: ErrorResponse = {
        error: "Some inputs are required, please check them and try again.",
        status: 422
    };

    public addProduct = async (req: Request, res: Response) => {
        try {
            const order_id: string = req.params.id;
            const product_id: string = req.body.product_id;
            const quantity: number = parseInt(req.body.quantity);

            if (!order_id || !product_id || !quantity) {
                res.status(this._nullValuesResponse.status).json(this._nullValuesResponse);
                return;
            }

            const addedItemResponse = await this._ordersModel.addProduct(quantity, order_id, product_id);
            res.status(addedItemResponse.status).json(addedItemResponse);
        } catch (e) {
            console.log(e);
            res.status(this._serverErrorResponse.status).json(this._serverErrorResponse);
        }
    };
}
