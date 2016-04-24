
import * as moment from "moment"

export function deUtcify(m: moment.Moment) {
    return m.clone().utc().add(m.utcOffset(), "minutes");
}
