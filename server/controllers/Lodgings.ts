
import {Request, Response} from "express"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"

export const Lodgings : IController = {
    get: (req: Request, res: Response) => {
        new LodgingDao().getAll().then(rows => {
            res.render("lodgings", {lodgings: rows});
        });
    }
}
