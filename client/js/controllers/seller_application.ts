
namespace lodgist.controllers {
    
    interface ISellerApplicationScope extends ng.IScope {
        seller: {}
        billingAddressEnabled: boolean
    }
    
    export class SellerApplication {
        constructor($scope: ISellerApplicationScope, $http: ng.IHttpService) {
            $scope.seller = {}
            $scope.billingAddressEnabled = false;
        }
    }
}
