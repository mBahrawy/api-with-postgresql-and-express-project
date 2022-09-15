import databaseClient from "../database";
import Container, { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { FeedbackResponse } from "../interfaces/responses/FeedbackResponse";
import { Product } from "../interfaces/Product";
import { ErrorResponsesService } from "../services/error-responses.service";

interface ProductsResponse extends ErrorResponse {
    products?: Product[];
}
interface ProductResponse extends ErrorResponse {
    product?: Product;
}

@Service()
export class ProductsModel {
    public async index(): Promise<ProductsResponse> {
        const { serverError } = Container.get(ErrorResponsesService);

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
            console.log(err);

            throw serverError(err, "Could not get products.");
        }
    }

    public async show(id: string): Promise<ProductResponse> {
        const { createError, serverError } = Container.get(ErrorResponsesService);

        try {
            const sql = `SELECT * FROM products WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return createError("Product was not found", 404);
            }

            return {
                status: 200,
                product: result.rows[0]
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not get product.");
        }
    }

    public async create(p: Product): Promise<ProductResponse> {
        const { serverError } = Container.get(ErrorResponsesService);
        try {
            const conn = await databaseClient.connect();
            // eslint-disable-next-line max-len
            const createProductSql = `INSERT INTO products (name, price, stock, user_id, category_id) VALUES($1, $2, $3, $4, $5) RETURNING *`;
            const resultProductResult = await conn.query(createProductSql, [p.name, p.price, p.stock, p.user_id, p.category_id]);
            const product = resultProductResult.rows[0];
            conn.release();
            return {
                status: 201,
                product
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not create product.");
        }
    }

    public async destroy(id: number): Promise<FeedbackResponse | ErrorResponse> {
        const { createError, serverError } = Container.get(ErrorResponsesService);

        try {
            const sql = `DELETE FROM products WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return createError("Product was not found", 404);
            }

            return {
                status: 200,
                message: `Product with ID: ${id} was deleted`
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not delete product.");
        }
    }
}
