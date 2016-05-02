
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import * as _ from "lodash"

import {toPgRange} from "../../RangeUtils"
import * as pgp from "pg-promise"
import {IReviewRow} from "../../models/Review"

export const NewReviewApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        const lodgingId = req.params.id;
        const review = req.body
    }
}
