
namespace lodgist.controllers {
    
    interface EditLodgingScope extends angular.IScope {
        lodging: {
            address: {
                street1?: string,
                street2?: string,
                postal_code?: string,
                city?: string
            },
            owner?: number,
            name?: string,
            description?: string,
            is_public?: boolean,
            reservation_start?: string,
            reservation_end?: string,
            price_per_night?: number,
            amenities: any[]
        }
        onSave: () => void,
        onPublish: () => void,
        amenities?: number[],
        lodgingId: number,
        setLodgingId: (number) => void
    }
    
   
    export class EditLodging {
        constructor($scope: EditLodgingScope, $http: angular.IHttpService) {
            $scope.lodging = {
                amenities: [],
                address: {}
            }
            
            $scope.onSave = () => {
                $http.put(`/api/v1/lodgings/${$scope.lodgingId}/`, $scope.lodging).then(succ => {
                    location.pathname = `/lodgings/${$scope.lodgingId}`;
                });
            };
            
            $scope.setLodgingId = (id) => {
                $scope.lodgingId = id;
                $http.get(`/api/v1/lodgings/${$scope.lodgingId}`).then(res => {
                    const lodging = <typeof $scope.lodging> res.data;

                    // HACK HACK HACK ish: removes seconds from the time
                    lodging.reservation_start = lodging.reservation_start.split(":").slice(0, 2).join(":");
                    lodging.reservation_end = lodging.reservation_end.split(":").slice(0, 2).join(":");
                    
                    // Pick IDs from the lodgings
                    lodging.amenities = lodging.amenities.map(l => l.id);
                    
                    $scope.lodging = lodging;
                });
            }

            $http.get("/api/v1/amenities").then(res => {
               $scope.amenities = <any[]> res.data; 
            });
        }
    }
}
