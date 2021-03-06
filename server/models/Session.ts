
import {IUser} from "./User"

interface IBaseSession {
    created: string
    valid_until: string
    token: string
}

export const baseSessionMembers = ["created", "valid_until", "token"];

export interface ISessionRow extends IBaseSession {
    user_id: number
}

export const sessionRowMembers = ["user_id"].concat(baseSessionMembers);

export interface ISession extends IBaseSession {
    user: IUser
}

export const sessionMembers = ["user"].concat(baseSessionMembers);
