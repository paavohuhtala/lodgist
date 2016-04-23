
declare namespace PgRange {
    type RangeType = number | Date
    type RangeBounds = "()" | "(]" | "[)" | "[]"

    export interface JsonRange<T extends RangeType> {
        lower: T;
        upper: T;
        bounds: RangeBounds;
    }
    
    export interface Range<T extends RangeType> extends JsonRange<T> {
        toJson(): JsonRange<T>
        toPostgres(): string
    }
    
    export interface RangeConstructor {
        (l: Date, h: Date, bounds: RangeBounds) : Range<Date>
        (l: number, h: number, bounds: RangeBounds) : Range<number>
    }
}

