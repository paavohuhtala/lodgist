
namespace lodgist.controllers {
    
    interface IUserScope extends ng.IScope {
        approveSeller(id: number): void
    }
    
    export class Users {
        constructor($scope: IUserScope, $http: ng.IHttpService) {
            
            // TODO: replace with dynamic loading instead of a refresh
            $scope.approveSeller = (id) => {
                $http({
                    method: "POST",
                    url: `/api/v1/users/${id}/approve_application`
                }).then(succ => location.reload());
            }
        }
    }
}
