import databaseClient from "../database";
import bcrypt from "bcrypt";
import { Service } from "typedi";
import { JWT } from "./jwt.service";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { User } from "../interfaces/User";

interface LoginResponse extends ErrorResponse {
    user?: User;
}

@Service()
export class AuthService {
    constructor(private jwt: JWT) {}

    public login = async (username: string, password: string): Promise<LoginResponse> => {
        try {
            const pepper = process.env.BCRYPT_PASSWORD as string;
            const conn = await databaseClient.connect();
            const sql = `SELECT * FROM users WHERE username=($1)`;
            const result = await conn.query(sql, [username]);

            if (!result.rows.length) {
                return {
                    status: 404,
                    error: "User was not found"
                };
            }

            const user = result.rows[0];
            if (!bcrypt.compareSync(password + pepper, user.password_digist)) {
                return {
                    status: 400,
                    error: "Username/Password is not correct"
                };
            }
            delete user.password_digist;
            const resUserData = { ...user, token: this.jwt.createToken(user) };

            return {
                user: resUserData,
                status: 200
            };
        } catch (err) {
            throw {
                status: 500,
                message: "Error happened during auth.",
                sqlError: err
            };
        }
    };
}
