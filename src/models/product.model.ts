import databaseClient from "../database";
import { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { FeedbackResponse } from "../interfaces/responses/FeedbackResponse";
import { Product } from "../interfaces/Product";

interface ProductsResponse extends ErrorResponse {
    products?: Product[];
}
interface ProductResponse extends ErrorResponse {
    product?: Product;
}

@Service()
export class ProductsModel {
    async index(): Promise<ProductsResponse> {
        try {
            const conn = await databaseClient.connect();
            const sql = `SELECT * FROM products`;
            const result = await conn.query(sql);
            conn.release();

            if (!result.rows.length) {
                return {
                    status: 404,
                    error: "No products were found"
                };
            }

            return {
                status: 200,
                products: result.rows
            };
        } catch (err) {
            throw {
                message: "Could not get products.",
                sqlError: err
            };
        }
    }

    async show(id: string): Promise<ProductResponse> {
        try {
            const sql = `SELECT * FROM products WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return {
                    status: 404,
                    error: "Product was not found"
                };
            }

            return {
                status: 200,
                product: result.rows[0]
            };
        } catch (err) {
            throw {
                message: "Could not get product.",
                sqlError: err
            };
        }
    }

    async create(p: Product, userID: number): Promise<ProductResponse> {
        try {
            const sql = `INSERT INTO products (name, price, quantity, user_id, category) VALUES($1, $2, $3, $4, $5) RETURNING *`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [p.name, p.price, p.quantity, userID, p.category]);
            const product = result.rows[0];
            conn.release();
            delete product.password_digist;
            return {
                status: 200,
                product
            };
        } catch (err) {
            throw {
                message: "Could not create products.",
                sqlError: err
            };
        }
    }

    async delete(id: string): Promise<FeedbackResponse | ErrorResponse> {
        try {
            const sql = `DELETE FROM products WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return {
                    status: 404,
                    error: "Product was not found"
                };
            }

            return {
                status: 200,
                message: `Product with ID: ${id} was deleted`
            };
        } catch (err) {
            throw {
                message: "Could not delete products.",
                sqlError: err
            };
        }
    }
}
