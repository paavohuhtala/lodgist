
export type Option<T> = Some<T> | None

export class Some<T> {
    private _value: T
    
    public get value() {
        return this._value;
    }
    
    constructor(value: T) {
        this._value = value;
    } 
}

export class None { }

export function some<T>(value: T) {
    return new Some(value);
}

export function none<T>() {
    return new None();
}

export function isSome<T>(option: Option<T>): option is Some<T> {
    return (<Some<T>> option).value !== undefined;
}

export function isNone<T>(option: Option<T>): option is None {
    return (<Some<T>> option).value === undefined;
}