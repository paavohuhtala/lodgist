namespace lodgist.models {
    interface IBaseLodging {
        id: IntRef<IBaseLodging>
        owner: IntRef<IUser>
    }
    
    export const baseLodgingMembers = ["id", "owner"]
    
    export interface ILodgingRow extends IBaseLodging {
        address: IntRef<IAddress>
    }
    
    export interface ILodging extends IBaseLodging {
        address: IAddress
    }
}