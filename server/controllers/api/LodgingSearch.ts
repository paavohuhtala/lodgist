
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import * as _ from "lodash"

import {Range} from "pg-range"
import * as pgp from "pg-promise"
import {getClient} from "../../database/Connection"

const query = new pgp.QueryFile("./sql/queries/lodging_search.sql", {debug: true});

export const LodgingSearchApi : IController = {
    get: async (req: RequestEx, res: Response) => {
        let range = req.query.range;
        
        if (req.query.range != null) {
            range = Range
        }
        
        if (range === undefined) {
            range = null;
        }
        
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
