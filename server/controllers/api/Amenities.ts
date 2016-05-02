
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"

import {IAmenity} from "../../models/Amenity"
import {getClient} from "../../database/Connection"
import {AmenityDao} from "../../database/daos/AmenityDao"
import * as _ from "lodash"

const query = `
    SELECT
        a.*,
        EXISTS (SELECT * FROM "LodgingAmenities" la
                WHERE la.amenity = a.id) AS used
    FROM "Amenities" a
    ORDER BY a.id`

// The DB already disallows null strings, but this also checks for empty and
// whitespace strings.
function validateName(amenityName: string) {
    if (amenityName == "") {
        return false;
    }
    
    if (_.trim(amenityName).length == 0) {
        return false;
    }
    
    return true;
}

export const AmenitiesApi : IController = {
    get: async (req: RequestEx, res: Response) => {
        const amenities = await getClient().manyOrNone(query);
        res.send(amenities);
    },
    post: async (req: RequestEx, res: Response) => {
        const amenity = <IAmenity> req.body;

        try {
            if (!validateName(amenity.name)) {
                throw "Bad name"; 
            }
            
            const newAmenityId = await new AmenityDao().insert(amenity);
            res.status(200).send(newAmenityId.toString());
        } catch (e) {
            res.sendStatus(400);
        }
    },
    delete: async (req: RequestEx, res: Response) => {
        const id = parseInt(req.params.id);
        
        try {
            await new AmenityDao().delete(id);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(400);
        }
    },
    put: async (req: RequestEx, res: Response) => {
        const id = parseInt(req.params.id);
        
        const amenity = <IAmenity> req.body;
        
        // You aren't allowed to change the id with PUT
        delete amenity.id;
        
        try {
            if (amenity.name && !validateName(amenity.name)) {
                throw "Bad name"; 
            }
            
            await new AmenityDao().update(amenity, "_primary", id);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(400);
        }
    }
}
