namespace lodgist.models {
    export interface IAddress {
        id: number
        street1: string
        street2?: string
        postalCode: string
        city: string
        country: string
    }
    
    export const addressMembers = ["id", "street1", "street2", "postalCode", "city", "country"]
}