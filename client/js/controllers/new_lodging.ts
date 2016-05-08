
namespace lodgist.controllers {
    
    interface NewLodgingScope extends angular.IScope {
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
        canPublish?: number
    }
    
   
    export class NewLodging {
        constructor($scope: NewLodgingScope, $http: angular.IHttpService) {
            $scope.lodging = {
                amenities: [],
                address: {}
            }
            
            function save() {
                return $http.post("/api/v1/lodgings/new", $scope.lodging).then(res => <number> res.data);
            }
            
            function publish(id: number) {
                return $http.post(`/api/v1/lodgings/${id}/publish`, {}).then(_ => id);
            }
            
            $scope.onSave = () => {
                save().then(id => location.pathname = `lodgings/${id}`);
            };
            
            $scope.onPublish = () => {
                save().then(id => publish(id)).then(id => location.pathname = `lodgings/${id}`); 
            }
            
            $http.get("/api/v1/amenities").then(res => {
               $scope.amenities = <any[]> res.data; 
            });
        }
    }
}
