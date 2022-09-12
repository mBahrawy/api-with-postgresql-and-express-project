import { describe } from "test";
import { Product } from "../../interfaces/Product";
import { UsersModel } from "../../models/user.model";
import { User } from "../../interfaces/User";
import { OrdersModel } from "./../../models/order.modal";
import { ProductsModel } from "../../models/product.model";
import { Order } from "./../../interfaces/Order";

const ordersModel = new OrdersModel();
const usersModal = new UsersModel();
const productsModel = new ProductsModel();

describe("Order modal", () => {
    const { index, show, create } = ordersModel;

    beforeAll(async (): Promise<void> => {
        try {
            const user: User = {
                firstname: "admin",
                lastname: "admin",
                username: "admin2",
                email: "admin2@admin.com",
                password: "admin",
                role: "admin"
            };
            await usersModal.create(user);
        } catch (e) {
            console.log(e);
        }
    });

    describe("Check order model method exists", () => {
        it("should have index orders method", () => expect(index).toBeDefined());
        it("should have show order method", () => expect(show).toBeDefined());
        it("should have create new order method", () => expect(create).toBeDefined());
    });

    describe("Test order model methods functionality", () => {
        it("should create an order", async () => {
            const product: Product = {
                name: "Dummy product for order model test",
                price: 3000,
                stock: 20,
                user_id: 1
            };

            const productResponse = await productsModel.create(product);

            const product_id = productResponse.product?.id;

            const order: Order = {
                status: "open",
                products: [{ id: product_id, quantity: 2 }]
            };
            const result = await create(order);
            expect(result.status).toEqual(201);
        });

        it("should get all orders", async () => {
            const result = await index();
            expect(result.status).toEqual(200);
        });

        it("should get a an order with id=1", async () => {
            const result = await show("1");
            expect(result.status).toEqual(200);
        });
    });
});
