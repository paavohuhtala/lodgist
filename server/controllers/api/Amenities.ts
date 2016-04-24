
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"

import {getClient} from "../../database/Connection"
import {AmenityDao} from "../../database/daos/AmenityDao"

export const AmenitiesApi : IController = {
    get: async (req: RequestEx, res: Response) => {
        const amenities = await new AmenityDao().getAll({limit: 1000});
        res.send(amenities);
    }
}
