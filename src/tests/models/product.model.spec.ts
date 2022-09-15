import { describe } from "test";
import { Product } from "../../interfaces/Product";
import { ProductsModel } from "../../models/product.model";
import { CategoriesModel } from "./../../models/category.model";
import { Category } from "./../../interfaces/Category";

const categoriesModel = new CategoriesModel();
const { index, show, create, destroy } = new ProductsModel();

describe("Product modal", () => {

    beforeAll(async (): Promise<void> => {
        try {
            const category: Category = {
                name: "Test category",
                description: "bla bla bla"
            };

            await categoriesModel.create(category);
        } catch (e) {
            console.log(e);
        }
    });

    describe("Check product model method exists", () => {
        it("should have index products method", () => expect(index).toBeDefined());
        it("should have show product method", () => expect(show).toBeDefined());
        it("should have create product method", () => expect(create).toBeDefined());
        it("should have delete product method", () => expect(destroy).toBeDefined());
    });

    describe("Test product model methods functionality", () => {
        it("should create a product", async () => {
            const user_id = 1;
            const category_id = null;

            const product: Product = {
                name: "Dummy product for product model test",
                price: 3000,
                stock: 20,
                user_id,
                category_id
            };

            const result = await create(product);
            expect(result.product?.name).toEqual("Dummy product for product model test");
        });

        it("should get a single products with id", async () => {
            const user_id = 1;
            const category_id = null;

            const product: Product = {
                name: "Dummy product for product model test",
                price: 3000,
                stock: 20,
                user_id,
                category_id
            };
            const productResult = await create(product);
            const productId = productResult.product?.id as number;

            expect(productResult.product).toEqual({
                id: productId,
                name: "Dummy product for product model test",
                stock: 20,
                price: 3000,
                user_id: user_id,
                category_id: null
            });
        });

        it("should get all products", async () => {
            const result = await index();
            expect(Array.isArray(result.products)).toBeTrue();
        });

        it("should delete a product", async () => {
            const product: Product = {
                name: "Dummy product for product model test, test delete method",
                price: 3000,
                stock: 20,
                user_id: 1
            };

            const productResponse = await create(product);
            const productId = productResponse.product?.id as number;

            const result = await destroy(productId);
            expect(result.message).toEqual(`Product with ID: ${productId} was deleted`);
        });
    });
});
