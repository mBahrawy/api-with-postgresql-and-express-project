import databaseClient from "../database";
import Container, { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { FeedbackResponse } from "../interfaces/responses/FeedbackResponse";
import { User } from "../interfaces/User";
import { ErrorResponsesService } from "./../services/error-responses.service";

interface UsersResponse extends ErrorResponse {
    users?: User[];
}
interface UserResponse extends ErrorResponse {
    user?: User;
}

@Service()
export class UsersModel {
    async index(): Promise<UsersResponse> {
        const { serverError } = Container.get(ErrorResponsesService);
        try {
            const conn = await databaseClient.connect();
            const sql = `SELECT id, firstname, lastname, username, email, role FROM users`;
            const result = await conn.query(sql);
            conn.release();
            return {
                status: 200,
                users: result.rows ?? []
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not get users.");
        }
    }

    async show(id: string): Promise<UserResponse> {
        const { createError, serverError } = Container.get(ErrorResponsesService);
        try {

            const sql = `SELECT id, firstname, lastname, username, email, role FROM users WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return createError("User was not found", 404);
            }

            return {
                status: 200,
                user: result.rows[0]
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not get user.");
        }
    }

    async destroy(id: string): Promise<FeedbackResponse | ErrorResponse> {
        const { createError, serverError } = Container.get(ErrorResponsesService);
        try {
            const sql = `DELETE FROM users WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return createError("User was not found", 404);
            }

            return {
                status: 200,
                message: `User with ID: ${id} was deleted`
            };
        } catch (err) {
            console.log(err);
            throw serverError(err, "Could not delete user.");
        }
    }
}
