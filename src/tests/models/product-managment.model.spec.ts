import { describe } from "test";
import { ProductManagmentModel } from "../../models/product-managment.model.ts";

const { getProductsByCategory } = new ProductManagmentModel();
describe("Product modal", () => {
    describe("Check product managmanet model method exists", () => {
        it("should have get products by categories method", () => expect(getProductsByCategory).toBeDefined());
    });

    describe("Test product managmanet model methods functionality", () => {
        it("should get all products related to a category_id", async () => {
            const result = await getProductsByCategory("1");
            expect(Array.isArray(result.products)).toBeTrue();
        });
    });
});
