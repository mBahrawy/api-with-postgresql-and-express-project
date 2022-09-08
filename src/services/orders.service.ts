import { Service } from "typedi";
import { OrdersModel } from "../models/order.modal";
import { Request, Response } from "express";
import { ErrorResponsesService } from "./error-responses.service";
import { DatabaseError } from "./../interfaces/responses/DatabaseError";
import { Review } from "../interfaces/Review";

@Service()
export class OrdersService {
    constructor(private _ordersModel: OrdersModel, private _errorResponseService: ErrorResponsesService) {}

    public completeOrder = async (req: Request, res: Response) => {
        try {
            const order_id = Number(req.params.id);
            const rating = Number(req.body.service_rating);
            if (!order_id || !rating) {
                res.status(this._errorResponseService.nullValues().status).json(this._errorResponseService.nullValues());
                return;
            }

            const review: Review = {
                id: order_id,
                service_rating: Number(req.body.service_rating),
                ...(req.body.feedback ? { feedback: req.body.feedback } : { feedback: "" })
            };

            const completedOrderRes = await this._ordersModel.completeOrder(review);
            res.status(completedOrderRes.status).json(completedOrderRes);
        } catch (e) {
            console.log(e);
            const dbErr = e as DatabaseError;
            // TODO modfy
            const err = this._errorResponseService.createError(`${dbErr.message} ${dbErr.sqlError.error}`, 444);
            res.status(err.status).json(err);
        }
    };

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
            // TODO modfy
            const err = this._errorResponseService.createError(`${dbErr.message} ${dbErr.sqlError.error}`, 444);
            res.status(err.status).json(err);
        }
    };
}
