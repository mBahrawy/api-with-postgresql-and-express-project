import express, { Request, Response } from "express";
import { Book, BookSModel } from "../models/book.model";

const booksModel = new BookSModel();

const index = async (req: Request, res: Response) => {
    const books = await booksModel.index();
    res.json(books);
};

const show = async (req: Request, res: Response) => {
    const book = await booksModel.show(req.params.id);
    res.json(book);
};

const create = async (req: Request, res: Response) => {
    try {
        const book: Book = {
            title: req.body.title,
            type: req.body.type,
            author: req.body.author,
            summary: req.body.summary,
            total_pages: Number(req.body.total_pages)
        };

        const newArticle = await booksModel.create(book);
        res.json(newArticle);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            "error": err
        });
    }
};

const destroy = async (req: Request, res: Response) => {
    const deleted = await booksModel.delete(req.params.id);
    res.json(deleted);
};

const booksRouteHandler = (router: express.Router) => {
    router.get("/books", index);
    router.get("/books/:id", show);
    router.post("/books", create);
    router.delete("/books/:id", destroy);
};

export default booksRouteHandler;
