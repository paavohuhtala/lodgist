
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import * as _ from "lodash"

import {toPgRange} from "../../RangeUtils"
import * as pgp from "pg-promise"
import {LodgingDao} from "../../database/daos/LodgingDao"

export const LodgingApi : IController = {
    get: async (req: RequestEx, res: Response) => {
        const lodging = await new LodgingDao().getById(req.params.id);
        res.send(lodging);
    }
}
