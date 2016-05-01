
import {Request, Response} from "express"
import {IController} from "../IController"
import {getClient} from "../database/Connection"
import {AmenityDao} from "../database/daos/AmenityDao"

export const Amenities : IController = {
    get: async (req: Request, res: Response) => {
        res.render("amenities");
    }
}
