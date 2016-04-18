
import {Request, Response} from "express"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"
import {getClient} from "../database/Connection"
import * as pgp from "pg-promise"

const query = `
    SELECT l.*, a.city, u.name AS owner_name FROM "Lodgings" l
    JOIN "Addresses" a ON l.address = a.id
    JOIN "Users" u ON  u.id = l.owner`;

export const Lodgings : IController = {
    get: async (req: Request, res: Response) => {
        let lodgings = await getClient().manyOrNone(query);
        
        res.render("lodgings", {lodgings: lodgings}); 
    }
}

