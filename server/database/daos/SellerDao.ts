
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {ISellerRow, Seller} from "../../models/Seller"

export class SellerDao extends BaseDao<ISellerRow, number> {
    protected getColumns() {
        return Seller.columns;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("Sellers", "user_id", connection);
    }
}
