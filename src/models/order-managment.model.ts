import databaseClient from "../database";
import Container, { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { Order } from "../interfaces/Order";
import { Review } from "./../interfaces/Review";
import { ErrorResponsesService } from "../services/error-responses.service";

interface OrderResponse extends ErrorResponse {
    order?: Order;
}

@Service()
export class OrderManagmnetModel {
    public async addProduct(quantity: number, order_id: number, product_id: number, user_id: number): Promise<OrderResponse> {
        const { createError, serverError } = Container.get(ErrorResponsesService);

        try {
            const conn = await databaseClient.connect();

            // Check if there order is open befor adding item
            const orderSql = `SELECT * FROM orders WHERE id=($1)`;
            const orderResult = await conn.query(orderSql, [order_id]);
            const order = orderResult.rows[0] as Order;

            if (orderResult.rowCount === 0) {
                return createError("Order was not found", 404);
            }

            // Check order owner
            if (order.user_id != user_id) {
                return createError("You don't have right access to do this acction", 403);
            }

            if (order.status !== "open") {
                return createError(`Could not add product ${product_id} to order ${order_id} because order status is ${order.status}`, 422);
            }

            // Get current product price
            const productPriceSql = `SELECT price FROM products WHERE id=($1)`;
            const productPriceResult = await conn.query(productPriceSql, [product_id]);

            if (productPriceResult.rowCount === 0) {
                return createError("A product doesnt't exsist", 404);
            }

            const productPrice = productPriceResult.rows[0].price as number;

            // Update order total amount
            const amountTobeAdded = (order.total || 0) + quantity * productPrice;
            const updateOrderTotalSql = `UPDATE orders SET total=($1) WHERE id=($2) RETURNING *`;
            const updateOrderTotalResult = await conn.query(updateOrderTotalSql, [amountTobeAdded, order_id]);

            // Insert product to the order
            const orderProductsSql = `INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *`;

            await conn.query(orderProductsSql, [quantity, order_id, product_id]);

            conn.release();
            return {
                status: 200,
                order: updateOrderTotalResult.rows[0]
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not add product to the order.");
        }
    }

    public async completeOrder(order_id: number, user_id: number, review: Review | null): Promise<OrderResponse> {
        const { createError, serverError } = Container.get(ErrorResponsesService);
        try {
            const conn = await databaseClient.connect();

            // Check if there order is open befor adding item
            const orderSql = `SELECT * FROM orders WHERE id=($1)`;
            const orderResult = await conn.query(orderSql, [order_id]);
            const order = orderResult.rows[0] as Order;

            if (orderResult.rowCount === 0) {
                return createError("Order was not found", 404);
            }

            // Check order owner
            if (order.user_id != user_id) {
                return createError(`You don't have right access to do this acction`, 403);
            }

            if (order.status !== "open") {
                return createError(`Could not complete order ${order_id} because order status is ${order.status}`, 422);
            }

            if (review) {
                // Saving review
                const addingReviewSql = `INSERT INTO reviews (id, service_rating, feedback) VALUES($1, $2, $3) RETURNING *`;
                await conn.query(addingReviewSql, [order_id, review.service_rating, review.feedback]);
            }
            // Update order status
            const updateOrderStatusSql = `UPDATE orders SET status=($1) WHERE id=($2) RETURNING *`;
            const updateOrderStatusResult = await conn.query(updateOrderStatusSql, ["completed", order_id]);

            conn.release();
            return {
                status: 200,
                order: updateOrderStatusResult.rows[0]
            };
        } catch (err) {
            console.log(err);
            throw serverError(err);
        }
    }
}
