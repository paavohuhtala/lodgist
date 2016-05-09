
namespace lodgist.controllers {
    
    interface IPaymentProviderScope extends angular.IScope {
        reservation: number
        onClickPay(): void
    }
    
    export class PaymentProvider {
        constructor($scope: IPaymentProviderScope, $http: angular.IHttpService) {
            $scope.onClickPay = () => {
                $http.post("/api/v1/mock/payment_callback", {success: true, reservation: $scope.reservation}).then(res => {
                    window.location.href = <string> res.data; 
                });
            };
        }
    }
}
