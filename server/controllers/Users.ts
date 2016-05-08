
import * as pgp from "pg-promise"
import {getClient} from "../database/Connection"
import {Request, Response} from "express"
import {IController} from "../IController"
import * as _ from "lodash"

const query = new pgp.QueryFile("./sql/queries/users.sql", {debug: true});

export const Users : IController = {
    get: async (req: Request, res: Response) => {
        const users = await getClient().many(query);
        
        const groupedUsers = _.groupBy(users, u => u.role);

        res.render("users", {users: groupedUsers});
    }
}
