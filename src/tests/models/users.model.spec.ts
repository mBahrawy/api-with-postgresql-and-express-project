import { describe } from "test";
import { UsersModel } from "../../models/user.model";
import { User } from "../../interfaces/User";
import { AuthService } from "./../../services/auth.service";
import { Container } from "typedi";

describe("Product modal", () => {
    const { register } = Container.get(AuthService);
    const { index, show, destroy } = Container.get(UsersModel);

    describe("Check user model method exists", () => {
        it("should have index users method", () => expect(index).toBeDefined());
        it("should have show user method", () => expect(show).toBeDefined());
        it("should have delete user method", () => expect(destroy).toBeDefined());
    });

    describe("Test user model methods functionality", () => {
        it("should get a user", async () => {
            console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

            // Create a user to be displayed
            const user: User = {
                firstname: "dummyUser",
                lastname: "dummyUser",
                username: "dummyUser32",
                email: "dummyUser32@dummyUser.com",
                password: "dummyUser",
                role: "regular"
            };
            const userResponse = await register(user);
            const userId = userResponse.user?.id as number;
            const result = await show(userId);

            console.log(result);

            expect(result.status).toEqual(200);
        });

        it("should get all users", async () => {
            const result = await index();
            expect(result.status).toEqual(200);
        });

        it("should delete a user", async () => {
            // Create a user to be deleted
            const user: User = {
                firstname: "dummyUser",
                lastname: "dummyUser",
                username: "dummyUser42",
                email: "dummyUser42@dummyUser.com",
                password: "dummyUser",
                role: "regular"
            };
            const userResponse = await register(user);
            const userId = userResponse.user?.id as number;

            // Appley delete
            const result = await destroy(userId);

            console.log(result);

            expect(result.status).toEqual(200);
        });
    });
});
