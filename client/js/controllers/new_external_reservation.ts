
// TOOD: this file is 99% similar to new_user_reservation

/// <reference path="../../../bower_components/moment/moment.d.ts" />

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
    
    interface NewExternalReservationScope extends angular.IScope {
        reservation: {
            lodging?: number
            during: {
                lower?: Date
                upper?: Date
            },
            reason?: string
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
        onSend(): void
    }
   
    export class NewExternalReservation {
        
        private $scope: NewExternalReservationScope

        constructor($scope: NewExternalReservationScope, $http: angular.IHttpService) {
            this.$scope = $scope
            
            $scope.reservation = {
                during: {}
            }
            
            $scope.setLodgingId = (id) => {
                $scope.reservation.lodging = id;
                $scope.getBounds();
            }

            $scope.onSend = () => {
                $http.post("/api/v1/reservations/external", $scope.reservation).then(res => {
                    location.pathname = `/reservations/${res.data}`;
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
