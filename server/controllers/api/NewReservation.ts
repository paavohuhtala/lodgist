
import * as moment from "moment"
import {Response} from "express"
import {RequestEx} from "../../RequestEx"
import {IController} from "../../IController"

import * as Promise from "bluebird"

import * as pgp from "pg-promise"

import {Range} from "pg-range"

import {IUserReservationRow, IExternalReservationRow,IReservationRow, ReservationType} from "../../models/Reservation"
import {IUserRow} from "../../models/User"
import {ILodgingRow} from "../../models/Lodging"

import {deTimezonify, nightsBetween, parseDateRange} from "../../DateUtils"
import {toPgRange, IMinimalRange} from "../../RangeUtils"

import {getClient} from "../../database/Connection"

import {LodgingDao} from "../../database/daos/LodgingDao"
import {ReservationDao} from "../../database/daos/ReservationDao"
import {UserReservationDao} from "../../database/daos/UserReservationDao"
import {ExternalReservationDao} from "../../database/daos/ExternalReservationDao"


// CONSIDER moving these request interfaces somewhere else

interface INewReservationRequest {
    during: IMinimalRange<string>
    lodging?: number
}

interface INewUserReservationRequest extends INewReservationRequest { }

interface INewExternalReservationRequest extends INewReservationRequest {
    reason: string
}

async function createReservation(t: pgp.IDatabase<any>, request: INewReservationRequest, lodging: ILodgingRow, type: ReservationType) : Promise<number> {
    const during = toPgRange(parseDateRange(request.during));
    
    const starts = moment.utc(lodging.reservation_start, "HH:mm:ss");
    const ends = moment.utc(lodging.reservation_end, "HH:mm:ss");
    
    during.lower = deTimezonify(moment(during.lower).hour(starts.hour()).minute(starts.minute())).toDate();
    during.upper = deTimezonify(moment(during.upper).hour(ends.hour()).minute(ends.minute())).toDate();

    const reservation : IReservationRow = {
        lodging: request.lodging,
        during: during,
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
        
        const reservationId = await createReservation(t, request, lodging, "user");

        if (reservationId == null) {
            return Promise.reject("Reservation creation failed.");
        }

        // CONSIDER moving business logic somewhere else?
        const nights = nightsBetween(parseDateRange(request.during));
        
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
        const lodging = await new LodgingDao(t).getById(request.lodging);
        
        const reservationId = await createReservation(t, request, lodging, "user");

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
        
        const reservation = <INewUserReservationRequest> req.body;
        const newReservationId = await createUserReservation(reservation, req.user);
        
        if (newReservationId == null) {
            res.sendStatus(400);
            return;
        }
        
        res.send(newReservationId.toString());
    }
}

// CONSIDER making this more DRY
export const NewExternalReservationApi : IController = {
    post: async (req: RequestEx, res: Response) => {
        if (!req.body) {
            res.sendStatus(400);
            return;
        }
        
        const reservation = <INewExternalReservationRequest> req.body;
        const newReservationId = await createExternalReservation(reservation);
        
        if (newReservationId == null) {
            res.sendStatus(400);
            return;
        }
        
        res.send(newReservationId.toString());
    }
}