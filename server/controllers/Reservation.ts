
import * as pgp from "pg-promise"
import {getClient} from "../database/Connection"
import {Request, Response} from "express"
import {IController} from "../IController"
import {UserDao} from "../database/daos/UserDao"

const query = new pgp.QueryFile("./sql/queries/reservation.sql", {debug: true});

async function getViewData(reservationId: number) {
    return await getClient().one(query, {reservation: reservationId});
}

export const Reservation : IController = {
    get: async (req: Request, res: Response) => {
        const viewData = await getViewData(parseInt(req.params.id));
        
        if (req.query.successful_payment !== undefined) {
            viewData.alert = "successful_payment"
        }
        
        res.render("reservation", viewData);
    }
}
