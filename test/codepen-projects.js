/*
 * Automates testing of all of the testable projects on CodePen.
 *
 * This file is just the Mocha related part of the tests. All the browser
 * automation takes place in the automatedTestUtils.js file.
 *
 * To run all the tests, from the command line:
 *   node_modules/mocha/bin/mocha src/project-tests/all-tests.js
 *
 * To run one test or some tests, you can use the grep flag of Mocha. The
 * following will run only the tests with "D3" in the name. Note the names
 * come from the array of tests below in the code.
 *   node_modules/mocha/bin/mocha -g 'D3' src/project-tests/all-tests.js
 *
 */

// Mocha or Selenium is creating more than the max default of 10 events
// emitters, so we increase the default max here.
require('events').EventEmitter.defaultMaxListeners = 20;

var automate = require('./automate/automate-utils'),
  doesProjectPassTests = automate.doesProjectPassTests;

var chai = require('chai'),
    assert = chai.assert;

// Selenium wrapper for Mocha testing. You can also add the following if
// needed: after, afterEach, before, beforeEach, and xit.
var seleniumMocha = require('selenium-webdriver/testing'),
    describe = seleniumMocha.describe,
    it = seleniumMocha.it;

describe('CodePen Page Tests', function() {

  var tests = [
    {
      name: 'D3 Tree Map',
      URL: 'https://codepen.io/freeCodeCamp/pen/KaNGNR'
    },
    {
      name: 'Product Landing Page',
      URL: 'https://codepen.io/freeCodeCamp/pen/RKRbwL'
    },
    { name: 'Personal Portfolio',
      URL: 'https://codepen.io/freeCodeCamp/pen/zNBOYG'
    },
    {
      name: 'Technical Documentation',
      URL: 'https://codepen.io/freeCodeCamp/pen/NdrKKL'
    },
    {
      name: 'React Pomodoro Clock',
      URL: 'https://codepen.io/freeCodeCamp/pen/XpKrrW'
    },
    {
      name: 'Javascript Calculator',
      URL: 'https://codepen.io/freeCodeCamp/pen/wgGVVX'
    },
    {
      name: 'Markdown Previewer',
      URL: 'https://codepen.io/freeCodeCamp/pen/GrZVVO'
    },
    {
      name: 'Drum Machine',
      URL: 'https://codepen.io/freeCodeCamp/pen/MJyNMd'
    },
    {
      name: 'Tribute Page', URL:
      'https://codepen.io/freeCodeCamp/pen/zNqgVx'
    },
    {
      name: 'D3 Scatter Plot',
      URL: 'https://codepen.io/freeCodeCamp/pen/bgpXyK'
    },
    {
      name: 'D3 Bar Chart',
      URL: 'https://codepen.io/freeCodeCamp/pen/GrZVaM'
    },
    {
      name: 'Random Quote Machine',
      URL: 'https://codepen.io/freeCodeCamp/pen/qRZeGZ'
    },
    {
      name: 'D3 Choropleth Map',
      URL: 'https://codepen.io/freeCodeCamp/pen/EZKqza'
    },
    {
      name: 'Survey Form', URL:
      'https://codepen.io/freeCodeCamp/pen/VPaoNP'
    },
    {
      name: 'D3 Heat Map', URL:
      'https://codepen.io/freeCodeCamp/pen/JEXgeY'
    }
  ];

  // Mocha timeout. Two minutes should be enough for every page we test.
  this.timeout(120000);

  tests.forEach(function(test) {
    it(
      `CodePen "${test.name}" at URL ${test.URL} should pass all tests`,
      function(done) {

      doesProjectPassTests(test.name, test.URL)
      .then(function(success) {
        assert.isOk(
          success,
          `CodePen "${test.name}" did not pass all tests. See screenshot for` +
          'more details.'
        );
        done();
      });
    });
  });
});
