
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"

import {getClient} from "../../database/Connection"

const startsQuery = `
    SELECT date(lower(during) - interval '1 day') as "start", date(upper(during) - interval '1 day')  as "end" FROM "Reservations"
    JOIN "Lodgings" ON "Lodgings".id = $<lodging>
    WHERE lodging = $<lodging>`
    
const endsQuery = `
    SELECT date(lower(during)) as "start", date(upper(during)) as "end" FROM "Reservations"
    JOIN "Lodgings" ON "Lodgings".id = $<lodging>
    WHERE lodging = $<lodging>`

export const ReservationBoundsApi : IController = {
    get: async (req: RequestEx, res: Response) => {
        const lodgingId = parseInt(req.params.id);
        const client = getClient();
        
        const starts = await client.manyOrNone(startsQuery, {lodging: lodgingId});
        const ends = await client.manyOrNone(endsQuery, {lodging: lodgingId});
        
        res.send({starts: starts, ends: ends});
    }
}