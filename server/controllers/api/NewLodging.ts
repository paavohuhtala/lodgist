
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"

import * as Promise from "bluebird"

import * as pgp from "pg-promise"
import {ILodging, ILodgingRow, Lodging} from "../../models/Lodging"
import {IUserRow} from "../../models/User"
import {IAddress} from "../../models/Address"

import {getClient} from "../../database/Connection"
import {AddressDao} from "../../database/daos/AddressDao"
import {LodgingDao} from "../../database/daos/LodgingDao"
import * as _ from "lodash"

// CONSIDER sharing this with the model, somehow
interface INewLodgingRequest {
    name: string
    description: string
    is_public: boolean
    reservation_start: string
    reservation_end: string
    price_per_night: number
    area?: number
    floors?: number
    built_year?: number
    renovated_year?: number
    
    address: IAddress
    amenities: number[]
}

// CONSIDER moving this to DAO
function addAmenities(t: pgp.IDatabase<any>, lodgingId: number, amenities: number[]) {
    const rows = amenities.map((a, i) => `(${lodgingId}, $${i + 1})`).join(", ");
    const query = `INSERT INTO "LodgingAmenities" (lodging, amenity) VALUES ${rows}`
    
    return t.query(query, amenities);
}

async function createLodging(lodging: INewLodgingRequest, owner: IUserRow) : Promise<number> {
    return getClient().tx(async (t: pgp.IDatabase<any>) => {
        
        let addressId = await new AddressDao(t).insert(lodging.address);
        
        if (addressId == null) {
            return Promise.reject("Invalid address.");
        }
        
        const modifiedLodging = <ILodgingRow> _.pick(lodging, Lodging.baseMembers)
        modifiedLodging.address = addressId;
        modifiedLodging.owner = owner.id;
        
        const lodgingId = await new LodgingDao(t).insert(modifiedLodging);
        
        if (lodging.amenities != null && lodging.amenities.length > 0) {
            await addAmenities(t, lodgingId, lodging.amenities);
        }
        
        return lodgingId;
    });
}

export const NewLodgingApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        if (!req.body) {
            res.sendStatus(400);
            return;
        }
        
        let lodging = <INewLodgingRequest> req.body

        let newLodgingId = await createLodging(lodging, req.user);
        
        if (newLodgingId == null) {
            res.sendStatus(400);
            return;
        }
        
        res.status(200).send(newLodgingId.toString());
    }
}