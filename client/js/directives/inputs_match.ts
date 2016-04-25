namespace lodgist.directives {
    
    interface IInputsMatchScope extends ng.IScope {
        other: string
    }
    
    export class InputsMatchValidator implements ng.IDirective {
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;
        public require = "ngModel";
        public scope = {
            other: "="
        }
        
        constructor() {
            this.link = (scope: IInputsMatchScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {
                ngModel.$validators["inputsMatch"] = (value, _) => {
                    console.log(value);
                    console.log(scope);
                    return value == scope.other};
            }
        }
        
        public static getInstance() : ng.IDirectiveFactory {
            const directive = () => {
                return new InputsMatchValidator();
            };

            return directive;
        }
    }
}
