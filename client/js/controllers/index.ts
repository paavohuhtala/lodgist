
module lodgist.controllers {
    
    export interface IndexScope extends angular.IScope {
        test: string
    }
    
    export class Index {
        constructor($scope: IndexScope, $datepicker: mgcrea.ngStrap.datepicker.IDatepickerService) {
            $scope.test = "hello, world";
            
            // We are using an undocumented option to work around a localization issue.
            let options = {
                monthTitleFormat: "LLLL yyyy"
            }
            
            //let fromPicker = $datepicker(angular.element(document.getElementById("dateFrom")), this, options);
            //let toPicker = $datepicker(angular.element(document.getElementById("dateTo")), this, options);
        }
    }
}
