
import {ILodging} from "./Lodging"

export type ReservationType = "external" | "user"

interface IBaseReservation {
    id: number
    type: ReservationType
    during: PgRange.Range<Date>
}

export interface IReservationRow {
    lodging: number
}

export interface IReservation {
    lodging: ILodging
}

export interface IExternalReservationRow {
    reservation: number
    reason: string
}

export interface IUserReserationRow {
    reservation: number
    customer: number
    price: number
}

export module Reservation {
    export const baseMembers = ["id", "type", "during"];
    export const rowMembers = ["lodging"].concat(baseMembers);
}