import Day from '/lib/day.js';

const scribbler = document.querySelector('#scribbler');
const scribbleDateInput = document.querySelector('#scribble-date');
const today = Day.today();
const todaysKey = scribbleKey(today);

loadScribbleFor(today, { init: true });

scribbleDateInput.value = today.format({ separator: '-' });
scribbleDateInput.max = scribbleDateInput.value;

scribbler.addEventListener('keyup', debounce(800, function saveScribblerOnChange() {
    if (scribbler.hasAttribute('readonly')) {
        return;
    }

    const content = scribbler.value.trim();
    if (!content) {
        localStorage.removeItem(todaysKey);
        return;
    }

    const scribble = { content: content };
    const record = JSON.stringify(scribble);

    localStorage.setItem(todaysKey, record);
}));

scribbler.focus();

scribbleDateInput.addEventListener('change', () => {
    if (!scribbleDateInput.valueAsDate) {
        return;
    }

    const selectedDay = Day.fromDate(scribbleDateInput.valueAsDate);
    const selectedToday = selectedDay.equals(today);
    loadScribbleFor(selectedDay, { readOnly: !selectedToday });
});

function loadScribbleFor(day, options = {}) {
    const key = scribbleKey(day);
    const record = localStorage.getItem(key);

    if (record === null) {
        if (options.init) {
            return;
        }

        scribbler.value = 'No scribble this day…';
        scribbler.setAttribute('readonly', true);

        return;
    }

    const scribble = JSON.parse(record);

    if (options.readOnly) {
        scribbler.setAttribute('readonly', true);
    } else {
        scribbler.removeAttribute('readonly');
    }

    scribbler.value = scribble.content;
}

function scribbleKey(day) {
    return `scribble_of_${day.format({ separator: '_' })}`;
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
