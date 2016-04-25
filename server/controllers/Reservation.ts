
import {getClient} from "../database/Connection"
import {Request, Response} from "express"
import {IController} from "../IController"
import {ReservationDao} from "../database/daos/ReservationDao"
import {UserReservationDao} from "../database/daos/UserReservationDao"
import {LodgingDao} from "../database/daos/LodgingDao"

export const Reservation : IController = {
    get: async (req: Request, res: Response) => {
        const reservation = await new ReservationDao().getById(parseInt(req.params.id));
        const userReservation = await new UserReservationDao().getById(reservation.id);
        const lodging = await new LodgingDao().getById(reservation.lodging);
        
        const viewData = {
            reservation,
            userReservation,
            lodging,
            alert: <string> null
        }
        
        if (req.query.successful_payment !== undefined) {
            viewData.alert = "successful_payment"
        }
        
        res.render("reservation", viewData);
    }
}
