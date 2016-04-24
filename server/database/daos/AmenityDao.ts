
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {IAmenity, Amenity} from "../../models/Amenity"

export class AmenityDao extends BaseDao<IAmenity, number> {
    protected getColumns() {
        return Amenity.columns;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("Amenities", "id", connection);
    }
}