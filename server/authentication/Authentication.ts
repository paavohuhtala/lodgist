
import * as _ from "lodash"
import {UserDao} from "../database/daos/UserDao"
import {ISessionRow} from "../models/Session"
import * as bcrypt from "bcrypt"
import * as Promise from "bluebird"
import {getOrCreate} from "./Session"

type AuthenticationStatus = "unknown_user" | "invalid_password" | "valid"

export interface IAuthenticationResult {
    status: AuthenticationStatus
    session?: ISessionRow
}

function createResult(status: AuthenticationStatus, session?: ISessionRow) : IAuthenticationResult {
    return {
        status: status,
        session: session
    }
}

const verifyHash = Promise.promisify(bcrypt.compare)

export async function authenticate(request: lodgist.requests.LoginRequest) : Promise<IAuthenticationResult> {
    const userDao = new UserDao();
    const user = await userDao.getOneByColumn<string>("email", request.email);
    
    if (user == null) {
        return createResult("unknown_user");
    }
    
    const isValid = await verifyHash(user.password, request.password);
    
    if (!isValid) {
        return createResult("invalid_password");
    }
    
    const session = await getOrCreate(user)
    
    return createResult("valid", session);
}
