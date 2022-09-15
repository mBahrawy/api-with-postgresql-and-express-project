import { describe } from "test";
import { ProductManagmentModel } from "../../models/product-managment.model.ts";

describe("Product modal", () => {
    const { getProductsByCategory } = new ProductManagmentModel();

    describe("Check product managmanet model method exists", () => {
        it("should have get products by categories method", () => expect(getProductsByCategory).toBeDefined());
    });

    describe("Test product managmanet model methods functionality", () => {
        it("should get all products with category_id=1", async () => {
            const result = await getProductsByCategory("1");
            expect(result.status).toEqual(200);
        });
    });
});
