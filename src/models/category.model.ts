import databaseClient from "../database";
import { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { FeedbackResponse } from "../interfaces/responses/FeedbackResponse";
import { Category } from "../interfaces/Category";

interface CategoriesResponse extends ErrorResponse {
    categories?: Category[];
}
interface CategoryResponse extends ErrorResponse {
    category?: Category;
}

@Service()
export class CategoriesModel {
    async index(): Promise<CategoriesResponse> {
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
            throw {
                message: "Could not get categories.",
                sqlError: err
            };
        }
    }

    async show(id: string): Promise<CategoryResponse> {
        try {
            const sql = `SELECT * FROM categories WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return {
                    status: 404,
                    error: "Category was not found"
                };
            }

            return {
                status: 200,
                category: result.rows[0]
            };
        } catch (err) {
            throw {
                message: "Could not get category.",
                sqlError: err
            };
        }
    }

    async create(c: Category): Promise<CategoryResponse> {
        try {
            const sql = `INSERT INTO categories (name, description) VALUES($1, $2) RETURNING *`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [c.name, c.description]);
            const category = result.rows[0];
            conn.release();
            return {
                status: 200,
                category
            };
        } catch (err) {
            throw {
                message: "Could not create categories.",
                sqlError: err
            };
        }
    }

    async delete(id: string): Promise<FeedbackResponse | ErrorResponse> {
        try {
            const sql = `DELETE FROM categories WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return {
                    status: 404,
                    error: "Category was not found"
                };
            }

            return {
                status: 200,
                message: `Category with ID: ${id} was deleted`
            };
        } catch (err) {
            throw {
                message: "Could not delete categories.",
                sqlError: err
            };
        }
    }
}
