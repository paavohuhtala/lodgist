
"use strict";

namespace lodgist {
    angular
    .module("lodgist", ["mgcrea.ngStrap"])
    .controller("RootController", lodgist.controllers.Root)
    .controller("IndexController", lodgist.controllers.Index)
    .controller("LoginController", lodgist.controllers.Login)
    .controller("RegisterController", lodgist.controllers.Register)
    .controller("LodgingsController", lodgist.controllers.Lodgings)
    .controller("LodgingController", lodgist.controllers.Lodging)
    .controller("NewLodgingController", lodgist.controllers.NewLodging)
    .controller("NewUserReservationController", lodgist.controllers.NewUserReservation)
    .config(($datepickerProvider: mgcrea.ngStrap.datepicker.IDatepickerProvider) => {
        angular.extend($datepickerProvider.defaults, {monthTitleFormat: "LLLL yyyy"});
    });
}
