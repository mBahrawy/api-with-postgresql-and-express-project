import databaseClient from "../database";
import Container, { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { FeedbackResponse } from "../interfaces/responses/FeedbackResponse";
import { Category } from "../interfaces/Category";
import { ErrorResponsesService } from "../services/error-responses.service";

interface CategoriesResponse extends ErrorResponse {
    categories?: Category[];
}
interface CategoryResponse extends ErrorResponse {
    category?: Category;
}

@Service()
export class CategoriesModel {
    async index(): Promise<CategoriesResponse> {
        const { serverError } = Container.get(ErrorResponsesService);
        try {
            const conn = await databaseClient.connect();
            const sql = `SELECT * FROM categories`;
            const result = await conn.query(sql);
            conn.release();

            return {
                status: 200,
                categories: result.rows ?? []
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not get categories.");
        }

 

    }

    async show(id: string): Promise<CategoryResponse> {
        const { createError, serverError } = Container.get(ErrorResponsesService);

        try {
            const sql = `SELECT * FROM categories WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return createError("Category was not found", 404);
            }

            return {
                status: 200,
                category: result.rows[0]
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not get category.");
        }
    }

    async create(c: Category): Promise<CategoryResponse> {
        const { serverError } = Container.get(ErrorResponsesService);
        try {
            const sql = `INSERT INTO categories (name, description) VALUES($1, $2) RETURNING *`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [c.name, c.description]);
            const category = result.rows[0];
            conn.release();
            return {
                status: 201,
                category
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not create categories.");
        }
    }

    async destroy(id: string): Promise<FeedbackResponse | ErrorResponse> {
        const { createError, serverError } = Container.get(ErrorResponsesService);

        try {
            const sql = `DELETE FROM categories WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return createError("Category was not found", 404);
            }

            return {
                status: 200,
                message: `Category with ID: ${id} was deleted`
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not delete category.");
        }
    }
}
