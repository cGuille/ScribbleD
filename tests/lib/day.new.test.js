import assert from 'assert';
import Day from '../../docs/lib/day.js';

export default function () {
    assert(new Day(2019, 8, 14) instanceof Day, 'day can be constructed with year, month and day');
}
