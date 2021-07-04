const { UnitTest } = require("./Util/UnitTest");
const { HOURS_DATA, UTC_OFFSETS, PROFILE, DAYS_OF_WEEK, DAYS_OF_WEEK_CUSTOM } = require("./testdata/Hours");
const assert = require("assert");

const HoursTests = [];

HoursTests.push(
  new UnitTest
    .Builder("HoursData")
    .withDescription("Tests HoursData template")
    .withTemplate("components.Hours.Hours_data")
    .withTestData({
      hours: HOURS_DATA,
      utcOffsets: UTC_OFFSETS,
      twentyFourHourClock: true
    })
    .withAssertions(document => {
      const content = document.querySelector('body').innerHTML;
      assert(content.includes(`data-days='${JSON.stringify(HOURS_DATA)}'`));
      assert(content.includes(`data-utc-offsets='${JSON.stringify(UTC_OFFSETS)}'`));
      assert(content.includes(`data-twenty-four-hour-clock="true"`));
    })
    .build()
);

HoursTests.push(
  new UnitTest
    .Builder("open_today")
    .withDescription("Tests open_today template with a custom message")
    .withTemplate("components.Hours.Hours_openToday")
    .withTestData({
      openTodayMessage: "Test 123abc"
    })
    .withAssertions(document => {
      const content = document.querySelector('.c-hours-details-opentoday').innerHTML;
      assert.equal(content, "Test 123abc");
    })
    .build()
);

HoursTests.push(
  new UnitTest
    .Builder("open_today")
    .withDescription("Tests open_today template with no custom message")
    .withTemplate("components.Hours.Hours_openToday")
    .withTestData({})
    .withAssertions(document => {
      const content = document.querySelector('.c-hours-details-opentoday').innerHTML;
      assert.equal(content, "Open Today");
    })
    .build()
);

Object.keys(DAYS_OF_WEEK).forEach((day, i) => {
  HoursTests.push(
    new UnitTest
      .Builder("localize_day_of_week")
      .withDescription("Tests localize_day_of_week for day: " + day)
      .withTemplate("components.Hours.Helpers_localizeDayOfWeek")
      .withTestData({
        dayOfWeek: day
      })
      .withAssertions(document => {
        const content = document.querySelector('body').innerHTML;
        assert.equal(content.trim(), DAYS_OF_WEEK[day])
      })
      .build()
  );
});

Object.keys(DAYS_OF_WEEK_CUSTOM).forEach(day => {
  HoursTests.push(
    new UnitTest
      .Builder("localize_day_of_week")
      .withDescription("Tests localize_day_of_week with custom map for day: " + day)
      .withTemplate("components.Hours.Helpers_localizeDayOfWeek")
      .withTestData({
        dayOfWeek: day,
        dayOfWeekMap: DAYS_OF_WEEK_CUSTOM
      })
      .withAssertions(document => {
        const content = document.querySelector('body').innerHTML;
        assert.equal(content.trim(), DAYS_OF_WEEK_CUSTOM[day])
      })
      .build()
  );
});

HoursTests.push(
  new UnitTest
    .Builder("interval")
    .withDescription("Tests interval with 24 hour interval")
    .withTemplate("components.Hours.Interval")
    .withTestData({
      start: 0,
      end: 2359,
      parentClass: 'c-hours-today-day-hours'
    })
    .withAssertions(document => {
      const content = document.querySelector('.c-hours-today-day-hours-intervals-instance').innerHTML;
      assert.equal(content.trim(), "Open 24 Hours")
    })
    .build()
);

HoursTests.push(
  new UnitTest
    .Builder("interval")
    .withDescription("Tests interval with 24 hour interval with custom message")
    .withTemplate("components.Hours.Interval")
    .withTestData({
      start: 0,
      end: 2359,
      allDayMessage: 'Open all day!!',
      parentClass: 'c-hours-today-day-hours'
    })
    .withAssertions(document => {
      const content = document.querySelector('.c-hours-today-day-hours-intervals-instance').innerHTML;
      assert.equal(content.trim(), "Open all day!!")
    })
    .build()
);

HoursTests.push(
  new UnitTest
    .Builder("interval")
    .withDescription("Tests interval with 24 hour clock")
    .withTemplate("components.Hours.Interval")
    .withTestData({
      start: 900,
      end: 1700,
      parentClass: 'c-hours-today-day-hours',
      twentyFourHourClock: true
    })
    .withAssertions(document => {
      const start = document.querySelector('.c-hours-today-day-hours-intervals-instance-open').innerHTML;
      const separator = document.querySelector('.c-hours-today-day-hours-intervals-instance-separator').innerHTML;
      const end = document.querySelector('.c-hours-today-day-hours-intervals-instance-close').innerHTML;
      assert.equal(start.trim(), "09:00");
      assert.equal(separator.trim(), "-");
      assert.equal(end.trim(), "17:00");
    })
    .build()
);

HoursTests.push(
  new UnitTest
    .Builder("interval")
    .withDescription("Tests interval with 12 hour clock")
    .withTemplate("components.Hours.Interval")
    .withTestData({
      start: 900,
      end: 1700,
      parentClass: 'c-hours-today-day-hours'
    })
    .withAssertions(document => {
      const start = document.querySelector('.c-hours-today-day-hours-intervals-instance-open').innerHTML;
      const separator = document.querySelector('.c-hours-today-day-hours-intervals-instance-separator').innerHTML;
      const end = document.querySelector('.c-hours-today-day-hours-intervals-instance-close').innerHTML;
      assert.equal(start.trim(), "9:00 AM");
      assert.equal(separator.trim(), "-");
      assert.equal(end.trim(), "5:00 PM");
    })
    .build()
);

HoursTests.push(
  new UnitTest
    .Builder("interval")
    .withDescription("Tests interval with 12 hour clock & custom message")
    .withTemplate("components.Hours.Interval")
    .withTestData({
      start: 900,
      end: 1700,
      opensAtMessage: "Opens at custom",
      parentClass: 'c-hours-today-day-hours'
    })
    .withAssertions(document => {
      const start = document.querySelector('.c-hours-today-day-hours-intervals-instance-open').innerHTML;
      assert.equal(start.trim(), "Opens at custom 9:00 AM");
    })
    .build()
);

HoursTests.push(
  new UnitTest
    .Builder("HoursToday_intervals")
    .withDescription("Tests HoursToday_interval")
    .withTemplate("components.Hours.HoursToday_intervals")
    .withTestData({
      dayHours: [
        {
          start: 600,
          end: 1000
        },
        {
          start: 1100,
          end: 1700
        }
      ]
    })
    .withAssertions(document => {
      const intervals = document.querySelectorAll('.c-hours-today-day-hours-intervals-instance');
      assert.equal(intervals.length, 2);

      const start1 = intervals[0].querySelector('.c-hours-today-day-hours-intervals-instance-open').innerHTML;
      const end1 = intervals[0].querySelector('.c-hours-today-day-hours-intervals-instance-close').innerHTML;
      assert.equal(start1.trim(), "6:00 AM");
      assert.equal(end1.trim(), "10:00 AM");

      const start2 = intervals[1].querySelector('.c-hours-today-day-hours-intervals-instance-open').innerHTML;
      const end2 = intervals[1].querySelector('.c-hours-today-day-hours-intervals-instance-close').innerHTML;
      assert.equal(start2.trim(), "11:00 AM");
      assert.equal(end2.trim(), "5:00 PM");
    })
    .build()
);

HoursTests.push(
  new UnitTest
    .Builder("HoursToday")
    .withDescription("Tests HoursToday")
    .withTemplate("components.Hours.HoursToday")
    .withTestData({
      hours: HOURS_DATA,
      profile: PROFILE
    })
    .withAssertions(document => {
      const rootDiv = document.querySelector('.c-hours-today');
      assert(rootDiv);
      assert(rootDiv.getAttribute('data-days'));
      assert(rootDiv.getAttribute('data-utc-offsets'));

      const dayRows = document.querySelectorAll('.c-hours-today-details-row');
      assert.equal(dayRows.length, 7);

      const sundayStatusMessage = dayRows[6].querySelector('.c-hours-today-day-status').innerHTML;
      assert.equal(sundayStatusMessage.trim(), 'Closed Today');
    })
    .build()
);

HoursTests.push(
  new UnitTest
    .Builder("Hours")
    .withDescription("Tests Hours")
    .withTemplate("components.Hours.Hours")
    .withTestData({
      hours: HOURS_DATA,
      profile: PROFILE,
      title: "Test title!!",
      hLevel: 5,
      additionalHoursText: "Test add. text!?$",
      showOpenToday: true
    })
    .withAssertions(document => {
      const rootDiv = document.querySelector('.c-hours');
      assert(rootDiv);

      const title = rootDiv.querySelector('.c-hours-title');
      assert.equal(title.innerHTML.trim(), "Test title!!")
      assert.equal(title.tagName, "H5");

      const hoursTable = rootDiv.querySelector('.c-hours-details-wrapper');
      assert(hoursTable);

      const openToday = rootDiv.querySelector('.c-hours-details-opentoday');
      assert(openToday);

      const additText = rootDiv.querySelector('.c-hours-additional-text');
      assert.equal(additText.innerHTML.trim(), 'Test add. text!?$')
    })
    .build()
);

HoursTests.push(
  new UnitTest
    .Builder("HoursTable")
    .withDescription("Tests HoursTable")
    .withTemplate("components.Hours.HoursTable")
    .withTestData({
      hours: HOURS_DATA,
      utcOffsets: UTC_OFFSETS
    })
    .withAssertions(document => {
      const rootDiv = document.querySelector('.c-hours-details-wrapper');
      assert(rootDiv);

      const configData = rootDiv.querySelector('.js-hours-config').innerHTML;
      assert(configData.includes(JSON.stringify(HOURS_DATA)));
      assert(configData.includes(JSON.stringify(UTC_OFFSETS)));

      const configJson = JSON.parse(configData);
      assert(Object.keys(configJson).length, 13);
    })
    .build()
);

HoursTests.push(
  new UnitTest
    .Builder("HoursTable_wrapper")
    .withDescription("Tests HoursTable_wrapper")
    .withTemplate("components.Hours.HoursTable_wrapper")
    .withTestData({
      hours: HOURS_DATA,
      profile: PROFILE
    })
    .withAssertions(document => {
      const rootDiv = document.querySelector('.c-hours-details-wrapper');
      assert(rootDiv);

      const configData = rootDiv.querySelector('.js-hours-config').innerHTML;
      assert(configData.includes(JSON.stringify(HOURS_DATA)));
      assert(configData.includes(JSON.stringify(UTC_OFFSETS)));

      const configJson = JSON.parse(configData);
      assert(Object.keys(configJson).length, 13);
    })
    .build()
);

module.exports = {
  HoursTests
};
