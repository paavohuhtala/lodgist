
import * as moment from "moment"

export function deTimezonify(m: moment.Moment) {
    return m.clone().utc().add(m.utcOffset(), "minutes");
}
