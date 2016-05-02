
import {IMinimalRange} from "../../RangeUtils"

export interface INewReservationRequest {
    during: IMinimalRange<string>
    lodging?: number
}

export interface INewUserReservationRequest extends INewReservationRequest { }

export interface INewExternalReservationRequest extends INewReservationRequest {
    reason: string
}
