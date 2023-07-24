import calendar from "dayjs/plugin/calendar";
import dayjs from "dayjs";
import { parse } from "query-string";

dayjs.extend(calendar);

export const getPageNumberFromLink = (nextURL) => {
   const parsed = parse(nextURL);
   const offset = parsed.offset;
   const limit = 20;
   return Math.ceil(offset / limit);
};

export const extractDate = (dateString) => {
   return dayjs(dateString).calendar();
};

export const arrayEquality = (arr1, arr2) => {
   if (arr1.length !== arr2.length) return false;
   for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
   }
   return true;
};
