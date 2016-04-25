
import * as moment from "moment"
import {IMinimalRange, isDateRange, map} from "./RangeUtils"

export function deTimezonify(m: moment.Moment) {
    return m.clone().utc().add(m.utcOffset(), "minutes");
}

export function isMoment(x: any): x is moment.Moment {
    return moment.isMoment(x);
}

export function nightsBetween(range: IMinimalRange<Date>) : number
export function nightsBetween(a: Date, b: Date) : number
export function nightsBetween(a: moment.Moment, b: moment.Moment) : number
export function nightsBetween(a: IMinimalRange<Date> | Date | moment.Moment, b?: Date | moment.Moment) : number {
    let start: moment.Moment;
    let end: moment.Moment;

    if (isMoment(a) && isMoment(b)) {
        start = a;
        end = b;
    } else if (a instanceof Date && b instanceof Date) {
        start = moment(a);
        end = moment(b);
    } else if (isDateRange(a)) {
        start = moment(a.lower);
        end = moment(a.upper);
    } else {
        throw `Illegal arguments to nightsBetween: ${a}, ${b}` 
    }
    
    return end.startOf("day").diff(start.startOf("day"), "days");
}

export function parseDateRange(range: IMinimalRange<string>) {
    return map(range, (s) => new Date(s));
}

