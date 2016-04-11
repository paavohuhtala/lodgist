namespace lodgist.models {
    interface IBaseSeller {
        userId: IntRef<IUserRow>
        companyName: string
        vatId: string
    }
    
    export interface ISellerRow extends IBaseSeller {
        billingAddress: IntRef<IAddress>
    }
    
    export interface ISeller extends IBaseSeller {
        user: IUser
    }
    
    export interface ISellerUser extends IUser {
        seller: ISeller
    }
}