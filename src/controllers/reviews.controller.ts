import { Service } from "typedi";
import { Request, Response } from "express";
import { ReviewsModel } from "../models/review.modal";
import { Review } from "../interfaces/Review";
import { ErrorResponsesService } from "../services/error-responses.service";

@Service()
export class ReviewsController {
    constructor(private _reviewsModel: ReviewsModel, private _errorResponseService: ErrorResponsesService) {}

    public index = async (req: Request, res: Response) => {
        try {
            const reviewRespose = await this._reviewsModel.index();
            res.status(reviewRespose.status).json(reviewRespose);
        } catch (err: any) {
            console.log(err);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const reviewsResponse = await this._reviewsModel.show(req.params.id);
            res.status(reviewsResponse.status).json(reviewsResponse);
        } catch (err: any) {
            console.log(err);
            res.status(this._errorResponseService.serverError().status).json(this._errorResponseService.serverError());
        }
    };

    public create = async (req: Request, res: Response) => {
        try {
            const review: Review = {
                id: req.body.id,
                service_rating: req.body.service_rating,
                feedback: req.body.feedback || null
            };

            const newReviewResponse = await this._reviewsModel.create(review);
            res.status(newReviewResponse.status).json(newReviewResponse);
        } catch (err: any) {
            console.log(err);
            if (err?.sqlError?.code === "23502") {
                // Databse error - not_null_violation
                res.status(this._errorResponseService.nullValues().status).json(this._errorResponseService.nullValues());
                return;
            }
            
            // Backend error
            const backendError = this._errorResponseService.createError(err.message, err.status);
            res.status(err.status).json(backendError);
        }
    };
}
