import Container, { Service } from "typedi";
import { Request, Response } from "express";
import { ErrorResponsesService } from "./error-responses.service";
import { Review } from "../interfaces/Review";
import { OrderManagmnetModel } from "../models/order-managment.model";

@Service()
export class OrdersService {
    constructor(private _errorResponseService: ErrorResponsesService) {}

    public completeOrder = async (req: Request, res: Response) => {
        try {
            const { completeOrder } = Container.get(OrderManagmnetModel);

            const id = Number(req.params.id) || Number(req.body.id);
            const service_rating = Number(req.body.service_rating);
            const feedback = req.body.feedback;

            let review: Review | null = null;
            id && service_rating && feedback && (review = { id, service_rating, feedback });

            const completedOrderRes = await completeOrder(id, review);
            res.status(completedOrderRes.status).json(completedOrderRes);
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

    public addProduct = async (req: Request, res: Response) => {
        try {
            const { addProduct } = Container.get(OrderManagmnetModel);
            const order_id = Number(req.params.id);
            const product_id = Number(req.body.product_id);
            const quantity = Number(req.body.quantity);

            if (!order_id || !product_id || !quantity) {
                res.status(this._errorResponseService.nullValues().status).json(this._errorResponseService.nullValues());
                return;
            }

            const addedItemResponse = await addProduct(quantity, order_id, product_id);
            res.status(addedItemResponse.status).json(addedItemResponse);
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
