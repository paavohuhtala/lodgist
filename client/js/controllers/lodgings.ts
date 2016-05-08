
namespace lodgist.controllers {
    
    interface ISearchRequest {
        query?: string,
        from?: Date,
        to?: Date,
        amenities?: number[]
    }
    
    interface ILodgingsScope extends ng.IScope {
        amenities: any[]
        search: ISearchRequest
        onSearch(): void
        dynamicLodgings: any[]
        searchOptions: ng.INgModelOptions
    }
    
    export class Lodgings {
        constructor($scope: ILodgingsScope, $http: ng.IHttpService) {
            $http.get("/api/v1/amenities").then(res => {
               $scope.amenities = <any[]> res.data; 
            });
            
            $scope.search = {}
            
            $scope.searchOptions = {
                debounce: 200
            }

            function getRangeParam() {
                if ($scope.search.from == null || $scope.search.to == null) {
                    return null;
                } else {
                    return `[${$scope.search.from.toISOString()}, ${$scope.search.to.toISOString()}]`;
                }
            }
            
            $scope.onSearch = () => {
                $http({
                    method: "GET",
                    url: "/api/v1/lodgings",
                    params: {
                        q: $scope.search.query,
                        amenities: $scope.search.amenities,
                        range: getRangeParam()
                    }
                }).then(res => {
                     $scope.dynamicLodgings = <any[]> res.data;
                });
            };
            
            $scope.onSearch();
        }
    }
}
