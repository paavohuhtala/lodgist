
import {IUserRow} from "../models/User"
import {ILodgingRow} from "../models/Lodging"
import {} from "../Role"

export async function canReserve(user: IUserRow, lodgingId: number) {
    return true;
}

import {RequestEx} from "../RequestEx"
import {Response, NextFunction} from "express"

export type CapabilityPredicate = (req: RequestEx) => Promise<boolean>

export function middlewarify(pred: CapabilityPredicate, onForbidden?) {
    return (req: RequestEx, res: Response, next: NextFunction) => {
        if (pred(req)) {
            next();
        } else if (onForbidden) {
            onForbidden();
        } else {
            res.sendStatus(403);
        }
    }
}
