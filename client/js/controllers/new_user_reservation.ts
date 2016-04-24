
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
            datePickers: {
                areDisabled: boolean
            }
        }
        getBounds(): void
        setLodgingId(id: number): void
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
            
            // CONSIDER sharing this with the server codebase, by implementing as an API
            $scope.getNights = () => {
                if ($scope.reservation.during.upper == null || $scope.reservation.during.lower == null) {
                    return null;
                }
                
                const nights = moment($scope.reservation.during.upper).startOf("day").diff(
                               moment($scope.reservation.during.lower).startOf("day"), "days");
                
                return nights;
            }
            
            $scope.setLodgingId = (id) => {
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

            $scope.getBounds = () => {
                $http.get(`/api/v1/lodgings/${$scope.reservation.lodging}/reservations/bounds`).then(res => {
                    const bounds : {starts: SerializedDateRange[], ends: SerializedDateRange[]} = <any> res.data
                    
                    const dateBounds = {
                        starts: bounds.starts.map(parseDateRange),
                        ends: bounds.ends.map(parseDateRange)
                    }
                    
                    $scope.bounds = dateBounds
                    $scope.controls.datePickers.areDisabled = false
                })
            }
            
            $scope.controls = {
                // Date pickers are disabled until we've fetched the reserved dates
                datePickers: {
                    areDisabled: true
                }
            }
        }
    }
}
