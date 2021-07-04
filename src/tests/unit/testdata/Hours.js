
export const HOURS_DATA = [
  {
    day: "MONDAY",
    intervals: [
      {
        end: 1800,
        start: 1000
      }
    ],
    isClosed: false
  },
  {
    day: "TUESDAY",
    intervals: [
      {
        end: 1800,
        start: 1000
      }
    ],
    isClosed: false
  },
  {
    day: "WEDNESDAY",
    intervals: [
      {
        end: 1800,
        start: 1000
      }
    ],
    isClosed: false
  },
  {
    day: "THURSDAY",
    intervals: [
      {
        end: 1800,
        start: 1000
      }
    ],
    isClosed: false
  },
  {
    day: "FRIDAY",
    intervals: [
      {
        end: 1800,
        start: 1000
      }
    ],
    isClosed: false
  },
  {
    day: "SATURDAY",
    intervals: [
      {
        end: 0,
        start: 0
      }
    ],
    isClosed: false
  },
  {
    day: "SUNDAY",
    intervals: [],
    isClosed: true
  }
];

export const UTC_OFFSETS = [
  {
    offset: 7200,
    start: 1553994000
  },
  {
    offset: 3600,
    start: 1572138000
  },
  {
    offset: 7200,
    start: 1585443600
  }
];

export const PROFILE = {
  meta: {
    utcOffsets: UTC_OFFSETS
  }
};

export const DAYS_OF_WEEK = {
  'MONDAY': 'Monday',
  'TUESDAY': "Tuesday",
  'WEDNESDAY': "Wednesday",
  'THURSDAY': "Thursday",
  'FRIDAY': "Friday",
  'SATURDAY': "Saturday",
  'SUNDAY': "Sunday"
};

export const DAYS_OF_WEEK_CUSTOM = {
  'MONDAY': 'Mon',
  'TUESDAY': "Tue",
  'WEDNESDAY': "Wed",
  'THURSDAY': "Thur",
  'FRIDAY': "Fri",
  'SATURDAY': "Sat",
  'SUNDAY': "Sun"
};