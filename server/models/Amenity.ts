
export interface IAmenity {
    id: number
    name: string
    icon?: string
}

export module Amenity {
    export const columns = ["id", "name", "icon"]
}