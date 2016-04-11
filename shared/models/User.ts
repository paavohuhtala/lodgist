namespace lodgist.models {
    interface IBaseUser {
        id: IntRef<IBaseUser>
        role: Role
        name: string
        email: string
        phone: string
    }

    export const baseUserMembers = ["id", "role", "name", "email", "phone"]
    
    export interface IUserRow extends IBaseUser {
        password: string
        address: IntRef<IAddress>
    }
    
    export const userRowMembers : string[] = [].concat(baseUserMembers, ["password", "address"])
    
    export interface IUser extends IBaseUser {
        address: IAddress
    }
    
    export const userMembers : string[] = [].concat(baseUserMembers, ["address"])
}