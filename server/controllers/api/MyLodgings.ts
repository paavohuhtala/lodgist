
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import * as _ from "lodash"

import {toPgRange} from "../../RangeUtils"
import * as pgp from "pg-promise"
import {getClient} from "../../database/Connection"

const query = new pgp.QueryFile("./sql/queries/my_lodgings.sql", {debug: true});

export const MyLodgingsApi : IController = {
    get: async (req: RequestEx, res: Response) => {
        const lodgings = await getClient().manyOrNone(query, {user_id: req.user.id});
        res.send(lodgings);
    }
}
