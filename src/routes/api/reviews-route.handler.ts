import express from "express";
import Container from "typedi";
import { ReviewsController } from "../../controllers/reviews.controller";

const { create, index, show } = Container.get(ReviewsController);

const reviewsRouteHandler = (router: express.Router) => {
    router.get("/reviews", index);
    router.get("/reviews/:id", show);
    // TODO : Add a middlewhare to check if the user has already bought this product
    router.post("/reviews/", create);
};

export default reviewsRouteHandler;
