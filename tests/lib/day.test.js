import assert from 'assert';
import Day from '../../docs/lib/day.js';

export {
    testFromDate,
    testToday,
    testFormat,
    testEquals,
    testToDate,
    testValueOf,
};

testFromDate.description = 'Day.fromDate() works';
function testFromDate() {
    const date = new Date('2019-08-15');
    const day = Day.fromDate(date);

    assert.strictEqual(day.year, 2019, "the year is extracted from the date");
    assert.strictEqual(day.month, 8, "the month is extracted from the date");
    assert.strictEqual(day.day, 15, "the day is extracted from the date");
}

testToday.description = 'Day.today() works';
function testToday() {
    const date = new Date;
    const today = Day.today();

    assert.strictEqual(today.year, date.getFullYear(), "today's year is the full year of today's Date");
    assert.strictEqual(today.month, date.getMonth() + 1, "today's month corresponds to the month of today's Date");
    assert.strictEqual(today.day, date.getDate(), "today's day is the date of today's Date");
}

testFormat.description = 'day.format() works';
function testFormat() {
    let day;

    day = new Day(2019, 11, 23);
    assert.strictEqual(day.format({ separator: '-' }), '2019-11-23', "day formatting can use '-' as a separator");
    assert.strictEqual(day.format({ separator: '_' }), '2019_11_23', "day formatting can use '_' as a separator");

    day = new Day(2019, 8, 1);
    assert.strictEqual(day.format({ separator: '-' }), '2019-08-01', "day formatting ensures months and days are two digits");
}

testEquals.description = 'day.equals() works';
function testEquals() {
    const day1 = new Day(2019, 8, 1);
    const day2 = Day.fromDate(new Date('2019-08-01'));
    const day3 = new Day(2019, 8, 2);

    assert(day1.equals(day2), "two instances of the same day are equal");
    assert(!day2.equals(day3), "two instances of different days are not equal");
}

testToDate.description = 'day.toDate() works';
function testToDate() {
    const day = new Day(2019, 8, 1);
    const date = new Date('2019-08-01');

    assert.notStrictEqual(day.toDate(), date, "the conversion of a day to a date works");
}

testValueOf.description = 'day.valueOf() works';
function testValueOf() {
    const day = new Day(2019, 8, 1);

    assert.strictEqual(day.valueOf(), day.toDate().valueOf(), "the valueOf a Day is the same as its Date counterpart");
}
