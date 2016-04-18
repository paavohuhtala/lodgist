
import {RequestEx} from "../RequestEx"
import {Response, NextFunction} from "express"
import {tryGet} from "./Session"
import {UserDao} from "../database/daos/UserDao"

export function attachSession(req: RequestEx, res: Response, next: NextFunction) {

    if (!req.cookies) {
        next();
        return;
    }
    
    const token : string = req.cookies.session_token
    
    if (token !== null && token !== undefined) {
        tryGet(token).then(session => {
            if (session.isSome) {
                req.session = session.value;
            } else {
                res.clearCookie("session_token");
            }
            
            next();
        });
    } else {
        next();
    }
}

const userDao = new UserDao();

export function attachUser(req: RequestEx, res: Response, next: NextFunction) {
    if (req.session !== null && req.session !== undefined) {
        userDao.getById(req.session.user_id).then(user => {
            req.user = user;
            next();
        });
    } else {
        next();
    }
}