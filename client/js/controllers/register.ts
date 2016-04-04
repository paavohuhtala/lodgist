
module lodgist.controllers {
    
    interface Control<T> {
        value: T
        state: "pristine" | "valid" | "invalid"
    }
    
    export interface RegisterScope extends angular.IScope {
        name: string
        email: string
        password: string
        passwordVerify: string
        
        isValid: () => boolean
    }
    
    export class Register {        
        
        private isValid() {
            
        }
        
        constructor($scope: RegisterScope) {
        }
    }
}
