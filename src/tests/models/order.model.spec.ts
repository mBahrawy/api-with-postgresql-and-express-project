import { describe } from "test";
import { Product } from "../../interfaces/Product";
import { OrdersModel } from "./../../models/order.modal";
import { ProductsModel } from "../../models/product.model";
import { Order } from "./../../interfaces/Order";


describe("Order modal", () => {
    const productsModel = new ProductsModel();
    const { index, show, create } = new OrdersModel();

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

            const productId = productResponse.product?.id;

            const order: Order = {
                status: "open",
                products: [{ id: productId, quantity: 2 }]
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
