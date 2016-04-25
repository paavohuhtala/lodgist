
import {getClient} from "../database/Connection"
import {Request, Response} from "express"
import {IController} from "../IController"
import {ReservationDao} from "../database/daos/ReservationDao"
import {UserReservationDao} from "../database/daos/UserReservationDao"
import {LodgingDao} from "../database/daos/LodgingDao"

async function getViewData(reservationId: number) {
    return getClient().task(async (t) => {
        const reservation = await new ReservationDao(t).getById(reservationId);
        const userReservation = await new UserReservationDao(t).getById(reservation.id);
        const lodging = await new LodgingDao(t).getById(reservation.lodging);
        
        const viewData = {
            reservation,
            userReservation,
            lodging,
            alert: <string> null
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
