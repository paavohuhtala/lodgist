
export interface IAmenity {
    id: number
    name: string
    icon?: string
}

export interface ILodgingAmenity {
    lodging: number
    amenity: number
}

export module Amenity {
    export const columns = ["id", "name", "icon"]
}

export module LodgingAmenity {
    export const columns = ["lodging", "amenity"]
}