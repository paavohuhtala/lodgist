
import {Request, Response} from "express"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"
import {getClient} from "../database/Connection"
import * as pgp from "pg-promise"

export const Lodgings : IController = {
    get: async (req: Request, res: Response) => {
        res.render("lodgings"); 
    }
}

