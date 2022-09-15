import supertest from "supertest";
import app from "../../../server";
import * as dotenv from "dotenv";

dotenv.config();
const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe("Check category routes,", () => {
    let adminToken: string;

    beforeAll(async () => {
        const response: supertest.Response = await request.post("/login").send({
            username: process.env.ADMIN_NAME as string,
            password: process.env.ADMIN_PASSWORD as string
        });

        adminToken = `Beaer ${response.body.user.token}`;
    });

    describe("Check APIs exsistance and validations,", () => {
        it("should api has get all categories", async (): Promise<void> => {
            const response: supertest.Response = await request.get("/categories");
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(200);
        });
        it("should api has a single category with id", async (): Promise<void> => {
            const response: supertest.Response = await request.get("/categories/1");
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(200);
        });

        it("should validate new category input", async (): Promise<void> => {
            const response: supertest.Response = await request.post("/categories").set("Authorization", adminToken);
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(400);
        });

        it("should validate delete category input", async (): Promise<void> => {
            const response: supertest.Response = await request.delete("/categories/dsa").set("Authorization", adminToken);
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(400);
        });

        it("should validate new category input", async (): Promise<void> => {
            const response: supertest.Response = await request.post("/categories").send({
                name: "Dummy category 3",
                description: "Dummy desc"
            });
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(401);
        });

        it("should validate delete category input", async (): Promise<void> => {
            const response: supertest.Response = await request.delete("/categories/1");
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(401);
        });



    });
    describe("Check categories APIs functionality,", () => {
        it("should create a new category successfully", async (): Promise<void> => {
            const response: supertest.Response = await request.post("/categories").set("Authorization", adminToken).send({
                name: "Dummy category 2",
                description: "Dummy desc"
            });
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(201);
        });

        it("should delete a category successfully", async (): Promise<void> => {
            const response: supertest.Response = await request.delete("/categories/2").set("Authorization", adminToken);
            expect(response.type).toBe("application/json");
            expect(response.status).toBe(200);
        });
    });
});
