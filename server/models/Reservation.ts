
import {ILodging} from "./Lodging"

export type ReservationType = "external" | "user"

interface IBaseReservation {
    id?: number    
    type: ReservationType
    during: PgRange.Range<Date>
}

export interface IReservationRow extends IBaseReservation {
    lodging: number
}

export interface IReservation extends IBaseReservation {
    lodging: ILodging
}

export interface IBaseExternalReservation {
    reason: string
}

export interface IExternalReservationRow extends IBaseExternalReservation {
    reservation: number
}

export interface IExternalReservation extends IBaseExternalReservation {
    reservation: IReservationRow
}

export interface IBaseUserReservation {
    customer: number
    price: number
    is_paid: boolean
}

export interface IUserReservationRow extends IBaseUserReservation {
    reservation: number
}

export interface IUserReservation extends IBaseUserReservation {
    reservation: IReservationRow
}

export module Reservation {
    export const baseMembers = ["id", "type", "during"];
    export const columns = ["lodging"].concat(baseMembers);
}

export module ExternalReservation {
    export const baseMembers = ["reason"]
    export const columns = ["reservation"].concat(baseMembers);
}

export module UserReservation {
    export const baseMembers = ["customer", "price", "is_paid"];
    export const columns = ["reservation"].concat(baseMembers);
}