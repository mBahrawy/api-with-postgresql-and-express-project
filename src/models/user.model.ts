import databaseClient from "../database";
import bcrypt from "bcrypt";
import { User } from "../interfaces/user";


const tableName = "users";
const modalName = "user";
const saltRounds = process.env.SALT_ROUNDS as string;
const pepper = process.env.BCRYPT_PASSWORD as string;

export class UsersModel {
    async index(): Promise<User[]> {
        try {
            const conn = await databaseClient.connect();
            const sql = `SELECT * FROM ${tableName}`;
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get ${modalName} ${error}`);
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = `SELECT * FROM ${tableName} WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find ${modalName} ${id}. Error: ${err}`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const sql = `INSERT INTO ${tableName} (name, username, email, password_digist) VALUES($1, $2, $3, $4) RETURNING *`;
            const conn = await databaseClient.connect();
            const hashedPassword = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [u.name, u.username, u.email, hashedPassword]);
            const user = result.rows[0];
            conn.release();
            return user;
        } catch (err) {
            throw new Error(`Could not add new ${modalName} ${u.name}. Error: ${err}`);
        }
    }

    async delete(id: string): Promise<string> {
        try {
            const sql = `DELETE FROM ${tableName} WHERE id=($1)`;
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return `User with ID: ${id} was deleted`;
        } catch (err) {
            throw new Error(`Could not delete ${modalName} ${id}. Error: ${err}`);
        }
    }
}
