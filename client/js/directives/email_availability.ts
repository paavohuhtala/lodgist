namespace lodgist.directives {
    
    export class EmailAvailabilityValidator implements ng.IDirective {
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
        public require = "ngModel";
        
        constructor($http: ng.IHttpService) {
            this.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {
                ngModel.$asyncValidators["emailAvailability"] = (email, _) => {
                    return $http.get("/api/v1/users/" + email + "/available");
                }
            }
        }
        
        public static getInstance() : ng.IDirectiveFactory {
            const directive = ($http: ng.IHttpService) => {
                return new EmailAvailabilityValidator($http);
            };
            
            directive["$inject"] = ["$http"]
            
            return directive;
        }
    }
}
