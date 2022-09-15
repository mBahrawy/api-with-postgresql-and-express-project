import databaseClient from "../database";
import Container, { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { Order, OrderItem } from "../interfaces/Order";
import { Product } from "./../interfaces/Product";
import { Review } from "./../interfaces/Review";
import { OrderManagmnetModel } from "./order-managment.model";
import { ErrorResponsesService } from "../services/error-responses.service";

interface OrdersResponse extends ErrorResponse {
    orders?: Order[];
}
interface OrderResponse extends ErrorResponse {
    order?: Order;
}

@Service()
export class OrdersModel {
    public async index(): Promise<OrdersResponse> {
        const { serverError } = Container.get(ErrorResponsesService);
        try {
            const conn = await databaseClient.connect();

            // get orders info
            const ordersSql = `SELECT * FROM orders`;
            const ordersResult = await conn.query(ordersSql);

            const orderIds = ordersResult.rows.map((row) => row.id);
            const relatedProductsArray: [Product[]] = [[]];

            // products related to this order
            let relatedReviews: Review[] = [];

            for (let i = 0; i < orderIds.length; i++) {
                // eslint-disable-next-line max-len
                const relatedProductsSql = `SELECT products.id, products.name, products.price, products.category_id, order_products.quantity FROM order_products INNER JOIN products ON order_products.product_id = products.id WHERE order_id=($1)`;

                const relatedProductsResult: Product[] = (await conn.query(relatedProductsSql, [orderIds[i]])).rows;
                relatedProductsArray.push(relatedProductsResult);

                // get related review
                // eslint-disable-next-line max-len
                const relatedReviewSql = `SELECT  service_rating, feedback FROM reviews WHERE id=($1)`;
                const relatedReviewResult = await conn.query(relatedReviewSql, [orderIds[i]]);
                relatedReviews.push(relatedReviewResult.rows[0] || null);
            }

            const result = [
                ...ordersResult.rows.map((order, index) => {
                    return {
                        ...order,
                        products: relatedProductsArray[index],
                        review: relatedReviews[index] || null
                    };
                })
            ];

            conn.release();

            return {
                status: 200,
                orders: result
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not get orders");
        }
    }

    public async show(id: string): Promise<OrderResponse> {
        const { createError, serverError } = Container.get(ErrorResponsesService);

        try {
            const conn = await databaseClient.connect();

            // get order info
            const orderSql = `SELECT * FROM orders WHERE id=($1)`;
            const orderResult = await conn.query(orderSql, [id]);

            // products related to these orders
            // eslint-disable-next-line max-len
            const relatedProductsSql = `SELECT products.id, products.name, products.price, products.category_id, order_products.quantity FROM order_products INNER JOIN products ON order_products.product_id = products.id WHERE order_id=($1)`;
            const relatedProductsResult = await conn.query(relatedProductsSql, [id]);

            let relatedReview: Review | null = null;
            if (orderResult.rows[0].status === "completed") {
                // get related review
                // eslint-disable-next-line max-len
                const relatedReviewSql = `SELECT  service_rating, feedback FROM reviews WHERE id=($1)`;
                const relatedReviewResult = await conn.query(relatedReviewSql, [id]);
                relatedReview = relatedReviewResult.rows[0];
            }

            conn.release();

            if (!orderResult.rowCount) {
                return createError("Order was not found", 404);
            }

            return {
                status: 200,
                order: {
                    ...orderResult.rows[0],
                    products: relatedProductsResult.rows,
                    review: relatedReview
                }
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not get order.");
        }
    }

    public async create(o: Order | null): Promise<OrderResponse> {

        const { serverError } = Container.get(ErrorResponsesService);
        try {
            const { addProduct } = Container.get(OrderManagmnetModel);
            const { show } = Container.get(OrdersModel);

            const conn = await databaseClient.connect();
            const createOrderSql = `INSERT INTO orders (status, total, user_id) VALUES($1, $2, $3) RETURNING *`;
            const createOrderResult = await conn.query(createOrderSql, [o?.status || "open", o?.total || 0, o?.user_id]);

            if (o?.products) {
                const productsInOrder: OrderItem[] = [...o.products];

                for (let i = 0; o.products.length > i; i++) {
                    await addProduct(productsInOrder[i].quantity, createOrderResult.rows[0].id, Number(productsInOrder[i].id));
                }
            }

            const order = (await show(createOrderResult.rows[0].id)).order;
            conn.release();

            return {
                status: 201,
                order
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not get order.");
        }
    }
}
