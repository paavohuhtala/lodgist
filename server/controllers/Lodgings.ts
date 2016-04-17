
import {Request, Response} from "express"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"
import {getClient} from "../database/Connection"
import * as pgp from "pg-promise"

const query = `SELECT l.*, a.city FROM "Lodgings" l JOIN "Addresses" a ON l.address = a.id`;

export const Lodgings : IController = {
    get: (req: Request, res: Response) => {
        getClient().manyOrNone(query).then(rows => {
            res.render("lodgings", {lodgings: rows});            
        });
    }
}
