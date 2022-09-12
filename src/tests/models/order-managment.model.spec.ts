import { describe } from "test";
import { Product } from "../../interfaces/Product";
import { ProductsModel } from "../../models/product.model";
import { OrderManagmnetModel } from "../../models/order-managment.model";
import { OrdersModel } from "./../../models/order.modal";
import { Review } from "./../../interfaces/Review";

const orderManagmnetModel = new OrderManagmnetModel();
const productsModel = new ProductsModel();
const orderModel = new OrdersModel();

describe("Order modal", () => {
    const { addProduct, completeOrder } = orderManagmnetModel;

    describe("Check order managment model method exists", () => {
        it("should have add product to order method", () => expect(addProduct).toBeDefined());
        it("should have complete order method", () => expect(completeOrder).toBeDefined());
    });

    describe("Test order managment model methods functionality", () => {
        it("should add a products to an order", async () => {
            const product: Product = {
                name: "Dummy product for order managment model test",
                price: 3000,
                stock: 20,
                user_id: 1
            };

            const productResponse = await productsModel.create(product);
            const product_id = productResponse.product?.id as number;

            const orderResponse = await orderModel.create(null);
            const order_id = orderResponse.order?.id as number;

            const result = await addProduct(3, order_id, product_id);
            expect(result.status).toEqual(200);
        });

        it("should complete an order, set its status to completed", async () => {
            const review: Review = {
                id: 1,
                service_rating: 2.5,
                feedback: "good service."
            };

            const result = await completeOrder(review);
            expect(result.status).toEqual(200);
        });
    });
});
