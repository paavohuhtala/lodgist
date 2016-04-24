
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

import {getClient} from "../../database/Connection"

import {LodgingDao} from "../../database/daos/LodgingDao"
import {ReservationDao} from "../../database/daos/ReservationDao"
import {UserReservationDao} from "../../database/daos/UserReservationDao"
import {ExternalReservationDao} from "../../database/daos/ExternalReservationDao"


interface IRequestRange {
    lower: Date
    upper: Date
}

interface IDBRange<T extends PgRange.RangeType> extends PgRange.Range<T> {
    formatDBType(): string
}

function toPgRange(range: IRequestRange) {
    // HACK HACK HACK ish
    const dbRange = <IDBRange<Date>> <any> Range(range.lower, range.upper, "[]");

    // More HACK HACK HACK
    dbRange.formatDBType = function() {
        const thisr = <PgRange.Range<Date>> this;
        //return (<PgRange.Range<Date>> this).toPostgres(x => x);
        return `${thisr.bounds[0]}${thisr.lower.toISOString()},${thisr.upper.toISOString()}${thisr.bounds[1]}`;
    };
    
    return dbRange;
}

// CONSIDER moving these request interfacs somewhere else

interface INewReservationRequest {
    during: IRequestRange
    lodging?: number
}

interface INewUserReservationRequest extends INewReservationRequest { }

interface INewExternalReservationRequest extends INewReservationRequest {
    reason: string
}

async function createReservation(t: pgp.IDatabase<any>, request: INewReservationRequest, lodging: ILodgingRow, type: ReservationType) : Promise<number> {
    
    const during = toPgRange(request.during);
    
    const starts = moment(lodging.reservation_start, "HH:mm:ss");
    const ends = moment(lodging.reservation_end, "HH:mm:ss");
    
    during.lower = moment(during.lower).hour(starts.hour()).minute(starts.minute()).toDate();
    during.upper = moment(during.upper).hour(ends.hour()).minute(ends.minute()).toDate();
    
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
        
        res.status(200).send(newReservationId.toString());
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
        
        res.status(200).send(newReservationId.toString());
    }
}