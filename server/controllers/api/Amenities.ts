
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"

import {IAmenity} from "../../models/Amenity"
import {getClient} from "../../database/Connection"
import {AmenityDao} from "../../database/daos/AmenityDao"

const query = `
    SELECT
        a.*,
        EXISTS (SELECT * FROM "LodgingAmenities" la
                WHERE la.amenity = a.id) AS used
    FROM "Amenities" a`

export const AmenitiesApi : IController = {
    get: async (req: RequestEx, res: Response) => {
        const amenities = await getClient().manyOrNone(query);
        res.send(amenities);
    },
    post: async (req: RequestEx, res: Response) => {
        const amenity = <IAmenity> req.body;
        
        try {
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
    }
}
