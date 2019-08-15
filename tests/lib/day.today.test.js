import assert from 'assert';
import Day from '../../docs/lib/day.js';

export default function () {
    const date = new Date;
    const today = Day.today();

    assert.strictEqual(today.year, date.getFullYear(), "today's year is the full year of today's Date");
    assert.strictEqual(today.month, date.getMonth() + 1, "today's month corresponds to the month of today's Date");
    assert.strictEqual(today.day, date.getDate(), "today's day is the date of today's Date");
}
