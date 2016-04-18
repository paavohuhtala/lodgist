
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {ISessionRow, sessionRowMembers} from "../../models/Session"

export class SessionDao extends BaseDao<ISessionRow, number> {
    protected getColumns() {
        return sessionRowMembers;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("Sessions", "user_id", connection);
    }
}