'use strict';
/* eslint-disable */

const fs = require('fs');
const MultiReporter = require('testem-multi-reporter');
const GitLabReporter = require('testem-gitlab-reporter');
const TAPReporter = require('testem/lib/reporters/tap_reporter');

let reporter = new MultiReporter({
  reporters: [
    {
      ReporterClass: TAPReporter,
      args: [false, null, { get: () => false }],
    },
    {
      ReporterClass: GitLabReporter,
      args: [false, fs.createWriteStream('junit.xml'), { get: () => false }],
    },
  ],
});

module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  browser_start_timeout: 120,
  parallel: 8,
  browser_args: {
    Chrome: {
      ci: [
        '--no-sandbox',
        '--disable-gpu',
        '--headless',
        '--remote-debugging-port=0',
        '--window-size=1440,900',
      ].filter(Boolean),
    },
  },
  tap_quiet_logs: true,
  reporter,
};
