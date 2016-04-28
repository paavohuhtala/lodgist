
import {Response} from "express"
import {RequestEx} from "../RequestEx"
import {IController} from "../IController"
import * as pgp from "pg-promise"
import {getClient} from "../database/Connection"
import {LodgingDao} from "../database/daos/LodgingDao"
import {AddressDao} from "../database/daos/AddressDao"
import {UserDao} from "../database/daos/UserDao"
import {LodgingAmenityDao} from "../database/daos/LodgingAmenityDao"

const query = new pgp.QueryFile("./sql/queries/lodging.sql", {debug: true}); 

export const Lodging : IController = {
    get: async (req: RequestEx, res: Response) => {
        let id = parseInt(req.params.id, 10);
        let viewData = await getClient().one(query, {lodging: id}););
        res.render("lodging", viewData);
    }
}

export const NewLodging : IController = {
    get: (req: RequestEx, res: Response) => {
        res.render("new_lodging");
    }
}