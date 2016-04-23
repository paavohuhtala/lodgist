
import {Request, Response} from "express"
import {IController} from "../IController"
import {ReservationDao} from "../database/daos/ReservationDao"

export const Reservation : IController = {
    get: async (req: Request, res: Response) => {
        const reservation = await new ReservationDao().getById(req.params.id);
        res.render("reservation", {reservation: reservation});
    }
}
