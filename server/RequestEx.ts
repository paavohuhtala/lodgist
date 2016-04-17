
import {Request} from "express"
import {ISessionRow} from "./models/Session"
import {IUserRow} from "./models/User"

export interface RequestEx extends Request {
    
    cookies: {
        session_token?: string
    }
    
    session?: ISessionRow
    user: IUserRow 
}