import { AxiosResponse } from "axios";
import { Container } from "typedi";
import { HttpService } from "../services/http.service";
const { postRequest } = Container.get(HttpService);

(async (): Promise<void> => {
    const createAdminResponse: AxiosResponse = await postRequest(
        "/register/admin",
        {
            firstname: "admin",
            lastname: "admin",
            username: "admin",
            email: "admin@admin.com",
            password: "admin"
        },
        {}
    );
    const createUserResponse: AxiosResponse = await postRequest(
        "/register",
        {
            firstname: "user",
            lastname: "user",
            username: "user",
            email: "user@user.com",
            password: "user"
        },
        {}
    );
})();

const request: supertest.SuperTest<supertest.Test> = supertest(app);
import supertest from "supertest";
import app from "../server";
