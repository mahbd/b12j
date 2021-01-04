import moment from "moment";
import {parse} from "query-string";

export const getPageNumberFromLink = (nextURL) => {
    const parsed = parse(nextURL);
    const offset = parsed.offset
    const limit = 20
    return Math.ceil(offset / limit)
}

export const extractDate = (dateString) => {
    const dateObj = new Date(dateString);
    return moment(dateObj).format("D MMM YY:::H:m")
}