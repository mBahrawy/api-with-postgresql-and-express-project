import databaseConnection from "../database";

export type Product = {
    id: Number;
    name: String;
    stock: Number;
    vendor: String;
    type: String;
    description: String;
};

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await databaseConnection.connect();
            const sql = "SELECT * FROM products";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get weapons ${error}`);
        }
    }
}
