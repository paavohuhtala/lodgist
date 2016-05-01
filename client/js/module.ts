
"use strict";

namespace lodgist {
    angular
    .module("lodgist", ["mgcrea.ngStrap"])
    .directive("emailAvailabilityValidator", lodgist.directives.EmailAvailabilityValidator.getInstance())
    .directive("inputsMatch", lodgist.directives.InputsMatchValidator.getInstance())
    .controller("RootController", lodgist.controllers.Root)
    .controller("IndexController", lodgist.controllers.Index)
    .controller("LoginController", lodgist.controllers.Login)
    .controller("RegisterController", lodgist.controllers.Register)
    .controller("LodgingsController", lodgist.controllers.Lodgings)
    .controller("LodgingController", lodgist.controllers.Lodging)
    .controller("ReservationController", lodgist.controllers.Reservation)
    .controller("NewLodgingController", lodgist.controllers.NewLodging)
    .controller("NewUserReservationController", lodgist.controllers.NewUserReservation)
    .controller("NewExternalReservationController", lodgist.controllers.NewExternalReservation)
    .controller("MyReservationsController", lodgist.controllers.MyReservations)
    .controller("PaymentProviderController", lodgist.controllers.PaymentProvider)
    .config(($datepickerProvider: mgcrea.ngStrap.datepicker.IDatepickerProvider) => {
        angular.extend($datepickerProvider.defaults, {
            monthTitleFormat: "LLLL yyyy",
            monthFormat: "LLLL"
        });
    });
}
