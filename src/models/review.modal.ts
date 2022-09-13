import databaseClient from "../database";
import Container, { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { Review } from "../interfaces/Review";
import { OrdersModel } from "./order.modal";
import { Order } from './../interfaces/Order';

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
            throw {
                message: "Could not get reviews.",
                sqlError: err
            };
        }
    }

    public async show(id: string): Promise<ReviewResponse> {
        try {
            const conn = await databaseClient.connect();

            // get review info
            const reviewSql = `SELECT * FROM reviews WHERE id=($1)`;
            const reviewResult = await conn.query(reviewSql, [id]);

            if (!reviewResult.rowCount) {
                return {
                    status: 404,
                    error: "Review was not found"
                };
            }

            return {
                status: 200,
                review: reviewResult.rows[0]
            };
        } catch (err) {
            console.log(err);
            throw {
                message: "Could not get review.",
                sqlError: err
            };
        }
    }

    public async create(r: Review): Promise<ReviewResponse> {
        try {
            const { show: getOrder } = Container.get(OrdersModel);

            const order = await getOrder(`${r.id}`);

            if (order.order?.status !== "completed") {
                throw {
                    status: 400,
                    message: "The relative order is not completed yet."
                };
            }
            if (order.order?.products && order.order?.products.length === 0) {
                throw {
                    status: 400,
                    message: "The relative order doesn't contain any products."
                };
            }
            if (order.order?.review) {
                throw {
                    status: 400,
                    message: "The relative order has already reviewed."
                };
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
            throw err;
        }
    }
}
