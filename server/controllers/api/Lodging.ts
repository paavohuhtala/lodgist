
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import * as _ from "lodash"

import {getClient} from "../../database/Connection"
import {toPgRange} from "../../RangeUtils"
import * as pgp from "pg-promise"

import {ILodging, ILodgingRow, Lodging} from "../../models/Lodging"
import {IAddress} from "../../models/Address"
import {AddressDao} from "../../database/daos/AddressDao"
import {LodgingDao} from "../../database/daos/LodgingDao"
import {LodgingAmenityDao} from "../../database/daos/LodgingAmenityDao"

const query = new pgp.QueryFile("./sql/queries/lodging.sql", {debug: true});

interface IModifyLodgingRequest {
    name?: string
    description?: string
    reservation_start?: string
    reservation_end?: string
    price_per_night?: number
    area?: number
    floors?: number
    built_year?: number
    renovated_year?: number
    
    address?: IAddress
    amenities?: number[]
}

async function modifyLodging(lodgingId: number, lodging: IModifyLodgingRequest) {
    return getClient().tx(async (t: pgp.IDatabase<any>) => {
        const oldLodging = await new LodgingDao(t).getById(lodgingId);
        
        if (lodging.address) {
            await new AddressDao(t).update(lodging.address, "_primary", oldLodging.address);
        }
        
        if (lodging.amenities) {
            await t.query(`DELETE FROM "LodgingAmenities" WHERE lodging = $<lodgingId>`, {lodgingId});
            
            if (lodging.amenities.length > 0) {
                await new LodgingAmenityDao(t).insertAll(lodgingId, lodging.amenities);
            }
        }

        const modifiedLodging = <ILodgingRow> _.pick(lodging, Lodging.baseMembers);
        delete modifiedLodging.address;
        
        await new LodgingDao(t).update(modifiedLodging, "_primary", lodgingId);
    });
}

export const LodgingApi : IController = {
    get: async (req: RequestEx, res: Response) => {
        const lodging = await getClient().one(query, {lodging: req.params.id});
        res.send(lodging.lodging);
    },
    put: async (req: RequestEx, res: Response) => {
        const requestLodging = <IModifyLodgingRequest> req.body;
        delete (<any>requestLodging).id
        delete (<any>requestLodging).is_public
        
        const lodgingId = parseInt(req.params.id);
        
        try {
            await modifyLodging(lodgingId, requestLodging);
            res.sendStatus(200);
        } catch (e) {
            console.log(e);
            res.sendStatus(400);
        }
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
