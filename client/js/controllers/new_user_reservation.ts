
namespace lodgist.controllers {
    
    interface NewUserReservationScope extends angular.IScope {
        lodging: {
            price_per_night: number
        },
        reservation: {
            lodging?: number
            during: {
                lower?: Date
                upper?: Date
            }
        },
        getPrice(): number
        getNights(): number
        onSend(): void
    }
   
    export class NewUserReservation {
        
        private $scope: NewUserReservationScope

        constructor($scope: NewUserReservationScope, $http: angular.IHttpService) {
            this.$scope = $scope
            
            $scope.reservation = {
                during: {}
            }
            
            $scope.getNights = () => {
                if ($scope.reservation.during.upper == null || $scope.reservation.during.lower == null) {
                    return null;
                }
                
                const nights = moment($scope.reservation.during.upper).startOf("day").diff(
                               moment($scope.reservation.during.lower).startOf("day"), "days");
                
                return nights;
            }
            
            $scope.getPrice = () => {   
                
                const nights = $scope.getNights();
                
                if (nights == null) {
                    return null;
                }
                
                return nights * $scope.lodging.price_per_night;
            };
            
            $scope.onSend = () => {
                $http.post("/api/v1/reservations/user/new", $scope.reservation).then(res => {
                    alert("success :D"); 
                });
            };
        }
    }
}
