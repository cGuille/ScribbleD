export default class Day {
    static today() {
        return this.fromDate(new Date);
    }

    static fromDate(date) {
        return new this(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        );
    }

    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    format(options) {
        const year = this.year.toString();
        const month = zeroXLeftPad(this.month.toString());
        const day = zeroXLeftPad(this.day.toString());

        return `${year}${options.separator}${month}${options.separator}${day}`;
    }

    equals(otherDay) {
        return this.valueOf() === otherDay.valueOf();
    }

    toDate() {
        return new Date(this.format({ separator: '-' }));
    }

    valueOf() {
        return this.toDate().valueOf();
    }
}

function zeroXLeftPad(str) {
    if (str.length < 1 || str.length > 2) {
        throw new Error(`Unexpected length for '${str}'`);
    }

    return str.length == 1 ? `0${str}` : str;
}
