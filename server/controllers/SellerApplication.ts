
import {Request, Response} from "express"
import {IController} from "../IController"

export const SellerApplication : IController = {
    get: (req: Request, res: Response) => {
        res.render("seller_application");
    }
}
