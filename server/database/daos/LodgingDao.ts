
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {ILodgingRow, Lodging} from "../../models/Lodging"

export class LodgingDao extends BaseDao<ILodgingRow, number> {

    protected getColumns() {
        return Lodging.lodgingRowMembers;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("Lodgings", "id", connection);
    }
}