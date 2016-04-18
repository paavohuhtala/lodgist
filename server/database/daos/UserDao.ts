
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {User, IUserRow} from "../../models/User"

export class UserDao extends BaseDao<IUserRow, number> {
    protected getColumns() {
        return User.userRowMembers;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("Users", "id", connection);
    }
}