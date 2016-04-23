
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"

import * as Promise from "bluebird"

import * as pgp from "pg-promise"
import {ILodging, ILodgingRow, Lodging} from "../../models/Lodging"
import {IUserRow} from "../../models/User"

import {getClient} from "../../database/Connection"
import {AddressDao} from "../../database/daos/AddressDao"
import {LodgingDao} from "../../database/daos/LodgingDao"
import * as _ from "lodash"

async function createLodging(lodging: ILodging, owner: IUserRow) : Promise<number> {
    return getClient().tx(async (t: pgp.IDatabase<any>) => {
        
        let addressId = await new AddressDao(t).insert(lodging.address);
        
        if (addressId == null) {
            return Promise.reject("Invalid address.");
        }
        
        let modifiedLodging = <ILodgingRow> _.pick(lodging, Lodging.baseMembers)
        modifiedLodging.address = addressId;
        modifiedLodging.owner = owner.id;
        
        return await new LodgingDao(t).insert(modifiedLodging);
    });
}

export const NewLodgingApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        if (!req.body) {
            res.sendStatus(400);
            return;
        }
        
        let lodging = <ILodging> req.body

        let newLodgingId = await createLodging(lodging, req.user);
        
        if (newLodgingId == null) {
            res.sendStatus(400);
            return;
        }
        
        res.status(200).send(newLodgingId.toString());
    }
}