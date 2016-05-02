
namespace lodgist.controllers {
    
    interface IMyLodgingsScope extends ng.IScope {
        dynamicLodgings: any[]
    }
    
    export class MyLodgings {
        constructor($scope: IMyLodgingsScope, $http: ng.IHttpService) {
            $http.get("/api/v1/my_lodgings").then(res => {
                $scope.dynamicLodgings = <any[]> res.data;
            });
        }
    }
}
