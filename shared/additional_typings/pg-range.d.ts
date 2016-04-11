
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

/*declare module "pg-range" {
    
    import * as pg from "pg"
    
    export function install(pg: pg.Client): void;
    export const Range: PgRange.RangeConstructor;
}*/
