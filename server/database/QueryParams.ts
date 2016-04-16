
import * as _ from "lodash"

export interface IQuerySettings {
    limit?: number
    offset?: number
}

export module QuerySettings {
    export function getDefault(): IQuerySettings {
        return {
            limit: 30,
            offset: 0
        }
    }

    export function validate(params: IQuerySettings) {
        if (params == null || params == undefined) {
            return getDefault();
        }
        
        return _.merge(getDefault(), params);
    }
}
