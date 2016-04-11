
import {SessionDao} from "../database/daos/SessionDao"
import {getClient} from "../database/Connection"
import {ISessionRow} from "../models/Session"

async function refresh(session: ISessionRow) {
    const dao = new SessionDao();
}
