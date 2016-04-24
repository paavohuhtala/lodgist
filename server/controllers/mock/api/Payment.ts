
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import * as _ from "lodash"

import {UserReservationDao} from "../../../database/daos/UserReservationDao"

interface PaymentConfirmation {
    success: boolean
    reservation: number
}

export const PaymentCallbackApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        const confirmation = <PaymentConfirmation> req.body
            
        if (confirmation.success) {
            const update = { is_paid: true }
            const reservation = await new UserReservationDao().update(update, "_primary", confirmation.reservation);

            res.status(200).send(`/reservations/${confirmation.reservation}`);
        } else {
            res.sendStatus(500);
        }
    }
}
