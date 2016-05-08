
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"
import {getClient} from "../../database/Connection"
import * as _ from "lodash"

import {ISellerRow} from "../../models/Seller"
import {IAddress} from "../../models/Address"
import {SellerDao} from "../../database/daos/SellerDao"
import {UserDao} from "../../database/daos/UserDao"
import {AddressDao} from "../../database/daos/AddressDao"

interface ISellerApplicationRequest {
    company_name: string
    billing_address?: IAddress
    vat_id: string
}

export const NewSellerApplicationApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        const application = <ISellerApplicationRequest> req.body;
        
        getClient().tx(async (t) => {
            
            let addressId : number = null;
            
            if (application.billing_address) {
                addressId = await new AddressDao(t).insert(application.billing_address);
            }
            
            await new UserDao(t).update({role: "unapprovedSeller"}, "_primary", req.user.id);
            
            const seller: ISellerRow = {
                user_id: req.user.id,
                company_name: application.company_name,
                vat_id: application.vat_id,
                billing_address: addressId
            }
            
            await new SellerDao(t).insert(seller);
            
            res.sendStatus(200);
        });
    }
}

export const ApproveApplicationApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        await new UserDao().update({role: "seller"}, "_primary", req.params.id);
        res.sendStatus(200);
    }
}
