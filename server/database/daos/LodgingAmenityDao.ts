
import {getClient} from "../Connection";
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {IAmenity, ILodgingAmenity, LodgingAmenity} from "../../models/Amenity"

// This does't inherit from BaseDao, because the base DAO doesn't support
//composite primary keys.
// TODO: share connection logic with BaseDao, with a common subclass.
export class LodgingAmenityDao {
        
    private connection: pgp.IDatabase<any>;
        
    constructor(connection?: pgp.IDatabase<any>) {
        if (connection) {
            this.connection = connection;
        }
    }

    private getClient() {
        if (this.connection) {
            return this.connection;
        }
        
        return getClient();
    }
    
    /**
     * Batch inserts an array of amenities into LodgingAmenities, for the given lodging.
     */
    public insertAll(lodgingId: number, amenities: number[]) {
        const rows = amenities.map((a, i) => `(${lodgingId}, $${i + 1})`).join(", ");
        const query = `INSERT INTO "LodgingAmenities" (lodging, amenity) VALUES ${rows}`
        
        return this.getClient().query(query, amenities);
    }
        
    public getByLodging(lodgingId: number) {
        const query = `
            SELECT id, name, icon FROM "LodgingAmenities"
            JOIN "Amenities" ON amenity = id
            WHERE lodging = $1`
            
        return this.getClient().manyOrNone(query, lodgingId).then(succ => <IAmenity[]> succ);
    }
}