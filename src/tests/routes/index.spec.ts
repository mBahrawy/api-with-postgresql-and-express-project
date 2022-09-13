import supertest from "supertest";
import app from "../../server";

const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe("Check app home page", () => {
    it("should api load home route", async (): Promise<void> => {
        const response: supertest.Response = await request.get("/");
        expect(response.type).toBe("text/html");
        expect(response.status).toBe(200);
    });
    it("should load default not found route", async (): Promise<void> => {
        const response: supertest.Response = await request.get("/foooooooo");
        expect(response.type).toBe("text/html");
        expect(response.status).toBe(404);
    });
});
