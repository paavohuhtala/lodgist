
import {Response} from "express"
import {RequestEx} from "../RequestEx"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"
import {ReservationDao} from "../database/daos/ReservationDao"
import {getClient} from "../database/Connection"
import * as pgp from "pg-promise"

const query = `
    SELECT * FROM "Reservations" r
    JOIN "UserReservations" u ON u.reservation = r.id
    JOIN "ExternalReservations" e on e.reservation = r.id
    WHERE r.lodging = $<lodgingId>`;

export const LodgingReservations : IController = {
    get: async (req: RequestEx, res: Response) => {
        let lodgingId = req.params.id
        const reservations = await getClient().manyOrNone(query, {lodgingId: lodgingId});
        res.render("lodging_reservations", reservations);
    }
}
