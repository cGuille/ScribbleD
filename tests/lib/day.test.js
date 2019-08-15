import assert from 'assert';
import Day from '../../docs/lib/day.js';

export {
    testFromDate,
    testToday,
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
