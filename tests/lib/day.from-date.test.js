import assert from 'assert';
import Day from '../../docs/lib/day.js';

export default function () {
    const date = new Date('2019-08-15');
    const day = Day.fromDate(date);

    assert.strictEqual(day.year, 2019, "the year is extracted from the date");
    assert.strictEqual(day.month, 8, "the month is extracted from the date");
    assert.strictEqual(day.day, 15, "the day is extracted from the date");
}
