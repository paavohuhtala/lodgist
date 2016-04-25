
import {getClient} from "../database/Connection"
import {Request, Response} from "express"
import {IController} from "../IController"
import {ReservationDao} from "../database/daos/ReservationDao"
import {UserReservationDao} from "../database/daos/UserReservationDao"
import {ExternalReservationDao} from "../database/daos/ExternalReservationDao"
import {LodgingDao} from "../database/daos/LodgingDao"
import {UserDao} from "../database/daos/UserDao"

async function getViewData(reservationId: number) {
    return getClient().task(async (t) => {
        const reservation = await new ReservationDao(t).getById(reservationId);
        const lodging = await new LodgingDao(t).getById(reservation.lodging);
        const owner = await new UserDao(t).getById(lodging.owner);
                
        const viewData = {
            reservation,
            owner,
            lodging,
            userReservation: null,
            externalReservation: null,
            alert: <string> null
        }
        
        if (reservation.type == "user") {
            viewData.userReservation = await new UserReservationDao(t).getById(reservation.id);
        } else {
            viewData.externalReservation = await new ExternalReservationDao(t).getById(reservation.id);
        }

        return viewData;
    });
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
