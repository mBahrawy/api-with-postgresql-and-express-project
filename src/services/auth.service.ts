import databaseClient from "../database";
import bcrypt from "bcrypt";
import { LoginRespond } from "../interfaces/responds/loginResponde";

export class AuthService {
    public static login = async (username: string, password: string): Promise<LoginRespond> => {
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

            return {
                user: user,
                status: 200
            };
        } catch (e) {
            throw new Error("Error happned during auth");
        }
    };
}
