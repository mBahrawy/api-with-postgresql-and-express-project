import { describe } from "test";
import { UsersModel } from "../../models/user.model";
import { User } from "../../interfaces/User";

const usersModal = new UsersModel();

describe("Product modal", () => {
    const { index, show, create, destroy } = usersModal;

    describe("Check user model method exists", () => {
        it("should have index users method", () => expect(index).toBeDefined());
        it("should have show user method", () => expect(show).toBeDefined());
        it("should have create user method", () => expect(create).toBeDefined());
        it("should have delete user method", () => expect(destroy).toBeDefined());
    });

    describe("Test user model methods functionality", () => {
        it("should create a user", async () => {
            const user: User = {
                firstname: "dummyUser",
                lastname: "dummyUser",
                username: "dummyUser",
                email: "dummyUser@dummyUser.com",
                password: "dummyUser",
                role: "regular"
            };

            const result = await create(user);
            expect(result.status).toEqual(201);
        });

        it("should get a user", async () => {
            // Create a user to be displayed
            const user: User = {
                firstname: "dummyUser",
                lastname: "dummyUser",
                username: "dummyUser3",
                email: "dummyUser3@dummyUser.com",
                password: "dummyUser",
                role: "regular"
            };
            const userResponse = await usersModal.create(user);
            const userId = userResponse.user?.id;
            const result = await show(`${userId}`);
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
                username: "dummyUser2",
                email: "dummyUser2@dummyUser.com",
                password: "dummyUser",
                role: "regular"
            };
            const userResponse = await usersModal.create(user);
            const userId = userResponse.user?.id;

            // Appley delete
            const result = await destroy(`${userId}`);
            expect(result.status).toEqual(200);
        });
    });
});
