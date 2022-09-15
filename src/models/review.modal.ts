import databaseClient from "../database";
import Container, { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { Review } from "../interfaces/Review";
import { OrdersModel } from "./order.modal";
import { Order } from "./../interfaces/Order";
import { ErrorResponsesService } from "../services/error-responses.service";

interface ReviewsResponse extends ErrorResponse {
    reviews?: Review[];
}
interface ReviewResponse extends ErrorResponse {
    review?: Review;
    order?: Order;
}

@Service()
export class ReviewsModel {
    public async index(): Promise<ReviewsResponse> {
        const { serverError } = Container.get(ErrorResponsesService);
        try {
            const conn = await databaseClient.connect();

            // get reviews info
            const reviewsSql = `SELECT * FROM reviews`;
            const reviewsResult = await conn.query(reviewsSql);

            conn.release();
            return {
                status: 200,
                reviews: reviewsResult.rows ?? []
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not get reviews.");
        }
    }

    public async show(id: string): Promise<ReviewResponse> {
        const { createError, serverError } = Container.get(ErrorResponsesService);

        try {
            const conn = await databaseClient.connect();

            // get review info
            const reviewSql = `SELECT * FROM reviews WHERE id=($1)`;
            const reviewResult = await conn.query(reviewSql, [id]);

            if (!reviewResult.rowCount) {
                return createError("Review was not found", 404);
            }

            return {
                status: 200,
                review: reviewResult.rows[0]
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not get review.");
        }
    }

    public async create(r: Review): Promise<ReviewResponse> {
        const { createError, serverError } = Container.get(ErrorResponsesService);

        try {
            const { show: getOrder } = Container.get(OrdersModel);

            const order = await getOrder(r.id as number);

            if (order.order?.status !== "completed") {
                return createError("The relative order is not completed yet.", 400);
            }

            if (order.order?.products && order.order?.products.length === 0) {
                return createError("The relative order doesn't contain any products.", 400);
            }
            if (order.order?.review) {
                return createError("The relative order has already reviewed.", 400);
            }

            const conn = await databaseClient.connect();
            const createReviewSql = `INSERT INTO reviews (id, service_rating, feedback) VALUES($1, $2, $3) RETURNING *`;
            const createReviewResult = await conn.query(createReviewSql, [r.id, r.service_rating, r.feedback]);
            const review = createReviewResult.rows[0];
            conn.release();

            return {
                status: 201,
                order: {
                    ...order.order,
                    review
                }
            };
        } catch (err) {
            console.log(err);
            throw serverError(err);
        }
    }
}
