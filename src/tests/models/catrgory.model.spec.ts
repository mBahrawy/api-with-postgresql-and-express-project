import { describe } from "test";
import { CategoriesModel } from "./../../models/category.model";
import { Category } from "./../../interfaces/Category";
import Container from "typedi";

describe("Category modal", () => {
    const { index, show, create, destroy } = Container.get(CategoriesModel);

    describe("Check category model method exists", () => {
        it("should have index catrgories method", () => expect(index).toBeDefined());
        it("should have show category method", () => expect(show).toBeDefined());
        it("should have create new category method", () => expect(create).toBeDefined());
        it("should have create new category method", () => expect(destroy).toBeDefined());
    });

    describe("Test category model methods functionality", () => {
        it("should create a category", async () => {
            const category: Category = {
                name: "Dummy category",
                description: "Dummy category for category model test"
            };
            const result = await create(category);

            expect(result.category).toEqual({
                id: 2,
                name: "Dummy category",
                description: "Dummy category for category model test"
            });
        });

        it("should get all catrgories", async () => {
            const result = await index();
            expect(Array.isArray(result.categories)).toBeTrue();
        });

        it("should get a single category with id", async () => {
            const category: Category = {
                name: "Test category 2",
                description: "bla bla bla"
            };
            const categoryResult = await create(category);
            const categoryId = categoryResult.category?.id as number;

            const result = await show(categoryId);
            expect(result.category).toEqual({
                id: categoryId,
                name: "Test category 2",
                description: "bla bla bla"
            });
        });

        it("should delete a category", async () => {
            // Creation category will be deleted
            const category: Category = {
                name: "Dummy category for delete test",
                description: "Dummy category for category model test"
            };

            const categoryResponse = await create(category);
            const categoryId = categoryResponse.category?.id;
            const result = await destroy(`${categoryId}`);
            expect(result.message).toEqual(`Category with ID: ${categoryId} was deleted`);
        });
    });
});
