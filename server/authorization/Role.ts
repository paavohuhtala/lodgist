
import {IUserRow, Role} from "../models/User"

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
    return (user: IUserRow) => getRolePriority(user.role) >= priority;
}

export function isSeller(user: IUserRow, allowUnverified: boolean = true) {
    return (allowUnverified && user.role == "unverifiedSeller") || user.role == "seller";
}

export function isAdmin(user: IUserRow) {
    return user.role == "admin";
}