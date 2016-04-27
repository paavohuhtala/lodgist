import {Express, Response, NextFunction} from "express"
import {RequestEx} from "./RequestEx"

import {Index} from "./controllers/Index"

import {LoginApi, LogoutApi} from "./controllers/api/Login"
import {Login} from "./controllers/Login"
import {Register} from "./controllers/Register"

import {Lodging, NewLodging} from "./controllers/Lodging"
import {Lodgings} from "./controllers/Lodgings"
import {LodgingSearchApi} from "./controllers/api/LodgingSearch"
import {NewLodgingApi} from "./controllers/api/NewLodging"

import {MyReservations} from "./controllers/MyReservations"
import {Reservation} from "./controllers/Reservation"
import {LodgingReservations} from "./controllers/LodgingReservations"
import {NewExternalReservation, NewUserReservation} from "./controllers/NewReservation"
import {NewExternalReservationApi, NewUserReservationApi} from "./controllers/api/NewReservation"
import {ReservationBoundsApi} from "./controllers/api/ReservationBounds"
import {AmenitiesApi} from "./controllers/api/Amenities"

import {NewUserApi, EmailAvailableApi} from "./controllers/api/NewUser"

import {PaymentProvider} from "./controllers/mock/PaymentProvider"
import {PaymentCallbackApi} from "./controllers/mock/api/Payment"

// TODO: move to authentication/authorization
function isLoggedIn(req: RequestEx, res: Response, next: NextFunction) {
    if (req.user === undefined) {
        res.sendStatus(401);
        return;
    }
    
    next();
}

// TODO: group & label these better
export function registerRoutes(app: Express) {
    app.get("/", Index.get);

    app.get("/login", Login.get);
    app.get("/register", Register.get);
    
    app.get("/lodgings", Lodgings.get);
    app.get("/lodgings/new", isLoggedIn, NewLodging.get);
    app.get("/lodgings/:id/reservations/user/new", isLoggedIn, NewUserReservation.get);
    app.get("/lodgings/:id/reservations/external/new", isLoggedIn, NewExternalReservation.get);
    app.get("/lodgings/:id/reservations", isLoggedIn, LodgingReservations.get);
    app.get("/lodgings/:id", Lodging.get);    
    
    app.get("/my_reservations", isLoggedIn, MyReservations.get);
    app.get("/reservations/:id", isLoggedIn, Reservation.get);
    
    app.get("/mock/payment_provider/:reservation_id", isLoggedIn, PaymentProvider.get);
    app.post("/api/v1/mock/payment_callback", isLoggedIn, PaymentCallbackApi.post);
    
    app.post("/api/v1/login", LoginApi.post);
    app.post("/api/v1/logout", isLoggedIn, LogoutApi.post);
    
    app.get("/api/v1/lodgings", LodgingSearchApi.get);
    app.post("/api/v1/lodgings/new", isLoggedIn, NewLodgingApi.post);
    app.post("/api/v1/reservations/user/new", isLoggedIn, NewUserReservationApi.post);
    app.post("/api/v1/reservations/external/new", isLoggedIn, NewExternalReservationApi.post);
    app.get("/api/v1/lodgings/:id/reservations/bounds", isLoggedIn, ReservationBoundsApi.get);
    
    app.get("/api/v1/amenities", AmenitiesApi.get);
    
    app.get("/api/v1/users/:email/available", EmailAvailableApi.get);
    app.post("/api/v1/users", NewUserApi.post);
}