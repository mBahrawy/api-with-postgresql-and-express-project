import { describe } from "test";
import { UsersModel } from "../../models/user.model";
import { User } from "../../interfaces/User";
import { AuthService } from "./../../services/auth.service";

const { register } = new AuthService();
const { index, show, destroy } = new UsersModel();

describe("Product modal", () => {
    describe("Check user model method exists", () => {
        it("should have index users method", () => expect(index).toBeDefined());
        it("should have show user method", () => expect(show).toBeDefined());
        it("should have delete user method", () => expect(destroy).toBeDefined());
    });

    describe("Test user model methods functionality", () => {
        it("should get a user", async () => {
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

            expect(result.user).toEqual({
                id: userId,
                firstname: "dummyUser",
                lastname: "dummyUser",
                username: "dummyUser32",
                email: "dummyUser32@dummyUser.com",
                role: "regular"
            });
        });

        it("should get all users", async () => {
            const result = await index();
            expect(Array.isArray(result.users)).toBeTrue();
        });

        it("should delete a user", async () => {
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

            const result = await destroy(userId);
            expect(result.message).toEqual("User with ID: 7 was deleted");
        });
    });
});
