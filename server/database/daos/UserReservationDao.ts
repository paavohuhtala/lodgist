
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {getClient} from "../Connection"
import {IUserReservationRow, UserReservation} from "../../models/Reservation"

export class UserReservationDao extends BaseDao<IUserReservationRow, number> {

    protected getColumns() {
        return UserReservation.columns;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("UserReservations", "id", connection);
    }
}