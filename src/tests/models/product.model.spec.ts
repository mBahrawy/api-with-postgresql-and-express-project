import supertest from "supertest";
import app from "../../server";
import { describe } from "test";
import { Product } from "../../interfaces/Product";
import { ProductsModel } from "../../models/product.model";
import { UsersModel } from "./../../models/user.model";
import { Container } from "typedi";
import { HttpService } from "./../../services/http.service";
import { User } from "../../interfaces/User";
import { AxiosResponse } from "axios";

const productsModel = new ProductsModel();
const usersModal = new UsersModel();
const { postRequest } = Container.get(HttpService);

const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe("Product modal", () => {
    const { index, show, create, destroy, getProductsByCategory } = productsModel;

    beforeAll(() => {
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
    });

    it("should have index products method", () => expect(index).toBeDefined());
    it("should have show product method", () => expect(show).toBeDefined());
    it("should have create product method", () => expect(create).toBeDefined());
    it("should have delete product method", () => expect(destroy).toBeDefined());
    it("should have get products by categories method", () => expect(getProductsByCategory).toBeDefined());

    it("should create a product", async () => {
        const user_id = 1;
        const category_id = null;

        const product: Product = {
            name: "Macbook",
            price: 3000,
            stock: 20,
            user_id,
            category_id
        };

        const result = await create(product);
        expect(result.status).toEqual(201);
    });

});
