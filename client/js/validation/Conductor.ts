
interface IMonad<T> {
    new(): <TWrapped extends IMonad<T>>(of: T) => TWrapped
    bind: <TWrappedA extends IMonad<T>, TWrappedB extends IMonad<B>, B>(f: (x: T) => TWrappedB) => TWrappedB
}

module Conductor {
    class ValidationResult<T, TMeta> {
        value: ValidResult<T> | InvalidResult<TMeta>
        
        constructor(value: ValidResult<T> | InvalidResult<TMeta> | ValidationResult<T, TMeta>) {
            if (value instanceof ValidationResult) {
                this.value = value.value;
            } else if (value instanceof ValidResult || value instanceof InvalidResult){
                this.value = value;
            }
        }
        
        public isValid(): boolean {
            return this.value instanceof ValidResult;
        }
        
        public getValue() {
            if (this.value instanceof ValidResult) {
                return (<ValidResult<T>> this.value).value;
            } else {
                throw "Tried to get non-existant result";
            }
        }
        
        public getError() {
            return (<InvalidResult<TMeta>> this.value).meta;
        }
        
        public bind<TB>(f: (from: T) => ValidationResult<TB, TMeta>) {
            if (!this.isValid()) {
                return new ValidationResult<TB, TMeta>(new InvalidResult(this.getError()));
            }
            
            return new ValidationResult<TB, TMeta>(f(this.getValue()));
        }
        
        public map<TM>(f: (from: T) => TM) {
            return new ValidationResult<TM, TMeta>(new ValidResult(f(this.getValue())));
        }
    }
    
    class ValidResult<T> {
        public value: T
        
        constructor(value: T) {
            this.value = value;
        }
    }
    
    class InvalidResult<TMeta> {
        public meta: TMeta
        
        constructor(meta: TMeta) {
            this.meta = meta;
        }
    }
    
    type Validator<A, B, TMeta> = (data: A) => Q.IPromise<ValidationResult<B, TMeta>>
    
    module ValidationResult {
        
    }
}