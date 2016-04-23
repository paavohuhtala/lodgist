
import {Request, Response} from "express"
import {IController} from "../IController"

export const PaymentProvider : IController = {
    get: (req: Request, res: Response) => {
        res.render("payment_provider");
    }
}
