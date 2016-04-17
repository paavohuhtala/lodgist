
import {BaseDao} from "../BaseDao"
import {IAddress, Address} from "../../models/Address"

export class AddressDao extends BaseDao<IAddress, number> {
    protected getColumns() {
        return Address.addressMembers;
    }
    
    constructor() {
        super("Addresses", "id");
    }
}