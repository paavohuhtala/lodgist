
import * as moment from "moment"
import {authenticate} from "../../authentication/Authentication"
import {deleteIfExists} from "../../authentication/Session"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import {ILoginRequest, LoginRequest} from "../../models/requests/LoginRequest"
import * as _ from "lodash"

export const LoginApi : IController = {
    post: (req: RequestEx, res: Response) => {
        
        if (req.session !== null && req.session !== undefined) {
            res.status(400).send("You are already logged in.");
            return;
        }
        
        const loginRequest = <ILoginRequest> _.pick(req.query, LoginRequest.loginRequestMembers);
        
        if (!loginRequest.email || !loginRequest.password) {
            res.status(400).send("Invalid login request.");
            return;
        }
        
        authenticate(loginRequest).then(result => {
            if (result.status === "valid") {
                res.cookie("session_token", result.session.token, {
                    expires: moment(result.session.valid_until).toDate()
                }).sendStatus(200)
            } else {
                res.status(403).send(result.status);
            }
        });
    }
}

export const LogoutApi : IController = {
    post: (req: RequestEx, res: Response) => {
        if (req.session !== null && req.session !== undefined) {
            deleteIfExists(req.session.user_id);
        }
        
        res.sendStatus(200);
    }
}
