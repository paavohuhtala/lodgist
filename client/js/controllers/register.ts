
namespace lodgist.controllers {
    
    export interface RegisterScope extends angular.IScope {
        user: {
            name?: string
            email?: string
            password?: string
            passwordVerify?: string,
            address: {
                street1?: string,
                street2?: string,
                postal_code?: string,
                city?: string
            },
        },
        onSend: () => void
    }
    
    export class Register {        

        constructor($scope: RegisterScope, $http: ng.IHttpService) {
            $scope.user = { address: { } }
            
            $scope.onSend = () => {
                $http.post("/api/v1/users", $scope.user)
                .then(succ => 
                    $http({
                        method: "POST", url:`/api/v1/login`,
                        params: {email: $scope.user.email, password:  $scope.user.password}}))
                .then(succ => {
                    location.pathname = "/"
                });
            }
        }
    }
}
