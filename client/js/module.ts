
"use strict";

namespace lodgist {
    angular
    .module("lodgist", ["mgcrea.ngStrap"])
    .controller("RootController", lodgist.controllers.Root)
    .controller("IndexController", lodgist.controllers.Index)
    .controller("LoginController", lodgist.controllers.Login)
    .controller("RegisterController", lodgist.controllers.Register)
    .config(($datepickerProvider: mgcrea.ngStrap.datepicker.IDatepickerProvider) => {
        angular.extend($datepickerProvider.defaults, {monthTitleFormat: "LLLL yyyy"});
    });
}
