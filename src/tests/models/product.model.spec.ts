import { describe } from "test";
import { Product } from "../../interfaces/Product";
import { ProductsModel } from "../../models/product.model";
import { UsersModel } from "./../../models/user.model";
import { CategoriesModel } from "./../../models/category.model";
import { User } from "../../interfaces/User";
import { Category } from "./../../interfaces/Category";

const productsModel = new ProductsModel();
const usersModal = new UsersModel();
const categoriesModel = new CategoriesModel();

describe("Product modal", () => {
    const { index, show, create, destroy } = productsModel;

    beforeAll(async (): Promise<void> => {
        try {
            const user: User = {
                firstname: "admin",
                lastname: "admin",
                username: "admin3",
                email: "admin3@admin.com",
                password: "admin",
                role: "admin"
            };

            const category: Category = {
                name: "Test category",
                description: "bla bla bla"
            };

            await usersModal.create(user);
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
            expect(result.status).toEqual(201);
        });

        it("should get a products with id=1", async () => {
            const result = await show("1");
            expect(result.status).toEqual(200);
        });

        it("should get all products", async () => {
            const result = await index();
            expect(result.status).toEqual(200);
        });

        it("should delete a product", async () => {
            // Create a product to be deleted
            const product: Product = {
                name: "Dummy product for product model test, test delete method",
                price: 3000,
                stock: 20,
                user_id: 1
            };

            const productResponse = await productsModel.create(product);
            const productId = productResponse.product?.id;

            // Appley delete
            const result = await destroy(`${productId}`);
            expect(result.status).toEqual(200);
        });

    });
});
