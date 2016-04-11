
import {IAddress} from "./Address"

export type Role = "unverifiedUser" | "user" | "unapprovedSeller" | "seller" | "admin"

interface IBaseUser {
    id: number
    role: Role
    name: string
    email: string
    phone: string
}

export interface IUserRow extends IBaseUser {
    password: string
    address: number
}

export interface IUser extends IBaseUser {
    address: IAddress
}

export module User {
    export const baseUserMembers = ["id", "role", "name", "email", "phone"];
    export const userRowMembers : string[] = ["password", "address"].concat(baseUserMembers);
    export const userMembers : string[] = ["address"].concat(baseUserMembers);
}