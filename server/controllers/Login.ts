
import {Request, Response} from "express"
import {IController} from "../IController"

export const Login : IController = {
    get: (req: Request, res: Response) => {
        res.render("login");
    }
}
