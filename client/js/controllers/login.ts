
namespace lodgist.controllers {

    interface LoginScope extends angular.IScope {
        loginDetails: {
            email?: string,
            password?: string
        }

        controls: {
            loginButton: {
                text: string,
                onClick: () => void
            }
        }

    }

    export class Login {
        constructor($scope: LoginScope, $http: angular.IHttpService) {
            $scope.loginDetails = {}
            
            $scope.controls = {
                loginButton: {
                    text: "Login",
                    onClick: () => {
                        $http({
                            method: "POST",
                            url: "/api/v1/login",
                            params: $scope.loginDetails
                        }).
                        then(success => {
                            $scope.controls.loginButton.text = "Success";
                            setTimeout(() => window.location.pathname = "/", 500);
                        });
                    }
                }
            }
        }
    }
}