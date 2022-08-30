import express, { Request, Response } from "express";
import { User } from "../../interfaces/user";
import { UsersModel } from "../../models/user.model";

const usersModel = new UsersModel();

const index = async (req: Request, res: Response) => {
    const users = await usersModel.index();
    res.json(users);
};

const show = async (req: Request, res: Response) => {
    const user = await usersModel.show(req.params.id);
    res.json(user);
};

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };

        const newUser = await usersModel.create(user);
        res.json(newUser);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            "error": err
        });
    }
};

const destroy = async (req: Request, res: Response) => {
    const deletedUser = await usersModel.delete(req.params.id);
    res.json(deletedUser);
};

const usersRouteHandler = (router: express.Router) => {
    router.get("/all-users", index);
    router.get("/get-user/:id", show);
    router.post("/create-user", create);
    router.delete("/delete-user/:id", destroy);
};

export default usersRouteHandler;
