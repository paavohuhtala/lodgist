import {Express, Response, NextFunction} from "express"
import {RequestEx} from "./RequestEx"

import * as Role from "./authorization/Role"
import * as Capabilities from "./authorization/Capabilities"
import {promisify} from "./authorization/Utils"

import {Index} from "./controllers/Index"

import {LoginApi, LogoutApi} from "./controllers/api/Login"
import {Login} from "./controllers/Login"
import {Register} from "./controllers/Register"
import {SellerApplication} from "./controllers/SellerApplication"
import {NewSellerApplicationApi, ApproveApplicationApi} from "./controllers/api/SellerApplication"
import {User, Me} from "./controllers/User"
import {Users} from "./controllers/Users"

import {Lodging, NewLodging, EditLodging} from "./controllers/Lodging"
import {LodgingApi, PublishLodgingApi, UnpublishLodgingApi} from "./controllers/api/Lodging"
import {Lodgings} from "./controllers/Lodgings"
import {LodgingSearchApi} from "./controllers/api/LodgingSearch"
import {NewLodgingApi} from "./controllers/api/NewLodging"
import {MyLodgings} from "./controllers/MyLodgings"
import {MyLodgingsApi} from "./controllers/api/MyLodgings"

import {MyReservations} from "./controllers/MyReservations"
import {Reservation} from "./controllers/Reservation"
import {LodgingReservations} from "./controllers/LodgingReservations"
import {NewExternalReservation, NewUserReservation} from "./controllers/NewReservation"
import {NewExternalReservationApi, NewUserReservationApi} from "./controllers/api/NewReservation"
import {ReservationBoundsApi} from "./controllers/api/ReservationBounds"
import {Amenities} from "./controllers/Amenities"
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

function middlewarify(pred: (req: RequestEx) => Promise<boolean>, onForbidden?) {
    return async (req: RequestEx, res: Response, next: NextFunction) => {
        if (await pred(req)) {
            next();
        } else if (onForbidden) {
            onForbidden();
        } else {
            res.sendStatus(403);
        }
    }
}

// TODO: group & label these better
export function registerRoutes(app: Express) {
    
    // My kingdom for a function composition operator
    const canUserReserve = middlewarify(Capabilities.Lodging.canUserReserveAP);
    const canExternalReserve = middlewarify(Capabilities.Lodging.canExternalReserveAP);
    const isOwnerOf = middlewarify(Capabilities.Lodging.isOwnerOfAP);
    const canPostLodgings = middlewarify(Capabilities.Lodging.canPostAP);
    const canAccessReservation = middlewarify(Capabilities.Reservation.canAccessAP);
    const canManipulateAmenities = middlewarify(Capabilities.Amenities.canManipulateAP);
    const canAccessUser = middlewarify(Capabilities.User.canAccessUserAP);

    app.get("/", Index.get);

    app.get("/login", Login.get);
    app.get("/register", Register.get);
    app.get("/me", isLoggedIn, Me.get);
    app.get("/user/:id", canAccessUser, User.get);
    app.get("/users", middlewarify(promisify(Role.isAdminP)), Users.get);

    app.get("/seller_application", SellerApplication.get);

    app.get("/lodgings", Lodgings.get);
    app.get("/lodgings/new", canPostLodgings, NewLodging.get);
    app.get("/lodgings/:id/reservations/user/new", canUserReserve, NewUserReservation.get);
    app.get("/lodgings/:id/reservations/external/new", canExternalReserve, NewExternalReservation.get);
    app.get("/lodgings/:id/reservations", isOwnerOf, LodgingReservations.get);
    app.get("/lodgings/:id", Lodging.get);
    app.get("/lodgings/:id/edit", isOwnerOf, EditLodging.get);
    
    app.get("/my_lodgings", canPostLodgings, MyLodgings.get);
    
    app.get("/my_reservations", isLoggedIn, MyReservations.get);
    app.get("/reservations/:id", canAccessReservation, Reservation.get);    
    app.get("/mock/payment_provider/:id", canAccessReservation, PaymentProvider.get);
    
    // NOT SECURED. In a real-world system this would use access tokens and domain whitelisting.
    app.post("/api/v1/mock/payment_callback", isLoggedIn, PaymentCallbackApi.post);
    
    app.get("/amenities", canManipulateAmenities, Amenities.get);    
    
    app.post("/api/v1/login", LoginApi.post);
    app.post("/api/v1/logout", isLoggedIn, LogoutApi.post);
    
    app.get("/api/v1/my_lodgings", canPostLodgings, MyLodgingsApi.get);
    app.get("/api/v1/lodgings", LodgingSearchApi.get);
    app.post("/api/v1/lodgings/new", canPostLodgings, NewLodgingApi.post);
    
    // These two routes handle their own access control
    app.post("/api/v1/reservations/user", NewUserReservationApi.post);
    app.post("/api/v1/reservations/external", NewExternalReservationApi.post);
    
    app.get("/api/v1/lodgings/:id/reservations/bounds", ReservationBoundsApi.get);
    
    app.post("/api/v1/lodgings/:id/publish", isOwnerOf, PublishLodgingApi.post);
    app.post("/api/v1/lodgings/:id/unpublish", isOwnerOf, UnpublishLodgingApi.post);
    app.put("/api/v1/lodgings/:id", isOwnerOf, LodgingApi.put);
    app.get("/api/v1/lodgings/:id", isOwnerOf, LodgingApi.get);
    
    app.get("/api/v1/amenities", AmenitiesApi.get);
    app.post("/api/v1/amenities", canManipulateAmenities, AmenitiesApi.post);
    app.delete("/api/v1/amenities/:id", canManipulateAmenities, AmenitiesApi.delete);
    app.put("/api/v1/amenities/:id", canManipulateAmenities, AmenitiesApi.put);
    
    app.get("/api/v1/users/:email/available", EmailAvailableApi.get);
    app.post("/api/v1/users", NewUserApi.post);
    
    app.post("/api/v1/seller_application", isLoggedIn, NewSellerApplicationApi.post);
    app.post("/api/v1/users/:id/approve_application", middlewarify(promisify(Role.isAdminP)), ApproveApplicationApi.post);
}
