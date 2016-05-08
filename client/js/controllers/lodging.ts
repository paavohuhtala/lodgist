
namespace lodgist.controllers {
    
    interface ILodgingScope {
        lodgingId: number
        onUnpublish(): void
        onPublish(): void
    }
    
    export class Lodging {
        constructor($scope: ILodgingScope, $http: ng.IHttpService) {
            
            $scope.onPublish = () => {
                $http({
                    method: "POST",
                    url: `/api/v1/lodgings/${$scope.lodgingId}/publish`
                }).then(_ => location.reload());
            }
            
            $scope.onUnpublish = () => {
                $http({
                    method: "POST",
                    url: `/api/v1/lodgings/${$scope.lodgingId}/unpublish`
                }).then(_ => location.reload());
            }
        }
    }
}
