
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import {getClient} from "../../database/Connection"
import {UserDao} from "../../database/daos/UserDao"

export const EmailAvailableApi : IController = {
    get: async (req: RequestEx, res: Response) => {
        const email = <string> req.params.email;
        
        if (email == null) {
            res.sendStatus(400);
            return;
        }
        
        const exists = await new UserDao().exists("email", email);
        
        if (exists) {
            res.sendStatus(404);
        } else {
            res.sendStatus(200);
        }
    }
}