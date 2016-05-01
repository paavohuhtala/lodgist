
namespace lodgist.controllers {
    
    interface AmenitiesScope extends ng.IScope {
        amenities?: any[]
        deleteAmenity: (id: number) => void;
        updateAmenities: () => void;
        createAmenity: () => void;
        
        newAmenity: {
            name?: string
        }
    }
    
    export class Amenities {
        constructor($scope: AmenitiesScope, $http: ng.IHttpService) {
            
            $scope.updateAmenities = () => {
                $scope.amenities = []
                $http.get("/api/v1/amenities").then(results => {
                    $scope.amenities = <any[]> results.data;
                });
            };
            
            $scope.deleteAmenity = (id) => {
                $http.delete(`/api/v1/amenities/${id}`).then(succ => {
                    $scope.updateAmenities();              
                });
            };
            
            $scope.newAmenity = {}
            
            $scope.createAmenity = () => {
                $http.post("/api/v1/amenities", $scope.newAmenity).then(succ => {
                    $scope.newAmenity = {}
                    $scope.updateAmenities();
                });
            };
            
            $scope.updateAmenities();
        }
    }
}
