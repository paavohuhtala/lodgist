
namespace lodgist.controllers {
    
    interface GlobalControls {
        logout: {
            onClick: () => void
        }
    }
    
    interface IGlobalScope extends angular.IScope {
        global: {
            controls: GlobalControls
        }
    }
    
    export class Root {
        constructor($scope: IGlobalScope, $http: angular.IHttpService) {
            const controls : GlobalControls = {
                logout: {
                    onClick: () => {
                        $http.post("/api/v1/logout", {}).then(() => {
                            window.location.pathname = "/login"
                        });
                    }
                }
            }
            
            $scope.global = {
                controls: controls
            }
        }
    }
}
