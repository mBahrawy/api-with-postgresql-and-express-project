import { describe } from "test";
import { ProductsModel } from "../../models/product.model";

const model = new ProductsModel();

describe("Product modal", () => {
    it("should have index method", () => {
        expect(model.index).toBeDefined();
    });
    // it("index method should return a list of products", async () => {
    //     const result = await model.index();
    //     console.log("result->", result);

    //     expect(result).toEqual([]);
    // });
});