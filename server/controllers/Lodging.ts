
import {Request, Response} from "express"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"

export const Lodging : IController = {
    get: (req: Request, res: Response) => {
        let id = parseInt(req.params.id, 10);

        new LodgingDao().getById(id).then(row => {
            res.render("lodging", {lodging: row});
        });
    }
}
