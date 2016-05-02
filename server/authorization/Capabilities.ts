
import {IUserRow} from "../models/User"
import {ILodgingRow} from "../models/Lodging"

import {getClient} from "../database/Connection"

import {LodgingDao} from "../database/daos/LodgingDao"
import {ReservationDao} from "../database/daos/ReservationDao"
import {UserReservationDao} from "../database/daos/UserReservationDao"

import * as Role from "./Role"
import {paramUserComposeP, userCompose, promisify} from "./Utils"

import {RequestEx} from "../RequestEx"
import {Response, NextFunction} from "express"

export type AsyncPredicate = (req: RequestEx) => Promise<boolean>

export module Lodging {
    
    export async function isOwnerOf(lodgingId: number, user: IUserRow) {
        const lodging = await new LodgingDao().getById(lodgingId);
        
        if (lodging.owner === user.id) {
            return true;
        }
        
        return false;
    }
    
    export async function canUserReserve(lodgingId: number, user: IUserRow) {
        // Unverified users can't reserve
        if (!Role.isAtLeast("user")) {
            return false;
        }
        
        // The owner can't user reserve his own lodging
        try {
            return !(await isOwnerOf(lodgingId, user));
        } catch (e) {
            return false;
        }
    }

    export async function canExternalReserve(lodgingId: number, user: IUserRow) {
        try {
            return await isOwnerOf(lodgingId, user);
        } catch (e) {
            return false;
        }
    }
    
    export const canPost = Role.isAnySellerP
    
    export async function canPublicize(lodgingId: number, user: IUserRow) {
        // TODO
    }
    
    export const isOwnerOfAP = paramUserComposeP("id", isOwnerOf);
    export const canUserReserveAP = paramUserComposeP("id", canUserReserve);
    export const canExternalReserveAP = paramUserComposeP("id", canExternalReserve);
    export const canPostAP = promisify(canPost);
}

export module Reservation {
    export async function canAccess(reservationId: number, user: IUserRow) : Promise<boolean> {
        try {
            return getClient().task(async (t) => {
                const reservation = await new ReservationDao(t).getById(reservationId);
                const lodging = await new LodgingDao(t).getById(reservation.lodging);
                const userReservation = await new UserReservationDao(t).getById(reservationId);

                return Role.isAdmin(user) ||
                       (user.id === lodging.owner) || 
                       (userReservation != null && user.id === userReservation.customer);
            });
        } catch (e) {
            return false;
        }
    }
    
    export const canAccessAP = paramUserComposeP("id", canAccess);
}

export module Amenities {
    export const canManipulate = Role.isAdminP;
    export const canManipulateAP = promisify(canManipulate);
}