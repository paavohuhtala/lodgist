
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../IController"

import {ReservationDao} from "../../database/daos/ReservationDao"
import {UserReservationDao} from "../../database/daos/UserReservationDao"

export const PaymentProvider : IController = {
    get: async (req: RequestEx, res: Response) => {
        const reservation = await new ReservationDao().getById(parseInt(req.params.id));
        const userReservation = await new UserReservationDao().getById(parseInt(req.params.id));
        
        if (reservation == null || userReservation == null || userReservation.customer != req.user.id) {
            res.sendStatus(404);
            return;
        }
       
        if (userReservation.is_paid) {
            res.redirect(`/reservations/${userReservation.reservation}`);
            return;
        }
        
        res.render("mock/payment_provider", {
            reservation: reservation,
            userReservation: userReservation});
    }
}
