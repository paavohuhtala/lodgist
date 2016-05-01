
import {Response} from "express"
import {RequestEx} from "../RequestEx"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"
import {ReservationDao} from "../database/daos/ReservationDao"
import {getClient} from "../database/Connection"
import * as pgp from "pg-promise"
import * as _ from "lodash"

const query = new pgp.QueryFile("./sql/queries/my_reservations.sql", {debug: true}); 

export const MyReservations : IController = {
    get: async (req: RequestEx, res: Response) => {
        const results = await getClient().oneOrNone(query, {customer: req.user.id});
        res.render("my_reservations", {reservations: _.groupBy(results.reservations, (s: any) => s.status)});
    }
}