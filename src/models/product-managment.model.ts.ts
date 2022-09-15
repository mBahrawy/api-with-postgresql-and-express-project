import databaseClient from "../database";
import Container, { Service } from "typedi";
import { ErrorResponse } from "../interfaces/responses/ErrorResponse";
import { Product } from "../interfaces/Product";
import { ErrorResponsesService } from "../services/error-responses.service";

interface ProductsResponse extends ErrorResponse {
    products?: Product[];
}


@Service()
export class ProductManagmentModel {
    public async getProductsByCategory(id: string): Promise<ProductsResponse> {
        const { serverError } = Container.get(ErrorResponsesService);
        try {

            const { createError } = Container.get(ErrorResponsesService);
            const conn = await databaseClient.connect();

            const categorySql = `SELECT * FROM categories WHERE id=($1)`;
            const categoryResult = await conn.query(categorySql, [id]);

            if (!categoryResult.rowCount) {
                return createError("Category was not found", 404);
            }


            const productsSql = `SELECT * FROM products WHERE category_id=($1)`;
            const productsResult = await conn.query(productsSql, [id]);


            conn.release();
            


            return {
                status: 200,
                products: productsResult.rows ?? []
            };
        } catch (err: any) {
            console.log(err);
            throw serverError(err, "Could not get products.");
        }
    }
}
