
import {IAddress} from "./Address"

export interface IBaseLodging {
    id: number
    name: string
    description: string
    is_public: boolean
    reservation_start: string
    reservation_end: string
    price_per_night: number
    area: number
    floors: number
    built_year: number
    renovated_year: number
}

export interface ILodgingRow extends IBaseLodging {
    owner: number
    address: number
}

export interface ILodging extends IBaseLodging {
    address: IAddress
}

export module Lodging {
    export const baseLodgingMembers = ["id", "name", "description", "is_public", "reservation_start", "reservation_end", "price_per_night", "price_per_night", "area", "floors", "built_year", "renovated_year"];
    
    export const lodgingRowMembers = ["owner", "address"].concat(baseLodgingMembers);
}