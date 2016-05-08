
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
        },
        controls: {
            sendButton: {
                onClick: () => void
            }
        },
        amenities?: number[]
    }
    
   
    export class NewLodging {
        private $scope: NewLodgingScope
        
        private onSend($http: angular.IHttpService) {
            return () => {
                $http.post("/api/v1/lodgings/new", this.$scope.lodging).then(res => {
                    location.pathname = `lodgings/${res.data}`
                });
            };
        }
        
        constructor($scope: NewLodgingScope, $http: angular.IHttpService) {
            this.$scope = $scope

            /*$scope.lodging = {
                address: {
                    street1: "Testikatu 1",
                    postal_code: "666000",
                    city: "Kerava"
                },
                name: "Testimökki MAHTAVALLA paikalla",
                reservation_start: "12:30",
                reservation_end: "11:00",
                description: "Esimerkkikuvaus",
                price_per_night: 45,
                amenities: []
            }*/
            
            $scope.lodging = {
                amenities: [],
                address: {}
            }
            
            $scope.controls = {
                sendButton: { onClick: this.onSend($http) }
            }
            
            $http.get("/api/v1/amenities").then(res => {
               $scope.amenities = <any[]> res.data; 
            });
        }
    }
}
