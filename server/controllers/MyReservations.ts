
import {Response} from "express"
import {RequestEx} from "../RequestEx"
import {IController} from "../IController"
import {getClient} from "../database/Connection"
import * as pgp from "pg-promise"
import * as _ from "lodash"

const query = new pgp.QueryFile("./sql/queries/my_reservations.sql", {debug: true}); 

interface IReservation {
    status: string
}

export const MyReservations : IController = {
    get: async (req: RequestEx, res: Response) => {
        const results = await getClient().oneOrNone(query, {user_id: req.user.id});
        
        const viewData = {
            reservations: {
                current: <IReservation[]>[],
                past: <IReservation[]>[],
                future: <IReservation[]>[] 
            }
        }
        
        if (results != null) {
            viewData.reservations = <any> _.groupBy(results.reservations, (s: IReservation) => s.status);
        }
        
        res.render("my_reservations", viewData);
    }
}