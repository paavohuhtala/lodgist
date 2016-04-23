
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"

import * as Promise from "bluebird"

import * as pgp from "pg-promise"

import {IUserReservationRow, IExternalReservationRow,IReservationRow, ReservationType} from "../../models/Reservation"
import {IUserRow} from "../../models/User"

import {getClient} from "../../database/Connection"

import {LodgingDao} from "../../database/daos/LodgingDao"
import {ReservationDao} from "../../database/daos/ReservationDao"
import {UserReservationDao} from "../../database/daos/UserReservationDao"
import {ExternalReservationDao} from "../../database/daos/ExternalReservationDao"

// CONSIDER moving these request interfacs somewhere else
interface INewReservationRequest {
    during: PgRange.Range<Date>
    lodging?: number
}

interface INewUserReservationRequest extends INewReservationRequest { }

interface INewExternalReservationRequest extends INewReservationRequest {
    reason: string
}

async function createReservation(t: pgp.IDatabase<any>, request: INewReservationRequest, type: ReservationType) : Promise<number> {
    const reservation : IReservationRow = {
        lodging: request.lodging,
        during: request.during,
        type: type
    }

    return await new ReservationDao(t).insert(reservation);
} 

async function createUserReservation(request: INewUserReservationRequest, customer: IUserRow) : Promise<number> {
    return getClient().tx(async (t: pgp.IDatabase<any>) => {
        const lodging = await new LodgingDao(t).getById(request.lodging);
        
        if (lodging == null) {
            return Promise.reject(`Lodging ${request.lodging} doesn't exist.`);
        }
        
        const reservationId = await createReservation(t, request, "user");

        if (reservationId == null) {
            return Promise.reject("Reservation creation failed.");
        }

        // CONSIDER moving business logic somewhere else?
        const nights = moment(request.during.upper).startOf("day").diff(
                       moment(request.during.lower).startOf("day"), "days");
        
        const totalPrice = nights * lodging.price_per_night;     
                
        const userReservation: IUserReservationRow = {
            customer: customer.id,
            price: totalPrice,
            reservation: reservationId,
            is_paid: false
        }

        return new UserReservationDao(t).insert(userReservation);
    });
}

async function createExternalReservation(request: INewExternalReservationRequest) : Promise<number> {
    return getClient().tx(async (t: pgp.IDatabase<any>) => {
        const reservationId = await createReservation(t, request, "user");

        // CONSIDER somehow sharing this check with the method above 
        if (reservationId == null) {
            return Promise.reject("Reservation creation failed.");
        }
        
        const externalReservation: IExternalReservationRow = {
            reservation: reservationId,
            reason: request.reason
        }
        
        return new ExternalReservationDao(t).insert(externalReservation);
    });
}

export const NewUserReservationApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        if (!req.body) {
            res.sendStatus(400);
            return;
        }
        
        const lodgingId = parseInt(req.params.id);
        
        const reservation = <INewUserReservationRequest> req.body;
        reservation.lodging = lodgingId;
        
        const newReservationId = await createUserReservation(reservation, req.user);
        
        if (newReservationId == null) {
            res.sendStatus(400);
            return;
        }
        
        res.send(200, newReservationId.toString());
    }
}

// CONSIDER making this more DRY
export const NewExternalReservationApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        if (!req.body) {
            res.sendStatus(400);
            return;
        }
        
        const lodgingId = parseInt(req.params.id);
        
        const reservation = <INewExternalReservationRequest> req.body;
        reservation.lodging = lodgingId;
        
        const newReservationId = await createExternalReservation(reservation);
        
        if (newReservationId == null) {
            res.sendStatus(400);
            return;
        }
        
        res.send(200, newReservationId.toString());
    }
}