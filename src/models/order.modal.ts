import databaseClient from "../database";
import { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { Order, OrderItem } from "../interfaces/Order";
import { Product } from "./../interfaces/Product";

interface OrdersResponse extends ErrorResponse {
    orders?: Order[];
}
interface OrderResponse extends ErrorResponse {
    order?: Order;
}

@Service()
export class OrdersModel {
    async index(): Promise<OrdersResponse> {
        try {
            const conn = await databaseClient.connect();

            // get orders info
            const ordersSql = `SELECT * FROM orders`;
            const ordersResult = await conn.query(ordersSql);

            // const orderIds = ordersResult.rows.map((row) => row.id);
            // const relatedProductsArray: [Product[]] = [[]];

            // products related to this order
            // for (let i = 0; i < orderIds.length; i++) {
            //     // eslint-disable-next-line max-len
            //     const relatedProductsSql = `SELECT products.id, products.name, products.price, products.category_id, order_products.quantity FROM order_products INNER JOIN products ON order_products.product_id = products.id WHERE order_id=($1)`;

            //     const relatedProductsResult: Product[] = (await conn.query(relatedProductsSql, [orderIds[i]])).rows;
            //     relatedProductsArray.push(relatedProductsResult);
            // }

            // const result = [
            //     ...ordersResult.rows.map((order, index) => {
            //         return {
            //             ...order,
            //             products: relatedProductsArray[index]
            //         };
            //     })
            // ];

            conn.release();

            return {
                status: 200,
                orders: ordersResult.rows
            };
        } catch (err) {
            throw {
                message: "Could not get orders.",
                sqlError: err
            };
        }
    }

    async show(id: string): Promise<OrderResponse> {
        try {
            const conn = await databaseClient.connect();

            // get order info
            const orderSql = `SELECT * FROM orders WHERE id=($1)`;
            const orderResult = await conn.query(orderSql, [id]);

            // products related to these orders
            // eslint-disable-next-line max-len
            const relatedProductsSql = `SELECT products.id, products.name, products.price, products.category_id, order_products.quantity FROM order_products INNER JOIN products ON order_products.product_id = products.id WHERE order_id=($1)`;
            const relatedProductsResult = await conn.query(relatedProductsSql, [id]);

            // get each product info

            conn.release();

            if (!orderResult.rowCount) {
                return {
                    status: 404,
                    error: "Order was not found"
                };
            }

            return {
                status: 200,
                order: { ...orderResult.rows[0], products: relatedProductsResult.rows }
            };
        } catch (err) {
            throw {
                message: "Could not get order.",
                sqlError: err
            };
        }
    }

    async create(o: Order): Promise<OrderResponse> {
        try {
            const conn = await databaseClient.connect();
            const createOrderSql = `INSERT INTO orders (status, total, user_id) VALUES($1, $2, $3) RETURNING *`;
            const createOrderResult = await conn.query(createOrderSql, [o.status, o.total, o.user_id]);

            if (o?.products) {
                const productsInOrder: OrderItem[] = [...o.products];

                for (let i = 0; o.products.length > i; i++) {
                    await this.addProduct(productsInOrder[i].quantity, createOrderResult.rows[0].id, Number(productsInOrder[i].id));
                }
            }

            conn.release();

            this.show(createOrderResult.rows[0].id);

            return {
                status: 200,
                order: (await this.show(createOrderResult.rows[0].id)).order
            };
        } catch (err) {
            throw {
                message: "Could not create order.",
                sqlError: err
            };
        }
    }

    async addProduct(quantity: number, order_id: number, product_id: number): Promise<OrderResponse> {
        try {
            const conn = await databaseClient.connect();

            // Check if there order is open befor adding item
            const orderSql = `SELECT * FROM orders WHERE id=($1)`;
            const orderResult = await conn.query(orderSql, [order_id]);
            const order = orderResult.rows[0] as Order;

            if (order.status !== "open") {
                throw {
                    status: 422,
                    error: `Could not add product ${product_id} to order ${order_id} because order status is ${order.status}`
                };
            }

            // Get current product price
            const productPriceSql = `SELECT price FROM products WHERE id=($1)`;
            const productPriceResult = await conn.query(productPriceSql, [product_id]);
            
            if (productPriceResult.rowCount === 0) {
                throw {
                    status: 404,
                    error: `Some products don't exsists`
                };
            }

            const productPrice = productPriceResult.rows[0].price as number;

            // Update order total amount
            const amountTobeAdded = (order.total || 0) + quantity * productPrice;
            const updateOrderTotalSql = `UPDATE orders SET total=($1) WHERE id=($2) RETURNING *`;
            const updateOrderTotalResult = await conn.query(updateOrderTotalSql, [amountTobeAdded, order_id]);

            // Insert product to the order
            const orderProductsSql = `INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *`;

            const orderProductsResult = await conn.query(orderProductsSql, [quantity, order_id, product_id]);

            conn.release();
            return {
                status: 200,
                order: updateOrderTotalResult.rows[0]
            };
        } catch (err) {
            throw {
                message: "Could not add product to order.",
                sqlError: err
            };
        }
    }
}
