
import {RequestEx} from "../RequestEx"
import {IUserRow, Role} from "../models/User"

import * as _ from "lodash"

export function userCompose(pred: (user: IUserRow) => boolean) {
    return (request: RequestEx) => {
         if (!request.user) {
             return false;
         } else {
             return pred(request.user);
         }
    }
}

export function paramUserComposeP(paramName: string, pred: (id: number, user: IUserRow) => Promise<boolean>) {
    return async (req: RequestEx) => {        
        const id = parseInt(req.params[paramName]);
        
        if (req.user == null || id == null) {
            return false;
        }

        return pred(id, req.user);
    }
}

export function promisify(pred: (req: RequestEx) => boolean) {
    return async (req: RequestEx) => pred(req);
}
