namespace lodgist.models {
    export interface IRef<TRef, TKey> { }
    export interface IntRef<TRef> extends IRef<TRef, Number>, Number { }   
    export interface StringRef<TRef> extends IRef<TRef, String>, String { }
}