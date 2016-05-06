
import {IUser} from "./User"

interface IBaseSeller {
    user_id: number
    company_name: string
    vat_id: string
}

export interface ISellerRow extends IBaseSeller {
    billing_address: number
}

export interface ISeller extends IBaseSeller {
    user: IUser
}

export interface ISellerUser extends IUser {
    seller: ISeller
}

export module Seller {
    export const columns = ["user_id", "company_name", "billing_address", "vat_id"];
}
