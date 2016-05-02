
namespace lodgist.controllers {
    
    interface IAmenity {
        id: number
    }
    
    interface AmenitiesScope extends ng.IScope {
        amenities?: IAmenity[]
        deleteAmenity: (index: number) => void;
        updateAmenities: () => void;
        createAmenity: () => void;
        updateAmenity: (id: number, property: "name" | "icon", newValue: string) => void;
        
        newAmenity: {
            name?: string
        }
    }
    
    export class Amenities {
        constructor($scope: AmenitiesScope, $http: ng.IHttpService) {
            
            $scope.updateAmenities = () => {
                $scope.amenities = []
                $http.get("/api/v1/amenities").then(results => {
                    $scope.amenities = <IAmenity[]> results.data;
                });
            };
            
            $scope.deleteAmenity = (index) => {
                $http.delete(`/api/v1/amenities/${$scope.amenities[index].id}`).then(succ => {
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
            
            $scope.updateAmenity = (id, property, newValue) => {
                const amenity = {
                    id: id
                }
                
                amenity[property] = newValue;
                
                $http.put(`/api/v1/amenities/${amenity.id}`, amenity).then(succ => {
                    $scope.updateAmenities();
                });
            };
            
            $scope.updateAmenities();
        }
    }
}
