
import * as moment from "moment"
import {Request, Response} from "express"
import {IController} from "../../IController"

import * as Promise from "bluebird"

import * as pgp from "pg-promise"
import {ILodging, ILodgingRow, Lodging} from "../../models/Lodging"

import {getClient} from "../../database/Connection"
import {AddressDao} from "../../database/daos/AddressDao"
import {LodgingDao} from "../../database/daos/LodgingDao"
import * as _ from "lodash"

async function createLodging(lodging: ILodging) : Promise<number> {
    return getClient().tx(async (t: pgp.IDatabase<any>) => {
                
        let addressId = await new AddressDao(t).insert(lodging.address);
        
        let modifiedLodging = <ILodgingRow> _.pick(lodging, Lodging.baseLodgingMembers)
        modifiedLodging.address = (<any> addressId).id;
        
        console.log(modifiedLodging);
        
        // FIXME FIXME FIXME
        modifiedLodging.owner = 3;
        
        return await new LodgingDao(t).insert(modifiedLodging);
    });
}

export const NewLodgingApi : IController = {
    post: async (req: Request, res: Response) => {
        if (!req.body) {
            res.sendStatus(400);
            return;
        }
        
        let lodging = <ILodging> req.body

        let newLodging = (<any>(await createLodging(lodging))).id
        
        res.status(200).send(newLodging.toString());
    }
}