
export class Option<T> {
    private _isSome: boolean
    private _value: T
    
    public get isSome() {
        return this._isSome;
    }
    
    public get isNone() {
        return !this._isSome;
    }
    
    public get value() {
        if (this.isSome) {
            return this._value;
        } else {
            throw "Can't get null option."
        }
    }
    
    constructor(isSome: boolean, value?: T) {
        if (isSome) {
            this._isSome = true;
            this._value = null;
        } else {
            this._isSome = false;
            this._value = null;
        }
    }
}

export function some<T>(value: T) {
    return new Option<T>(true, value);
}

export function none<T>() {
    return new Option<T>(false);
}
