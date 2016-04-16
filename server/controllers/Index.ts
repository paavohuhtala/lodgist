
import {Request, Response} from "express"
import {IController} from "../IController"

export const Index : IController = {
    get: (req: Request, res: Response) => {
        res.render("index");
    }
}
