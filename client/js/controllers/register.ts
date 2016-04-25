
namespace lodgist.controllers {
    
    export interface RegisterScope extends angular.IScope {
        user: {
            name?: string
            email?: string
            password?: string
            passwordVerify?: string
        }
    }
    
    export class Register {        

        constructor($scope: RegisterScope) {
            $scope.user = {}
        }
    }
}
