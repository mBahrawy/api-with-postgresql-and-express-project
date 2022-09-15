import databaseClient from "../database";
import bcrypt from "bcrypt";
import Container, { Service } from "typedi";
import { JWT } from "./jwt.service";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { User } from "../interfaces/User";
import { ErrorResponsesService } from "./error-responses.service";

const saltRounds = process.env.SALT_ROUNDS as string;
const pepper = process.env.BCRYPT_PASSWORD as string;
interface LoginResponse extends ErrorResponse {
    user?: User;
}

interface UserResponse extends ErrorResponse {
    user?: User;
}

@Service()
export class AuthService {
    public login = async (username: string, password: string): Promise<LoginResponse> => {
        const { createError, serverError } = Container.get(ErrorResponsesService);
        try {
            const jwt = Container.get(JWT);

            const pepper = process.env.BCRYPT_PASSWORD as string;
            const conn = await databaseClient.connect();
            const sql = `SELECT * FROM users WHERE username=($1)`;
            const result = await conn.query(sql, [username]);

            if (!result.rows.length) {
                throw createError("User was not found", 404);
            }

            const user = result.rows[0];
            if (!bcrypt.compareSync(password + pepper, user.password_digist)) {
                throw createError("Username/Password is not correct", 404);
            }
            delete user.password_digist;
            const resUserData = { ...user, token: jwt.createToken(user) };

            return {
                user: resUserData,
                status: 200
            };
        } catch (err) {
            console.log(err);
            throw serverError("Error happened during auth.");
        }
    };

    async register(u: User): Promise<UserResponse> {
        const { serverError } = Container.get(ErrorResponsesService);
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
            throw serverError("Could not add new user.");
        }
    }
}
