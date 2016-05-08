
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

export const PublishLodgingApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        const lodgingId = parseInt(req.params.id);
        
        if (req.user.role == "unapprovedSeller") {
            res.sendStatus(400);
            return;
        }

        await new LodgingDao().update({is_public: true}, "_primary", lodgingId);
        res.sendStatus(200);
    }
}

export const UnpublishLodgingApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        const lodgingId = parseInt(req.params.id);
        
        if (req.user.role == "unapprovedSeller") {
            res.sendStatus(400);
            return;
        }
        
        await new LodgingDao().update({is_public: false}, "_primary", lodgingId);
        res.sendStatus(200);
    }
}
