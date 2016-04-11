namespace lodgist.models {
    interface IBaseSession {
        created: Date
        validUntil: Date
        token: string
    }
    
    export interface ISessionRow extends IBaseSession {
        userId: IntRef<IUserRow>        
    }
    
    export interface ISession extends IBaseSession {
        user: IUser
    }
}