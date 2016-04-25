
import {Request, Response} from "express"
import {IController} from "../IController"


export const Register : IController = {
    get: (req: Request, res: Response) => {
        res.render("register");
    }
}
