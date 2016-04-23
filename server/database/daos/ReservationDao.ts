
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {getClient} from "../Connection"
import {IReservationRow, Reservation} from "../../models/Reservation"
import {IUserRow} from "../../models/User"

export class ReservationDao extends BaseDao<IReservationRow, number> {

    protected getColumns() {
        return Reservation.rowMembers;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("Reservations", "id", connection);
    }
}