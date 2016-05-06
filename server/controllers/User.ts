
import {Request, Response} from "express"
import {IController} from "../IController"
import * as pgp from "pg-promise"
import {getClient} from "../database/Connection"

const query = new pgp.QueryFile("./sql/queries/user.sql", {debug: true});

export const User : IController = {
    get: async (req: Request, res: Response) => {
        
        const user = await getClient().one(query);
        
        const viewData = {
            user,
            alert: null
        }
        
        if (req.query.application_sent) {
            viewData.alert = "application_sent";
        }
        
        res.render("user", viewData);
    }
}
