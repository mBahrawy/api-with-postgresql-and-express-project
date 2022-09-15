import { describe } from "test";
import Container from "typedi";
import { ProductManagmentModel } from "../../models/product-managment.model.ts";

describe("Product modal", () => {
    const { getProductsByCategory } = Container.get(ProductManagmentModel);

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
