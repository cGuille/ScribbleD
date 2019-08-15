import { AssertionError, fail } from 'assert';
import { exit } from 'process';
import url from 'url';
import { dirname } from 'path';
import glob from 'glob-promise';
import chalk from 'chalk';

class SuiteReport {
    constructor(suitePath) {
        this.suitePath = suitePath;
        this.testCaseReports = [];
    }

    isSuccess() {
        return this.testCaseReports.every(report => report.isSuccess());
    }

    addTestCaseReports(testCaseReports) {
        Array.prototype.push.apply(this.testCaseReports, testCaseReports);
    }
}

class TestCaseReport {
    static success(testCase) {
        return new this(testCase);
    }

    static uncaughtError(testCase, error) {
        const report = new this(testCase);
        report.uncaughtError = error;
        return report;
    }

    static assertionFailure(testCase, assertion) {
        const report = new this(testCase);
        report.assertionFailed = assertion;
        return report;
    }

    constructor(testCase) {
        this.testCase = testCase;
        this.uncaughtError = null;
        this.assertionFailed = null;
    }

    get description() {
        return this.testCase.description || this.testCase.name;
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
    const successStyle = chalk.green;
    const failureStyle = chalk.red;

    console.log(titleStyle(`Tests reports from ${reports.length} suite${reports.length > 1 ? 's' : ''}:`));

    reports.forEach(suiteReport => {
        if (suiteReport.isSuccess()) {
            console.log(successStyle(`PASS ${suiteReport.suitePath}`));
        } else {
            console.log(failureStyle(`FAIL ${suiteReport.suitePath}`));
        }

        suiteReport.testCaseReports.forEach(testCaseReport => {
            if (testCaseReport.isSuccess()) {
                console.log(successStyle(`✓ ${testCaseReport.description}`));
                return;
            }

            console.log(failureStyle(`✗ ${testCaseReport.description}:`));
            if (testCaseReport.isUncaughtErrorFailure()) {
                console.log(`Uncaught error of type ${testCaseReport.uncaughtError.name}:`);
                console.log('Message:', chalk.bold(testCaseReport.uncaughtError.message));
                console.log('Code:', chalk.bold(testCaseReport.uncaughtError.code));
                console.log('Stack trace:', chalk.bold(testCaseReport.uncaughtError.stack));
            } else if (testCaseReport.isAssertionFailure()) {
                console.log(`Failed to assert that ${chalk.bold(testCaseReport.assertionFailed.message)}:`);
                console.log('Assertion type:', chalk.bold(testCaseReport.assertionFailed.operator));
                console.log('Expected:', chalk.bold(testCaseReport.assertionFailed.expected));
                console.log('Actual:', chalk.bold(testCaseReport.assertionFailed.actual));
            } else {
                throw new Error('Unknown failure type');
            }
        });
    });
}

runner(cliReporter);

async function runSuite(suitePath) {
    const suite = await import(suitePath);
    const report = new SuiteReport(suitePath);

    report.addTestCaseReports(Object.values(suite).map(testCase => {
        try {
            testCase();
        } catch (error) {
            if (!(error instanceof AssertionError)) {
                return TestCaseReport.uncaughtError(testCase, error);
            } else {
                return TestCaseReport.assertionFailure(testCase, error);
            }
        }

        return TestCaseReport.success(testCase);
    }));

    return report;
}
