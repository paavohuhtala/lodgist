
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import * as _ from "lodash"

import {Range} from "pg-range"
import {toPgRange} from "../../RangeUtils"

import {getClient} from "../../database/Connection"

// The big query, which powers the lodging search. Searches via..
// 1. The query parameter, which is matched aganst the names of the lodgings,
//    the city parts of the addresses and the company names of the sellers. 
// 2. The date range. If the range is specified, the query excludes
//    lodgings with reservations intersecting with the specified range.
// 3. The amenity list. If the list is non-empty, only lodgings with all of the
//    specified amenities are included.
//
// Why is it so ugly?
// 1. The query parameter must be formatted as an open value, using the 
//    #-suffix, so that it can be combined with % for the LIKE query. Due to
//    limitations / safety measures in pg-promise, open values can't be null.
// 2. PostgreSQL dosn't like empty arrays - the type checker throws a fit,
//    unless every single usage of potentially empty arrays has explicit type
//    annotations. This is done with the amenity list. 
// 
const query = `
    SELECT DISTINCT l.*, a.city, s.company_name FROM "Lodgings" l
    INNER JOIN "Sellers" s ON s.user_id = l.owner
    INNER JOIN "Addresses" a ON l.address = a.id
    LEFT JOIN "Reservations" r on l.id = r.lodging
    WHERE ($<query> = ''
           OR (name ILIKE '%$<query#>%')
           OR (s.company_name ILIKE '%$<query#>%')
           OR (a.city ILIKE '%$<query#>%'))
    AND ($<range> IS NULL
         OR ((SELECT COUNT(*) FROM "Reservations" rs WHERE rs.lodging = l.id) < 1)
         OR (NOT (
             tsrange(date_trunc('day', lower(tsrange($<range>))) + l.reservation_start,
                     date_trunc('day', upper(tsrange($<range>))) + l.reservation_end) && r.during)))
    AND ($<amenities>::integer[] IS NULL
         OR array_length($<amenities>::integer[], 1) < 1
         OR (SELECT amenities FROM "LodgingAmenityArrays" laa WHERE laa.lodging = l.id) @> $<amenities>::integer[])
    ORDER BY l.name, l.id DESC`

export const LodgingSearchApi : IController = {
    get: async (req: RequestEx, res: Response) => {
        const range = req.query.range;
        
        let amenities: number[]; 
        
        if(_.isArray(req.query.amenities)) {
            amenities = req.query.amenities
        } else if (req.query.amenities != null) {
            amenities = [req.query.amenities]
        } else {
            amenities = [];
        }
        
        const params = {
            query: req.query.q || "",
            range,
            amenities: amenities
        }
        
        try {
            const lodgings = await getClient().manyOrNone(query, params);
            res.send(lodgings);            
        } catch (e) {
            console.log(e);
            res.sendStatus(400);
        }
    }
}
