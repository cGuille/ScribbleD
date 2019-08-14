'use strict';

const scribbler = document.querySelector('#scribbler');
const scribbleDateDisplay = document.querySelector('#scribble-date');
const today = dateParts(new Date);
const todaysKey = scribbleKey(today);
const todaysRecord = localStorage.getItem(todaysKey);

scribbleDateDisplay.textContent = `${today.year}-${today.month}-${today.day}`;

if (todaysRecord !== null) {
    const scribble = JSON.parse(todaysRecord);
    scribbler.value = scribble.content || scribble.innerText;
}

scribbler.addEventListener('keyup', debounce(800, function saveScribblerOnChange() {
    const scribble = { content: scribbler.value.trim() };
    const record = JSON.stringify(scribble);

    localStorage.setItem(todaysKey, record);
}));

scribbler.focus();

function scribbleKey(dateParts) {
    return `scribble_of_${dateParts.year}_${dateParts.month}_${dateParts.day}`;
}

function dateParts(date) {
    let year = date.getFullYear().toString();

    let month = (date.getMonth() + 1).toString();
    if (month.length === 1) {
        month = '0' + month;
    }

    let day = date.getDate().toString();

    return { year: year, month: month, day: day };
}

function debounce(delay, fn) {
    let timeoutId = null;

    return function debouncedFn() {
        const fnContext = this;
        const fnArgs = Array.from(arguments);

        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(function () {
            timeoutId = null;
            fn.apply(fnContext, fnArgs);
        }, delay);
    };
}
