import supertest from "supertest";
import app from "../../../server";

const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe("Check login routes", () => {
    it("should api has login route", async (): Promise<void> => {
        const response: supertest.Response = await request.get("/login");

        expect(response.type).toBe("application/json");
        expect(response.body).toEqual({
            status: 404,
            error: "User was not found"
        });
    });
});
