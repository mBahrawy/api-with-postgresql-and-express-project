import { Service } from "typedi";
import { Request, Response } from "express";
import { Product } from "../interfaces/Product";
import { JWT } from "../services/jwt.service";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { DatabaseError } from "../interfaces/responses/DatabaseError";
import { OrdersModel } from "../models/order.modal";
import { Order } from "./../interfaces/Order";

@Service()
export class OrdersController {
    constructor(private _ordersModel: OrdersModel, private jwt: JWT) {}

    private _serverErrorResponse = {
        error: "Something went wrong, please try later",
        status: 500
    };

    private _nullValuesResponse: ErrorResponse = {
        error: "Some inputs are required, please check them and try again.",
        status: 422
    };

    public index = async (req: Request, res: Response) => {
        try {
            const orderRespose = await this._ordersModel.index();
            res.status(orderRespose.status).json(orderRespose);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._serverErrorResponse.status).json(this._serverErrorResponse);
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const ordersResponse = await this._ordersModel.show(req.params.id);
            res.status(ordersResponse.status).json(ordersResponse);
        } catch (err: unknown) {
            const databseError = err as DatabaseError;
            console.log(databseError);
            res.status(this._serverErrorResponse.status).json(this._serverErrorResponse);
        }
    };

    public create = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            if (!token) throw new Error("Can't create order, check auth");

            const userId = this.jwt.decodedToken(token).user.id as number;

            const order: Order = {
                status: req.body.status,
                total: Number(req.body.total) || 0,
                user_id: userId
            };

            const newOrderResponse = await this._ordersModel.create(order);
            res.status(newOrderResponse.status).json(newOrderResponse);
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
}
