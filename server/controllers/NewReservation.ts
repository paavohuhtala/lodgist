
import {Response} from "express"
import {RequestEx} from "../RequestEx"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"

export const NewUserReservation : IController = {
    get: async (req: RequestEx, res: Response) => {
        const lodging = await new LodgingDao().getById(parseInt(req.params.id));
        res.render("new_user_reservation", {lodging: lodging});
    }
}

export const NewExternalReservation : IController = {
    get: async (req: RequestEx, res: Response) => {
        const lodging = await new LodgingDao().getById(parseInt(req.params.id));
        res.render("new_external_reservation", {lodging: lodging});
    }
}
