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
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const ordersResponse = await this._ordersModel.show(req.params.id);
            res.status(ordersResponse.status).json(ordersResponse);
        } catch (err: any) {
            console.log(err);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
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
