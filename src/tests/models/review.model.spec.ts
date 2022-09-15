import { describe } from "test";
import { Order } from "../../interfaces/Order";
import { Product } from "../../interfaces/Product";
import { Review } from "../../interfaces/Review";
import { ProductsModel } from "../../models/product.model";
import { ReviewsModel } from "../../models/review.modal";
import { OrdersModel } from "./../../models/order.modal";
import { OrderManagmnetModel } from "./../../models/order-managment.model";

describe("Review modal", () => {
    const productsModel = new ProductsModel();
    const orderModel = new OrdersModel();
    const orderManagmnetModel = new OrderManagmnetModel();
    const { create, index, show } = new ReviewsModel();

    describe("Check review model method exists", () => {
        it("should have add review to a completed order method", () => expect(create).toBeDefined());
        it("should have get all reviews method", () => expect(index).toBeDefined());
        it("should have get a review method", () => expect(show).toBeDefined());
    });

    describe("Test review model methods functionality", () => {
        it("should review a completed order", async () => {
            const product: Product = {
                name: "Dummy review for review model test",
                price: 3000,
                stock: 20,
                user_id: 1
            };

            const productResponse = await productsModel.create(product);
            const productId = productResponse.product?.id as number;

            const order: Order = {
                status: "open",
                products: [{ id: productId, quantity: 2 }]
            };

            const orderResponse = await orderModel.create(order);
            const orderId = orderResponse.order?.id as number;

            await orderManagmnetModel.completeOrder(orderId, null);

            const review: Review = {
                id: orderId,
                service_rating: 4.2,
                feedback: "test feedback"
            };
            const reviewResult = await create(review);
            expect(reviewResult.status).toEqual(201);
        });

        it("should get all reviews", async () => {
            const result = await index();
            expect(result.status).toEqual(200);
        });

        it("should get a review", async () => {
            const result = await show("2");
            expect(result.status).toEqual(200);
        });
    });
});
