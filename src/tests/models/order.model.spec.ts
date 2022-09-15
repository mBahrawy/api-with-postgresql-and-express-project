import { describe } from "test";
import { OrdersModel } from "./../../models/order.modal";
import { User } from "../../interfaces/User";
import { AuthService } from "../../services/auth.service";

const { index, show, create } = new OrdersModel();
const { register } = new AuthService();

describe("Order modal", () => {
    describe("Check order model method exists", () => {
        it("should have index orders method", () => expect(index).toBeDefined());
        it("should have show order method", () => expect(show).toBeDefined());
        it("should have create new order method", () => expect(create).toBeDefined());
    });

    describe("Test order model methods functionality", () => {
        it("should create an order", async () => {
            const user: User = {
                firstname: "DummyUser",
                lastname: "DummyUser",
                username: "DummyUser12",
                email: "DummyUser12@DummyUser.com",
                password: "DummyUser",
                role: "regular"
            };

            const userReponse = await register(user);
            const orderOwnerId = userReponse.user?.id as number;

            const result = await create(null, orderOwnerId);
            expect(result.order).toEqual({
                id: 3,
                status: "open",
                total: 0,
                user_id: 4,
                products: [],
                review: null
            });
        });

        it("should get all orders", async () => {
            const result = await index();
            expect(Array.isArray(result.orders)).toBeTrue();
        });

        it("should get a single order with id", async () => {
            const user: User = {
                firstname: "DummyUser",
                lastname: "DummyUser",
                username: "DummyUser16",
                email: "DummyUser16@DummyUser.com",
                password: "DummyUser",
                role: "regular"
            };

            const userReponse = await register(user);
            const orderOwnerId = userReponse.user?.id as number;

            const orderResponse = await create(null, orderOwnerId);
            const orderId = orderResponse.order?.id as number;

            const result = await show(orderId);
            expect(result.order).toEqual({
                id: orderId,
                status: "open",
                total: 0,
                user_id: orderOwnerId,
                products: [],
                review: null
            });
        });
    });
});
