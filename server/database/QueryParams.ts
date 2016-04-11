
import * as _ from "lodash"

export interface IQueryParams {
    limit?: number
    offset?: number
}

export module QueryParams {
    export function getDefault(): IQueryParams {
        return {
            limit: 30,
            offset: 0
        }
    }

    export function validate(params: IQueryParams) {
        if (params == null || params == undefined) {
            return getDefault();
        }
        
        return _.merge(getDefault, params);
    }
}
