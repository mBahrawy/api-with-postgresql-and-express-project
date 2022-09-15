import { Service } from "typedi";
import { Request, Response } from "express";
import { JWT } from "../services/jwt.service";
import { OrdersModel } from "../models/order.modal";
import { Order, OrderItem } from "./../interfaces/Order";
import { ErrorResponsesService } from "../services/error-responses.service";

@Service()
export class OrdersController {
    constructor(private _ordersModel: OrdersModel, private _jwt: JWT, private _errorResponseService: ErrorResponsesService) {}

    public index = async (req: Request, res: Response) => {
        try {
            const orderRespose = await this._ordersModel.index();
            res.status(orderRespose.status).json(orderRespose);
        } catch (err: any) {
            console.log(err);
            res.status(err.status).json(err.errors);
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const ordersResponse = await this._ordersModel.show(Number(req.params.id));
            res.status(ordersResponse.status).json(ordersResponse);
        } catch (err: any) {
            console.log(err);
            res.status(err.status).json(err.errors);
        }
    };

    public create = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const userId = this._jwt.decodedToken(token).user.id as number;

            const order: Order = {
                products: req.body.products as OrderItem[]
            };

            const newOrderResponse = await this._ordersModel.create(order, userId);
            res.status(newOrderResponse.status).json(newOrderResponse);
        } catch (err: any) {
            console.log(err);
            res.status(err.status).json(err.errors);
        }
    };
}
