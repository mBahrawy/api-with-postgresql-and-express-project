import supertest from "supertest";
import app from "../../../server";

const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe("Check login routes", () => {
    it("should api has login route", async (): Promise<void> => {
        const response: supertest.Response = await request.post("/login");
        expect(response.type).toBe("application/json");
        expect(response.status).toBe(400);
    });
    it("should api has register route", async (): Promise<void> => {
        const response: supertest.Response = await request.post("/register");
        expect(response.type).toBe("application/json");
        expect(response.status).toBe(400);
    });

    it("should user register successfully", async (): Promise<void> => {
        const response: supertest.Response = await request.post("/register").send({
            firstname: "xyz",
            lastname: "xyz",
            username: "xyz",
            email: "xyz@xyz.com",
            password: "xyz123"
        });
        expect(response.type).toBe("application/json");
        expect(response.status).toBe(201);
    });

    it("should user login successfully", async (): Promise<void> => {
        const response: supertest.Response = await request.post("/login").send({
            username: "xyz",
            password: "xyz123"
        });
        expect(response.type).toBe("application/json");
        expect(response.status).toBe(200);
    });
});
