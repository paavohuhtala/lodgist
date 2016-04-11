
export interface IAddress {
    id: number
    street1: string
    street2?: string
    postal_code: string
    city: string
    country: string
}

export module Address {
    export const addressMembers = ["id", "street1", "street2", "postal_code", "city", "country"]
}
