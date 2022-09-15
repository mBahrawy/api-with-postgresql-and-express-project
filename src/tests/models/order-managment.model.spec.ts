import { describe } from "test";
import { Product } from "../../interfaces/Product";
import { ProductsModel } from "../../models/product.model";
import { OrderManagmnetModel } from "../../models/order-managment.model";
import { OrdersModel } from "./../../models/order.modal";
import { Review } from "./../../interfaces/Review";
import { Order } from "../../interfaces/Order";
import { AuthService } from "./../../services/auth.service";
import { User } from "../../interfaces/User";
import Container from "typedi";

describe("Order modal", () => {
    const productsModel = Container.get(ProductsModel);
    const orderModel = Container.get(OrdersModel);
    const { addProduct, completeOrder } = Container.get(OrderManagmnetModel);
    const { register } = Container.get(AuthService);

    describe("Check order managment model method exists", () => {
        it("should have add product to order method", () => expect(addProduct).toBeDefined());
        it("should have complete order method", () => expect(completeOrder).toBeDefined());
    });

    describe("Test order managment model methods functionality", () => {
        it("should add a products to an order", async () => {
            const user: User = {
                firstname: "DummyUser",
                lastname: "DummyUser",
                username: "DummyUser10",
                email: "DummyUser@DummyUser.com",
                password: "DummyUser",
                role: "regular"
            };

            const userReponse = await register(user);
            const orderOwnerId = userReponse.user?.id as number;

            const categoryId = null;
            const product: Product = {
                name: "Dummy product for product model test",
                price: 3000,
                stock: 20,
                user_id: 1,
                category_id: categoryId
            };

            const productResponse = await productsModel.create(product);
            const productId = productResponse.product?.id as number;


            const order: Order = {
                products: [{ id: productId, quantity: 1 }]
            };

            const orderResponse = await orderModel.create(order, orderOwnerId);
            const orderId = orderResponse.order?.id as number;

            const result = await addProduct(3, orderId, productId, orderOwnerId);
            expect(result.order).toEqual({ id: orderId, status: "open", total: 12000, user_id: orderOwnerId });
        });

        it("should complete an order, set its status to completed, add a review", async () => {
            const user: User = {
                firstname: "DummyUser",
                lastname: "DummyUser",
                username: "DummyUser14",
                email: "DummyUser14@DummyUser.com",
                password: "DummyUser",
                role: "regular"
            };

            const userReponse = await register(user);
            const orderOwnerId = userReponse.user?.id as number;

            const categoryId = null;
            const product: Product = {
                name: "Dummy product for product model test",
                price: 3000,
                stock: 20,
                user_id: 1,
                category_id: categoryId
            };

            const productResponse = await productsModel.create(product);
            const productId = productResponse.product?.id as number;

            const order: Order = {
                products: [{ id: productId, quantity: 2 }]
            };

            const orderResponse = await orderModel.create(order, orderOwnerId);
            const orderId = orderResponse.order?.id as number;

            const review: Review = {
                id: orderId,
                service_rating: 4.2,
                feedback: "test feedback"
            };

            const result = await completeOrder(orderId, orderOwnerId, review);
            expect(result.order).toEqual({ id: orderId, status: "completed", total: 6000, user_id: orderOwnerId });
        });
    });
});
