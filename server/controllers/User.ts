
import {Response} from "express"
import {RequestEx} from "../RequestEx"
import {IController} from "../IController"
import * as pgp from "pg-promise"
import {getClient} from "../database/Connection"

const query = new pgp.QueryFile("./sql/queries/user.sql", {debug: true});

function userView(userId: number) {
    return async (req: RequestEx, res: Response) => {
        const viewUser = await getClient().one(query, {user_id: userId});

        // Called viewUser because otherwise it will conflict with the currently
        // logged in user.
        const viewData = {
            viewUser,
            alert: null
        }

        if (req.query.application_sent !== undefined) {
            viewData.alert = "application_sent";
        }

        res.render("user", viewData);
    }
}

export const User : IController = {
    get: async (req: RequestEx, res: Response) => userView(req.params.id)(req, res)
}

export const Me : IController = {
    get: async (req: RequestEx, res: Response) => userView(req.user.id)(req, res)
}
