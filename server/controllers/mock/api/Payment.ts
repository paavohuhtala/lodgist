
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import * as _ from "lodash"

import {deTimezonify} from "../../../DateUtils"

import {UserReservationDao} from "../../../database/daos/UserReservationDao"

interface PaymentConfirmation {
    success: boolean
    reservation: number
}

export const PaymentCallbackApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        const confirmation = <PaymentConfirmation> req.body
            
        if (confirmation.success) {
            const update = {
                is_paid: true,
                paid: deTimezonify(moment())
            }

            const reservation = await new UserReservationDao().update(update, "_primary", confirmation.reservation);
            res.send(`/reservations/${confirmation.reservation}?successful_payment`);
        } else {
            res.sendStatus(500);
        }
    }
}
