import databaseClient from "../database";

export type Book = {
    id?: Number;
    title: String;
    total_pages: number;
    type: String;
    author: string;
    summary: String;
};

export class BookSModel {
    async index(): Promise<Book[]> {
        try {
            const conn = await databaseClient.connect();
            const sql = "SELECT * FROM books";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get books ${error}`);
        }
    }

    async show(id: string): Promise<Book> {
        try {
            const sql = "SELECT * FROM books WHERE id=($1)";
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find book ${id}. Error: ${err}`);
        }
    }

    async create(b: Book): Promise<Book> {
        try {
            const sql = "INSERT INTO books (title, author, total_pages, summary) VALUES($1, $2, $3, $4) RETURNING *";
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [b.title, b.author, b.total_pages, b.summary]);
            const book = result.rows[0];
            conn.release();
            return book;
        } catch (err) {
            throw new Error(`Could not add new book ${b.title}. Error: ${err}`);
        }
    }

    async delete(id: string): Promise<Book> {
        try {
            const sql = "DELETE FROM books WHERE id=($1)";
            const conn = await databaseClient.connect();
            const result = await conn.query(sql, [id]);
            const book = result.rows[0];
            conn.release();
            return book;
        } catch (err) {
            throw new Error(`Could not delete book ${id}. Error: ${err}`);
        }
    }
}
