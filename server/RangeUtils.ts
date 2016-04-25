
import {Range} from "pg-range"

/**
 * A subset of PgRange.Range<Date>
 */
export interface IMinimalRange<T> {
    lower: T
    upper: T
}

export function isDateRange(x: any): x is IMinimalRange<Date> {
    return (x.lower instanceof Date &&
            x.upper instanceof Date);
}

/**
 * A PgRange.Range with formatting support
 */
export interface IDBRange<T extends PgRange.RangeType> extends PgRange.Range<T> {
    formatDBType(): string
}

/**
 * Applies a function to the both members of a range, and returns a new one.
 */
export function map<TFrom, TTo>(range: IMinimalRange<TFrom>, f: (x: TFrom) => TTo): IMinimalRange<TTo> {
    return {
        lower: f(range.lower),
        upper: f(range.upper)
    }
}

/**
 * Converts an IRequestRange<Datw> into a pg-range -compatible range, and
 * attaches a formatting function to it.
 */
export function toPgRange(range: IMinimalRange<Date>) {
    const dbRange = <IDBRange<Date>> Range(range.lower, range.upper, "[)");

    dbRange.formatDBType = function() {
        const thisr = <PgRange.Range<Date>> this;
        return `${thisr.bounds[0]}${thisr.lower.toISOString()},${thisr.upper.toISOString()}${thisr.bounds[1]}`;
    };
    
    return dbRange;
}