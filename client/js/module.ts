
"use strict";

module lodgist {
    angular
    .module("lodgist", ["mgcrea.ngStrap"])
    .controller("IndexController", lodgist.controllers.Index)
    .controller("RegisterController", lodgist.controllers.Register)
    .config(($datepickerProvider: mgcrea.ngStrap.datepicker.IDatepickerProvider) => {
        angular.extend($datepickerProvider.defaults, {monthTitleFormat: "LLLL yyyy"});
    });
}
