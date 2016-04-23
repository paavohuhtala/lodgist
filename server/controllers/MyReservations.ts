
import {Response} from "express"
import {RequestEx} from "../RequestEx"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"
import {ReservationDao} from "../database/daos/ReservationDao"
import {getClient} from "../database/Connection"
import * as pgp from "pg-promise"

const query = `
    SELECT * FROM "Reservations" r
    INNER JOIN "UserReservations" u ON u.reservation = r.id
    WHERE u.customer = $<userId>`;

export const MyReservations : IController = {
    get: async (req: RequestEx, res: Response) => {
        const reservations = await getClient().manyOrNone(query, {userId: req.user.id});
        res.render("my_reservations", reservations);
    }
}