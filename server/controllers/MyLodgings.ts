
import {Request, Response} from "express"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"
import {getClient} from "../database/Connection"
import * as pgp from "pg-promise"

export const MyLodgings : IController = {
    get: async (req: Request, res: Response) => {
        res.render("my_lodgings"); 
    }
}

