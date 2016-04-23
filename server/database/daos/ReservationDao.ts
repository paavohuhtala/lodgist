
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {getClient} from "../Connection"
import {IReservationRow, Reservation} from "../../models/Reservation"

export class ReservationDao extends BaseDao<IReservationRow, number> {

    protected getColumns() {
        return Reservation.columns;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("Reservations", "id", connection);
    }
}