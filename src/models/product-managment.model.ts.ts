import databaseClient from "../database";
import { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { Product } from "../interfaces/Product";

interface ProductsResponse extends ErrorResponse {
    products?: Product[];
}


@Service()
export class ProductManagmentModel {
    public async getProductsByCategory(id: string): Promise<ProductsResponse> {
        try {
            const conn = await databaseClient.connect();
            const sql = `SELECT * FROM products WHERE id=($1)`;
            const result = await conn.query(sql, [id]);
            conn.release();

            return {
                status: 200,
                products: result.rows ?? []
            };
        } catch (err) {
            console.log(err);
            throw {
                message: "Could not get products.",
                sqlError: err
            };
        }
    }
}
