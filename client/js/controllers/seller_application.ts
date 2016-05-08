
namespace lodgist.controllers {
    
    interface ISellerApplicationScope extends ng.IScope {
        seller: {}
        billingAddressEnabled: boolean
        onSend: () => void
    }
    
    export class SellerApplication {
        constructor($scope: ISellerApplicationScope, $http: ng.IHttpService) {
            $scope.seller = {}
            $scope.billingAddressEnabled = false;
            
            $scope.onSend = () => {
                $http.post("/api/v1/seller_application", $scope.seller).then(succ => {
                    location.pathname = "/me?application_sent"
                });
            }
        }
    }
}
