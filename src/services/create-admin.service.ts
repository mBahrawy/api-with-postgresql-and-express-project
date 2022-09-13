import { Service } from "typedi";
import { User } from "../interfaces/User";
import { UsersModel } from "../models/user.model";
import * as dotenv from "dotenv";
import databaseClient from "../database";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

@Service()
export class CreateAdmin {
    constructor(private _usersModel: UsersModel) {}
    public createAdmin = async () => {
        try {
            const user: User = {
                username: process.env.ADMIN_NAME as string,
                firstname: process.env.ADMIN_NAME as string,
                lastname: process.env.ADMIN_NAME as string,
                email: process.env.ADMIN_EMAIL as string,
                password: process.env.ADMIN_PASSWORD as string,
                role: "admin"
            };

            const sql = `SELECT * FROM users WHERE email=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [user.email]);
            conn.release();

            if (result.rowCount) return;

            await this._usersModel.create(user);
            console.log("First Admin user is created.");
            // eslint-disable-next-line no-empty
        } catch (e) {}
    };
}
