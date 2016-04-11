
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