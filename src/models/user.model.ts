import databaseClient from "../database";
import bcrypt from "bcrypt";
import { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { FeedbackResponse } from "../interfaces/responses/FeedbackResponse";
import { User } from "../interfaces/User";

const saltRounds = process.env.SALT_ROUNDS as string;
const pepper = process.env.BCRYPT_PASSWORD as string;

interface UsersResponse extends ErrorResponse {
    users?: User[];
}
interface UserResponse extends ErrorResponse {
    user?: User;
}

@Service()
export class UsersModel {
    async index(): Promise<UsersResponse> {
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
            throw {
                message: "Could not get users.",
                sqlError: err
            };
        }
    }

    async show(id: string): Promise<UserResponse> {
        try {
            const sql = `SELECT id, firstname, lastname, username, email, role FROM users WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return {
                    status: 404,
                    error: "User was not found"
                };
            }

            return {
                status: 200,
                user: result.rows[0]
            };
        } catch (err) {
            console.log(err);
            throw {
                message: "Could not get user.",
                sqlError: err
            };
        }
    }

    async create(u: User): Promise<UserResponse> {
        try {
            // eslint-disable-next-line max-len
            const sql = `INSERT INTO users (firstname, lastname, username, email, role, password_digist) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
            const conn = await databaseClient.connect();
            const hashedPassword = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [u.firstname, u.lastname, u.username, u.email, u.role, hashedPassword]);
            const user = result.rows[0];
            conn.release();
            delete user.password_digist;
            return {
                status: 201,
                user
            };
        } catch (err) {
            console.log(err);
            throw {
                message: "Could not add new user.",
                sqlError: err
            };
        }
    }

    async destroy(id: string): Promise<FeedbackResponse | ErrorResponse> {
        try {
            const sql = `DELETE FROM users WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();

            if (!result.rowCount) {
                return {
                    status: 404,
                    error: "User was not found"
                };
            }

            return {
                status: 200,
                message: `User with ID: ${id} was deleted`
            };
        } catch (err) {
            console.log(err);
            throw {
                message: "Could not delete user.",
                sqlError: err
            };
        }
    }
}
