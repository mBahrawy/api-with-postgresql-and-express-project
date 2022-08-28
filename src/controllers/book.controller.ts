import { Request, Response } from "express";
import { Book, BookSModel } from "../models/book.model";

const booksModel = new BookSModel();

export const index = async (req: Request, res: Response) => {
    res.json(await booksModel.index());
};

export const show = async (req: Request, res: Response) => {
    res.json(await booksModel.show(req.body.id));
};

export const create = async (req: Request, res: Response) => {
    try {
        const book: Book = {
            title: req.body.title,
            type: req.body.type,
            author: req.body.author,
            summary: req.body.summary,
            totalPages: Number(req.body.total_pages)
        };
        res.json(await booksModel.create(book));
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

export const destroy = async (req: Request, res: Response) => {
    console.log(req);
    
    res.json(await booksModel.delete(req.body.id));
};
