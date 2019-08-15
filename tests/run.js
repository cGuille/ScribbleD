import { AssertionError, fail } from 'assert';
import { exit } from 'process';
import url from 'url';
import { dirname } from 'path';
import glob from 'glob-promise';
import chalk from 'chalk';

class Report {
    static success(suite) {
        return new this(suite);
    }

    static uncaughtError(suite, error) {
        const report = new this(suite);
        report.uncaughtError = error;
        return report;
    }

    static assertionFailure(suite, assertion) {
        const report = new this(suite);
        report.assertionFailed = assertion;
        return report;
    }

    constructor(suite) {
        this.suite = suite;
        this.uncaughtError = null;
        this.assertionFailed = null;
    }

    isSuccess() {
        return !this.isAssertionFailure() && !this.isUncaughtErrorFailure();
    }

    isAssertionFailure() {
        return this.assertionFailed !== null;
    }

    isUncaughtErrorFailure() {
        return this.uncaughtError !== null;
    }
}

async function runner(reporter) {
    const runnerUrl = url.parse(import.meta.url);
    const suites = await glob('./**/*.test.*', { cwd: dirname(runnerUrl.path) });
    const reports = await Promise.all(suites.map(runSuite));
    const passed = reports.every(report => report.isSuccess());

    reporter(reports);

    exit(passed ? 0 : 1);
}

function cliReporter(reports) {
    const titleStyle = chalk.underline.blue;
    const successStyle = chalk.bold.green;
    const failureStyle = chalk.bold.red;

    console.log('');
    console.log(titleStyle(`Tests report from ${reports.length} suites:`));
    console.log('');

    reports.forEach(report => {
        if (report.isSuccess()) {
            console.log(successStyle(`PASS ${report.suite}`));
            return;
        }

        console.log('');
        console.log(failureStyle(`FAIL ${report.suite}:`));
        console.log('');
        if (report.isUncaughtErrorFailure()) {
            console.log(`Uncaught error of type ${report.uncaughtError.name}:`);
            console.log(chalk.underline('Message:'), report.uncaughtError.message);
            console.log(chalk.underline('Code:'), report.uncaughtError.code);
            console.log(chalk.underline('Stack trace:'), report.uncaughtError.stack);
        } else if (report.isAssertionFailure()) {
            console.log(`Failed to assert that ${report.assertionFailed.message}:`);
            console.log(chalk.underline('Assertion type:'), report.assertionFailed.operator);
            console.log(chalk.underline('Expected:'), report.assertionFailed.expected);
            console.log(chalk.underline('Actual:'), report.assertionFailed.actual);
        } else {
            throw new Error('Unknown failure type');
        }
        console.log('');
        console.log('');
    });
}

runner(cliReporter);

async function runSuite(suitePath) {
    const { default: suite } = await import(suitePath);

    try {
        suite();
    } catch (error) {
        if (!(error instanceof AssertionError)) {
            return Report.uncaughtError(suitePath, error);
        } else {
            return Report.assertionFailure(suitePath, error);
        }
    }

    return Report.success(suitePath);
}
