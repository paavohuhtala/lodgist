
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {IAddress, Address} from "../../models/Address"

export class AddressDao extends BaseDao<IAddress, number> {
    protected getColumns() {
        return Address.members;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("Addresses", "id", connection);
    }
}