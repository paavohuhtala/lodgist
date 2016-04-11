namespace lodgist.models {
    
    type ReservationType = "external" | "user"
    
    interface IBaseReservation {
        id: IntRef<IBaseReservation>
        type: ReservationType
        during: PgRange.Range<Date>
    }
    
    export interface IReservationRow {
        lodging: IntRef<ILodgingRow>
    }
    
    export interface IReservation {
        lodging: ILodging
    }
}