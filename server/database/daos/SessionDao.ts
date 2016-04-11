
import {BaseDao} from "../BaseDao"
import {ISessionRow, sessionRowMembers} from "../../models/Session"

export class SessionDao extends BaseDao<ISessionRow, number> {
    protected getColumns() {
        return sessionRowMembers;
    }
    
    constructor() {
        super("Sessions", "user_id");
    }
}