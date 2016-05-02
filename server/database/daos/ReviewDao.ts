
import * as pgp from "pg-promise"
import {BaseDao} from "../BaseDao"
import {IReviewRow, Review} from "../../models/Review"

export class ReviewDao extends BaseDao<IReviewRow, number> {
    protected getColumns() {
        return Review.columns;
    }
    
    constructor(connection?: pgp.IDatabase<any>) {
        super("Reviews", "id", connection);
    }
}
