
import {Response} from "express"
import {RequestEx} from "../RequestEx"
import {IController} from "../IController"
import {getClient} from "../database/Connection"
import {LodgingDao} from "../database/daos/LodgingDao"
import * as pgp from "pg-promise"
import * as _ from "lodash"

// TODO: LOTS of shared code with MyReservations, including the query.

const query = new pgp.QueryFile("./sql/queries/lodging_reservations.sql", {debug: true}); 

interface IReservation {
    status: string
}

export const LodgingReservations : IController = {
    get: async (req: RequestEx, res: Response) => {
        const results = await getClient().oneOrNone(query, {lodging_id:  req.params.id});
        const lodging = await new LodgingDao().getById(req.params.id);
        
        const viewData = {
            reservations: {
                current: <IReservation[]>[],
                past: <IReservation[]>[],
                future: <IReservation[]>[] 
            },
            lodging: lodging
        }
        
        if (results != null) {
            viewData.reservations = <any> _.groupBy(results.reservations, (s: IReservation) => s.status);
        }
        
        res.render("lodging_reservations", viewData);
    }
}
