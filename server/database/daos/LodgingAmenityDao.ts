
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {ILodgingAmenity, LodgingAmenity} from "../../models/Amenity"

// This class should only be used with getAllByColumn, since most other
// functionality depends on the primary key. LodgingAmenities uses a composite
// primary key, which the base doesn't (and most likely won't ever) support.
export class LodgingAmenityDao extends BaseDao<ILodgingAmenity, number> {

    protected getColumns() {
        return LodgingAmenity.columns;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("LodgingAmenities", null, connection);
    }
}