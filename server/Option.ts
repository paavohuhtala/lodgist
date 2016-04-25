
/**
 * A disjoint union of Some<T> and None.
 * Can be matched with isSome / isNone type guard functions, or extracted
 * with extract.
 */
export type Option<T> = Some<T> | None<T>

/**
 * A wrapped value
 */
export class Some<T> {
    private _value: T
    
    public get value() {
        return this._value;
    }
    
    constructor(value: T) {
        this._value = value;
    } 
}

/**
 * Represents the lack of a value
 */
export class None<T> { }

/**
 * Wraps a value into a Some<T>
 */
export function some<T>(value: T) {
    return new Some(value);
}

/**
 * Returns a new None<T>
 */
export function none<T>() {
    return new None();
}

export function isSome<T>(option: Option<T>): option is Some<T> {
    return (<Some<T>> option).value !== undefined;
}

export function isNone<T>(option: Option<T>): option is None<T> {
    return (<Some<T>> option).value === undefined;
}

/**
 * Extracts a T from an Option<T>.
 * If the Option is a None, throws an exception.
 */
export function extract<T>(option: Option<T>) : T {
    if (isNone<T>(option)) {
        throw "Tried to extract empty option."
    }
    
    return (<Some<T>> option).value;
}
