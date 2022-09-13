import { describe } from "test";
import { Product } from "../../interfaces/Product";
import { ProductsModel } from "../../models/product.model";
import { Order } from "../../interfaces/Order";
import { CategoriesModel } from "./../../models/category.model";
import { Category } from "./../../interfaces/Category";

const categoriesModel = new CategoriesModel();
const productsModel = new ProductsModel();

describe("Category modal", () => {
    const { index, show, create, destroy } = categoriesModel;

    describe("Check category model method exists", () => {
        it("should have index catrgories method", () => expect(index).toBeDefined());
        it("should have show category method", () => expect(show).toBeDefined());
        it("should have create new category method", () => expect(create).toBeDefined());
        it("should have create new category method", () => expect(destroy).toBeDefined());
    });

    describe("Test category model methods functionality", () => {
        it("should create a category", async () => {
            const category: Category = {
                name: "Dummy category",
                description: "Dummy category for category model test"
            };
            const result = await create(category);
            expect(result.status).toEqual(201);
        });

        it("should get all catrgories", async () => {
            const result = await index();
            expect(result.status).toEqual(200);
        });

        it("should get a an category with id=1", async () => {
            const result = await show("1");
            expect(result.status).toEqual(200);
        });

        it("should delete a category", async () => {
            // Creation category will be deleted
            const category: Category = {
                name: "Dummy category for delete test",
                description: "Dummy category for category model test"
            };

            const categoryResponse = await create(category);
            const categoryId = categoryResponse.category?.id;
            const result = await destroy(`${categoryId}`);

            expect(result.status).toEqual(200);
        });
    });
});
