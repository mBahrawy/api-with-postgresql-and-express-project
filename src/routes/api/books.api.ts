import express, { Router } from "express";
import { create, destroy, index, show } from "../../controllers/book.controller";

// Add here middlewhares

const booksRoute: Router = express.Router();

booksRoute.get("/books", index);
// booksRoute.get("/books/:id", show);
booksRoute.post("/books", create);
// booksRoute.delete("/books", destroy);

export default booksRoute;
