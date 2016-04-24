
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {getClient} from "../Connection"
import {IExternalReservationRow, ExternalReservation} from "../../models/Reservation"

export class ExternalReservationDao extends BaseDao<IExternalReservationRow, number> {

    protected getColumns() {
        return ExternalReservation.columns;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("ExternalReservations", "reservation", connection);
    }
}