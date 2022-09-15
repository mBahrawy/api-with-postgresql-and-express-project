import { Service } from "typedi";
import { Request, Response } from "express";
import { ReviewsModel } from "../models/review.modal";
import { Review } from "../interfaces/Review";
import { ErrorResponsesService } from "../services/error-responses.service";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";

@Service()
export class ReviewsController {
    constructor(private _reviewsModel: ReviewsModel, private _errorResponseService: ErrorResponsesService) {}

    public index = async (req: Request, res: Response) => {
        try {
            const reviewRespose = await this._reviewsModel.index();
            res.status(reviewRespose.status).json(reviewRespose);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };

    public show = async (req: Request, res: Response) => {
        try {
            const reviewsResponse = await this._reviewsModel.show(req.params.id);
            res.status(reviewsResponse.status).json(reviewsResponse);
        } catch (err: any) {
            console.log(err);
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
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
            const backendError = err as ErrorResponse;
            res.status(backendError.status).json(backendError.errors);
        }
    };
}
