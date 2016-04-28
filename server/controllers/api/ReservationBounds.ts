
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"

import * as pgp from "pg-promise"
import {getClient} from "../../database/Connection"

const startsQuery = new pgp.QueryFile("./sql/queries/reservation_start_dates.sql");
const endsQuery = new pgp.QueryFile("./sql/queries/reservation_end_dates.sql");

export const ReservationBoundsApi : IController = {
    get: async (req: RequestEx, res: Response) => {
        const lodgingId = parseInt(req.params.id);
        const client = getClient();
        
        const starts = await client.manyOrNone(startsQuery, {lodging: lodgingId});
        const ends = await client.manyOrNone(endsQuery, {lodging: lodgingId});
        
        res.send({starts: starts, ends: ends});
    }
}