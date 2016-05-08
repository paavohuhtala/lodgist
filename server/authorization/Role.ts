
import {RequestEx} from "../RequestEx"
import {IUserRow, Role} from "../models/User"
import {userCompose} from "./Utils"

const rolePriority = {
    unverifiedUser: 0,
    user: 1,
    unapprovedSeller: 2,
    seller: 3,
    admin: 4
}

function getRolePriority(role: Role) {
    return <number> rolePriority[role];
}

export function isAtLeast(role: Role) {
    let priority = getRolePriority(role);
    return (user: IUserRow) => {
        return getRolePriority(user.role) >= priority;
    };
}

export function isSeller(allowUnverified: boolean = true) {
    return (user: IUserRow) => {
        if (user == null) {
            return false;
        }
        
        return (allowUnverified && (user.role == "unapprovedSeller")) || user.role == "seller";
    }
}

export function isAdmin(user: IUserRow) {
    if (user == null) {
        return false;
    }
    
    return user.role == "admin";
}

export const isVerifiedSellerP = userCompose(isSeller(false)); 
export const isAnySellerP = userCompose(isSeller(true)); 
export const isAdminP = userCompose(isAdmin);
