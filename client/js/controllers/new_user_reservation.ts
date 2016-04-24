
namespace lodgist.controllers {
    
    interface DateRange {
        start: Date,
        end: Date
    }
    
    interface SerializedDateRange {
        start: string,
        end: string
    }
    
    function parseDateRange(range: SerializedDateRange) : DateRange {
        return {
            start: new Date(range.start),
            end: new Date(range.end)
        }
    }
    
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
        bounds?: {
            starts: DateRange[],
            ends: DateRange[]
        }
        controls: {
            
        }
        getBounds(): void
        setLodgdingId(id: number): void
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
            
            $scope.setLodgdingId = (id) => {
                $scope.reservation.lodging = id;
                $scope.getBounds();
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
                    location.pathname = `/mock/payment_provider/${res.data}`;
                });
            };
            
            // Disable selection until fetched
            $scope.bounds = {
                starts: [{start: new Date("1970-01-01"), end: new Date("2038-01-01")}],
                ends: [{start: new Date("1970-01-01"), end: new Date("2038-01-01")}]
            }
            
            $scope.getBounds = () => {
                $http.get(`/api/v1/lodgings/${$scope.reservation.lodging}/reservations/bounds`).then(res => {
                    const bounds : {starts: SerializedDateRange[], ends: SerializedDateRange[]} = <any> res.data
                    
                    const dateBounds = {
                        starts: bounds.starts.map(parseDateRange),
                        ends: bounds.ends.map(parseDateRange)
                    }
                    
                    $scope.bounds = dateBounds
                })
            }
        }
    }
}
