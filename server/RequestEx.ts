
import {Request} from "express"
import {ISessionRow} from "./models/Session"
import {IUserRow} from "./models/User"

/**
 * An extended Expresss request object, with strongly typed cookies and
 * session / user data.
 */
export interface RequestEx extends Request {
    
    cookies: {
        session_token?: string
    }
    
    session?: ISessionRow
    user: IUserRow 
}