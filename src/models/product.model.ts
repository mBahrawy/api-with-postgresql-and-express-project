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

            return {
                status: 200,
                products: result.rows ?? []
            };
        } catch (err) {
            throw {
                message: "Could not get products.",
                sqlError: err
            };
        }
    }
    async getProductsByCategory(id: number): Promise<ProductsResponse> {
        try {
            const conn = await databaseClient.connect();
            const sql = `SELECT * FROM products WHERE id=($1)`;
            const result = await conn.query(sql, [id]);
            conn.release();

            return {
                status: 200,
                products: result.rows ?? []
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

    async create(p: Product): Promise<ProductResponse> {
        try {
            const conn = await databaseClient.connect();
            // eslint-disable-next-line max-len
            const createProductSql = `INSERT INTO products (name, price, stock, user_id, category_id) VALUES($1, $2, $3, $4, $5) RETURNING *`;
            const resultProductResult = await conn.query(createProductSql, [p.name, p.price, p.stock, p.user_id, p.category_id]);
            const product = resultProductResult.rows[0];
            console.log(product);

            conn.release();
            return {
                status: 201,
                product
            };
        } catch (err) {
            throw {
                message: "Could not create products.",
                sqlError: err
            };
        }
    }

    async destroy(id: string): Promise<FeedbackResponse | ErrorResponse> {
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
