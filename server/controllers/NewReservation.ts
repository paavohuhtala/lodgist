
import {Response} from "express"
import {RequestEx} from "../RequestEx"
import {IController} from "../IController"
import {LodgingDao} from "../database/daos/LodgingDao"

export const NewReservation : IController = {
    get: async (req: RequestEx, res: Response) => {
        const lodging = await new LodgingDao().getById(req.params.id);
        res.render("new_reservation", {lodging: lodging});
    }
}
