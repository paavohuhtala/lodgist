
import {IUser} from "./User"

interface IBaseSeller {
    userId: number
    company_name: string
    vatId: string
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
