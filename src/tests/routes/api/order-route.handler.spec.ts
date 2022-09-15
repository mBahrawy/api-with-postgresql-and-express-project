import supertest from "supertest";
import app from "../../../server";
import * as dotenv from "dotenv";

dotenv.config();
const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe("Check order routes,", () => {
    let adminToken: string;
    let regularToken: string;
    let emptyOrderId: number;
    let withProductsOrderId: number;

    beforeAll(async () => {
        const adminLoginResponse: supertest.Response = await request.post("/login").send({
            username: process.env.ADMIN_NAME as string,
            password: process.env.ADMIN_PASSWORD as string
        });
        adminToken = `Beaer ${adminLoginResponse.body.user.token}`;

        const registerUserResponse: supertest.Response = await request.post("/register").send({
            firstname: "qwer",
            lastname: "qwer",
            username: "qwer",
            email: "qwer@qwer.com",
            password: "qwer123"
        });

        const regularLoginResponse: supertest.Response = await request.post("/login").send({
            username: "qwer",
            password: "qwer123"
        });
        regularToken = `Beaer ${regularLoginResponse.body.user.token}`;

        const createEmptyOrderResponce: supertest.Response = await request.post("/orders").set("Authorization", regularToken);
        emptyOrderId = createEmptyOrderResponce.body.order.id;

        const withProductsOrderResponse: supertest.Response = await request
            .post("/orders")
            .set("Authorization", regularToken)
            .send({
                products: [
                    {
                        id: 2,
                        quantity: 111
                    }
                ]
            });
        withProductsOrderId = withProductsOrderResponse.body.order.id;
    });

    describe("Check APIs exsistance and validations,", () => {
        it("should api has get all orders", async (): Promise<void> => {
            const response: supertest.Response = await request.get("/orders");
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(401);
        });
        it("should get all orders by admin only", async (): Promise<void> => {
            const response: supertest.Response = await request.get("/orders").set("Authorization", adminToken);
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(200);
        });

        it("should api get single order validate auth user, doent have token", async (): Promise<void> => {
            const response: supertest.Response = await request.get(`/orders/${withProductsOrderId}`);
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(401);
        });

        it("should api get single order validate auth user, has user token", async (): Promise<void> => {
            const response: supertest.Response = await request.get(`/orders/${withProductsOrderId}`).set("Authorization", regularToken);
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(200);
        });
        it("should api get single order validate auth user, has admin token", async (): Promise<void> => {
            const response: supertest.Response = await request.get(`/orders/${withProductsOrderId}`).set("Authorization", adminToken);
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(200);
        });

        it("should validate add products to an order, validate auth", async (): Promise<void> => {

            const response: supertest.Response = await request.put(`/orders/${withProductsOrderId}/products`).send({
                product_id: 1,
                quantity: 1
            });


            expect(response.type).toBe("application/json");
            expect(response.status).toBe(401);
        });

        

        it("should validate complete an order, validate auth", async (): Promise<void> => {

            const response: supertest.Response = await request.put(`/orders/${withProductsOrderId}/complete`).send({
                service_rating: 2.5,
                feedback: "good service."
            });

    
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(401);
        });

        it("should validate complete an order successfully", async (): Promise<void> => {
            const response: supertest.Response = await request
                .put(`/orders/${withProductsOrderId}/complete`)
                .set("Authorization", regularToken)
                .send({
                    service_rating: 2.5,
                    feedback: "good service."
                });
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(200);
        });

        it("should validate complete an order, validate already completed order", async (): Promise<void> => {
            const response: supertest.Response = await request
                .put(`/orders/${withProductsOrderId}/complete`)
                .set("Authorization", regularToken)
                .send({
                    service_rating: 2.5,
                    feedback: "good service."
                });
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(422);
        });
    });
});
