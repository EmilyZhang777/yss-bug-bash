import { missing } from './utils.js';

export const sameDay = (startdate, enddate) => {
  let startDateObject = new Date(secToMillisecond(startdate));
  let endDateObject = new Date(secToMillisecond(enddate));
  if (startDateObject.getUTCFullYear() !== endDateObject.getUTCFullYear())
    return false;
  if (startDateObject.getUTCMonth() !== endDateObject.getUTCMonth())
    return false;
  if (startDateObject.getUTCDate() !== endDateObject.getUTCDate()) return false;
  return true;
};

export const sameMonth = (startdate, enddate) => {
  let startDateObject = new Date(secToMillisecond(startdate));
  let endDateObject = new Date(secToMillisecond(enddate));
  return (
    startDateObject.getUTCFullYear() === endDateObject.getUTCFullYear() &&
    startDateObject.getUTCMonth() === endDateObject.getUTCMonth()
  );
};

export const sameYear = (startdate, enddate) => {
  let startDateObject = new Date(secToMillisecond(startdate));
  let endDateObject = new Date(secToMillisecond(enddate));
  return startDateObject.getUTCFullYear() === endDateObject.getUTCFullYear();
};

export const currentYear = () => {
  return new Date().getFullYear();
};

export const ltimef = (locale, format, timestamp) => {
  // GENERATOR TODO: Implement ltimef
  missing('ltimef');
};

export const ltimestampf = (locale, format, timestamp) => {
  // GENERATOR TODO: Implement ltimestampf
  missing('ltimestampf');
};

// @format - Hour and minute format in Go time format syntax, e.g. '3:04'
// @time - Hour and minute encode into a number as hour*100 + minute.  For example, 3:04PM would be 304.
export const timef = (format, time) => {
  let date = new Date(2006, 1, 1, time / 100, time % 100);
  return timestampf(format, date.getTime());
};

// @format - Format in Go time format syntax, e.g. 'Mon Jan 2 15:04:05 -0700 MST 2006'
export const timestampf = (format, timestamp) => {
  // format = "Mon Jan 2 15:04:05 -0700 MST 2006"
  let date = new Date(timestamp);
  let year = date.getFullYear();
  let dayNumber = date.getDate();
  let dayOfWeek = date.getDay();
  let monthNumber = date.getMonth();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
  let offset = date.getTimezoneOffset();

  let weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const displayMonthNumber = monthNumber + 1;

  const replacements = [
    ['2006', year],
    ['06', year % 100],
    ['15', hour <= 9 ? '0' + hour : hour],
    ['03', `${0 < hour && hour < 10 ? 0 : ''}${((hour + 11) % 12) + 1}`],
    ['3', ((hour + 11) % 12) + 1],
    ['PM', hour >= 12 ? 'PM' : 'AM'],
    ['pm', hour >= 12 ? 'pm' : 'am'],
    ['04', min < 10 ? `0${min}` : min],
    ['05', sec < 10 ? `0${sec}` : sec],
    ['-0700', offset],
    ['January', months[monthNumber]],
    ['Jan', months[monthNumber].substring(0, 3)],
    ['01', `${displayMonthNumber < 10 ? 0 : ''}${displayMonthNumber}`],
    ['1', displayMonthNumber],
    ['02', `${dayNumber < 10 ? 0 : ''}${dayNumber}`],
    ['2', dayNumber],
    ['Monday', weekdays[dayOfWeek]],
    ['Mon', weekdays[dayOfWeek].substring(0, 3)],
    ['Mo', weekdays[dayOfWeek].substring(0, 2)]
  ];
  const replaceMap = replacements.reduce(
    (map, [key, value]) => Object.assign(map, { [key]: value }),
    {}
  );

  const re = new RegExp(replacements.map(([key]) => key).join('|'), 'g');
  const result = format.replace(re, (match) => replaceMap[match]);

  return result;
};

export const dateToTimestamp = (date) => {
  let day = date.day,
    month = date.month - 1,
    year = date.year;
  return new Date(Date.UTC(year, month, day)).setUTCHours(0) / 1000;
};

const secToMillisecond = (timestamp) => {
  return timestamp * 1000;
};
