import { Service } from "typedi";
import { Request, Response } from "express";
import { JWT } from "../services/jwt.service";
import { OrdersModel } from "../models/order.modal";
import { Order, OrderItem } from "./../interfaces/Order";
import { ErrorResponsesService } from "../services/error-responses.service";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";

@Service()
export class OrdersController {
    constructor(private _ordersModel: OrdersModel, private _jwt: JWT, private _errorResponseService: ErrorResponsesService) {}

    public index = async (req: Request, res: Response) => {
        try {
            const orderRespose = await this._ordersModel.index();
            res.status(orderRespose.status).json(orderRespose);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const ordersResponse = await this._ordersModel.show(req.params.id);
            res.status(ordersResponse.status).json(ordersResponse);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };

    public create = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            if (!token) throw new Error("Can't create order, check auth");

            const userId = this._jwt.decodedToken(token).user.id as number;

            const order: Order = {
                status: req.body.status || null,
                total: 0,
                products: req.body.products as OrderItem[],
                user_id: userId
            };

            const newOrderResponse = await this._ordersModel.create(order);
            res.status(newOrderResponse.status).json(newOrderResponse);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };
}
