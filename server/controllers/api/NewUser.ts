
import * as moment from "moment"
import * as Promise from "bluebird"
import * as pgp from "pg-promise"
import {Response} from "express"
import {hash} from "bcrypt"

import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import {getClient} from "../../database/Connection"

import {UserDao} from "../../database/daos/UserDao"
import {AddressDao} from "../../database/daos/AddressDao"

import {IAddress} from "../../models/Address"
import {IUserRow} from "../../models/User"

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

interface INewUserRequest {
    name: string
    password: string
    email: string
    phone: string
    address: IAddress    
}

const promisifiedHash = Promise.promisify(hash)

async function createUser(userRequest: INewUserRequest) : Promise<number> {
    return getClient().tx(async (t: pgp.IDatabase<any>) => {
        const addressId = await new AddressDao(t).insert(userRequest.address);
        const hashedPassword = await promisifiedHash(userRequest.password, 10);
        
        const user : IUserRow = {
            name: userRequest.name,
            password: hashedPassword,
            email: userRequest.email,
            phone: userRequest.phone,
            address: addressId,
            role: "user"
        }
        
        return new UserDao(t).insert(user);
    });
}

// TODO: implement more error handling
export const NewUserApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        const request = <INewUserRequest> req.body;
        const userId = await createUser(request);
        
        res.send(userId.toString());
    }
}