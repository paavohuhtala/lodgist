
import {SessionDao} from "../database/daos/SessionDao"
import {getClient} from "../database/Connection"
import {ISessionRow} from "../models/Session"
import {IUserRow} from "../models/User"
import {Option, some, none} from "../Option"
import * as _ from "lodash"
import * as Promise from "bluebird"
import * as crypto from "crypto"
import * as moment from "moment"

const randomBytes = Promise.promisify(crypto.randomBytes)

const dao = new SessionDao();

async function create(user: IUserRow) {
    // 16 * 8 = 128 bits of entropy
    const token = await randomBytes(16); 
    
    const session : ISessionRow = {
        user_id: user.id,
        created: moment().toISOString(),
        valid_until: moment().add(2, "weeks").toISOString(),
        // TODO?: Some modified form of base64 would be more efficient 
        token: token.toString("hex")
    }

    await dao.insert(session);
    
    return session;
}

async function refresh(session: ISessionRow) {
    const update = {
        valid_until: moment().add(2, "weeks").toISOString()
    }
    
    await dao.update(update, "user_id", session.user_id);
    
    return _.assign(_.clone(session), update);
}

function isValid(session: ISessionRow) {
    return moment(session.valid_until).isAfter(moment());
}

export async function getOrCreate(user: IUserRow) {
    const session = await dao.getById(user.id);
    
    if (session == null) {
        return create(user);
    }
    
    if (isValid(session)) {
        return refresh(session);
    }
    
    await dao.delete(session.user_id);

    return create(user);
}

export async function tryGet(sessionToken: string) : Promise<Option<ISessionRow>> {
    const session = await dao.getOneByColumn("token", sessionToken);

    if (session != null) {
        if (moment(session.valid_until).isAfter(moment())) {
            return some(await refresh(session));
        } else {
            return none<ISessionRow>();
        }
    } else {
        return none<ISessionRow>();
    }
}

export async function deleteIfExists(userId: number) {
    return dao.delete(userId);
}