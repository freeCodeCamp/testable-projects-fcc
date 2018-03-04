/* global projectName */

/*
 This file dynamically generates the user interface for the freeCodeCamp
 testable-projects application. The user interface consists of three main parts:
 1. fCCTestTogglerSkeleton
    A user interface for hiding / showing the test controls:
    a. A toggler for hiding / showing the test controller iframe
       (#fcc_foldout_toggler)
    b. A small read-only indicator in the top-right corner of the viewport that
       shows the pending test project (#fcc_test_suite_indicator_wrapper)
 2. fCCTestSuiteSkeleton
    An <iframe> situated in the top-left corner of the viewport with controls
    for running the tests (loaded into document at
    fCCTestTogglerSkeleton > iframe#fcc_foldout_menu)
 3. mochaModalSkeleton
    A modal <div id="mocha"> automatically inserted into the document via Mocha

 The test controller window runs in an iframe in order to encapsulate the DOM
 elements and avoid interfering with student project code.
 Since Mocha cannot automatically insert its <div id="mocha"> into the iframe,
 we need to append it and load its styles separately.
 The toggler is appended separately from the iframe since the whole iframe
 slides out of view on toggle.

 We can use Webpack to inject loaded css into the document, but we append a
 <style> element with a string of css loaded (not injected) by Webpack via
 jQuery in the iframe. Therefore, we maintain three css files:
 one for the test control window (fcc-test-ui.css), one for the toggler
 (fcc-test-toggler.css), and one for the Mocha modal (mocha-modal.css)
*/

import $ from 'jquery';
import chai from 'chai';
// Webpack is configured to load those files with the .html extension as Strings
import fCCTestSuiteSkeleton from './utils/fcc-test-suite-skeleton.html';
import fCCTestTogglerSkeleton from './utils/fcc-test-toggler-skeleton.html';
import mochaModalSkeleton from './utils/mocha-modal-skeleton.html';
// Test window-specific css loaded by css-loader through webpack config only.
import fCCTestUIStyles from './stylesheets/fcc-test-ui.css';
// style-loader injects css from css-loader into document
// Using inline loading of style-loader in order to only inject modal css
/* eslint import/no-unresolved: [2, { ignore: ['!style-loader.*$'] }] */
import mochaModalStyles from // eslint-disable-line no-unused-vars
  '!style-loader!css-loader!./stylesheets/mocha-modal.css';
import fCCTestTogglerStyles from // eslint-disable-line no-unused-vars
  '!style-loader!css-loader!./stylesheets/fcc-test-toggler.css';
import createDrumMachineTests from './project-tests/drum-machine-tests';
import createMarkdownPreviewerTests from
  './project-tests/markdown-previewer-tests';
import createCalculatorTests from './project-tests/calculator-tests';
import createPomodoroClockTests from './project-tests/pomodoro-clock-tests';
import createTributePageTests from './project-tests/tribute-page-tests';
import createPortfolioTests from './project-tests/portfolio-tests';
import createProductLandingPageTests from
  './project-tests/product-landing-page-tests';
import createSurveyFormTests from './project-tests/survey-form-tests';
import createTechnicalDocsPageTests from './project-tests/technical-docs-tests';
import createBarChartTests from './project-tests/bar-chart-tests';
import createScatterPlotTests from './project-tests/scatter-plot-tests';
import createChoroplethTests from './project-tests/choropleth-tests';
import createTreeMapTests from './project-tests/tree-map-tests';
import createRandomQuoteMachineTests from './project-tests/quote-machine-tests';
import createHeatMapTests from './project-tests/heat-map-tests';

export const assert = chai.assert;

let projectNameLocal = false;

// Prepare iframe with test window html and styles
const fCCToggle = document.createElement('div');
fCCToggle.innerHTML = fCCTestTogglerSkeleton;
document.body.appendChild(fCCToggle);
const testStyles = document.createElement('style');
testStyles.innerHTML = fCCTestUIStyles;
const testFrame = document.getElementById('fcc_foldout_menu');
const testFrameBody = testFrame.contentWindow.document;
testFrameBody.open();
testFrameBody.write(fCCTestSuiteSkeleton);
testFrameBody.close();
// Simplest way to append styles to iframe <head> is with jQuery
// https://stackoverflow.com/questions/217776/how-to-apply-css-to-iframe
$(testFrame).contents().find('head').append(testStyles);

// Load mocha.
(function() {
  var mochaCdn = document.createElement('script');
  mochaCdn.setAttribute(
    'src',
    'https://cdnjs.cloudflare.com/ajax/libs/mocha/3.0.2/mocha.min.js'
  );
  document.head.appendChild(mochaCdn);
})();

// When the document is fully loaded, create the "Tests" button and the
// corresponding modal window, (jquery required)
$(document).ready(function() {
  // Alert users about cross-browser compatibility issues.
  const isChrome = !!window.chrome && !!window.chrome.webstore;
  if (isChrome === false) {
    alertOnce(
      'Intro Alert',
      'Test suites are currently optimized for Chrome. There are known ' +
      'issues that we are trying to work through to make these suites fully ' +
      'cross-browser compatible, but it is a work in progress. For the best ' +
      'user experience, please use Chrome until these issues are resolved. ' +
      'Thanks and Happy Coding!'
    );
  }
  // Check mocha is loaded and populate test suite.
  let mochaCheck = setInterval(() => runCheck(), 50);

  function runCheck() {
    try {
      if (mocha) {
        clearInterval(mochaCheck);
        mocha.setup('bdd');

        // Once testFrame is loaded:
        let projectTitleCase = localStorage.getItem('projectTitleCase');
        // projectName variable is defined in our example projects so the
        // correct test suite is automatically loaded. This sets default text
        // for <option> text and project indicator in top right corner.
        if (typeof projectName !== 'undefined') {
          projectNameLocal = projectName;
        }
        // #mocha <div> won't work within iframe so append separately
        const mochaModal = document.createElement('div');
        mochaModal.innerHTML = mochaModalSkeleton;
        document.body.appendChild(mochaModal);

        if ((!projectNameLocal) && (projectTitleCase === null)) {
          testFrameBody.getElementById('placeholder').innerHTML = '- - -';
          testFrameBody.getElementById(
            'fcc_test_suite_indicator_wrapper'
          ).innerHTML = '';
        } else if (projectNameLocal) {
          testFrameBody.getElementById('placeholder').innerHTML =
            `${localStorage.getItem('example_project')}`;
          testFrameBody.getElementById(
            'fcc_test_suite_indicator_wrapper'
          ).innerHTML =
            '<span id=fcc_test_suite_indicator>FCC Test Suite: ' +
            `${localStorage.getItem('example_project')}</span>`;
        } else {
          testFrameBody.getElementById('placeholder')
          .innerHTML = projectTitleCase;
          document.getElementById(
            'fcc_test_suite_indicator_wrapper'
          ).innerHTML =
            '<span id=fcc_test_suite_indicator>FCC Test Suite: ' +
            `${projectTitleCase}</span>`;
        }
      }
    } catch (err) {
      console.warn('mocha not loaded yet');
    }
  }
  runCheck();
});

// UTILITY FUNCTIONS:

// Select project dropdown.
export function selectProject(project) {
  // Store project_selector for initTestRunner function.
  localStorage.setItem('project_selector', project);
  // Create & store pretty-print project name for display in indicator div.
  let projectTitleCase = project.replace(/-/g, ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.substr(1)).join(' ');
  document.getElementById(
    'fcc_test_suite_indicator_wrapper'
  ).innerHTML =
    '<span id=fcc_test_suite_indicator>FCC Test Suite: ' +
    `${projectTitleCase}</span>`;
  localStorage.setItem('projectTitleCase', projectTitleCase);
}

// Updates the button color and text on the target project, to show how many
// tests passed and how many failed.
export function FCCUpdateTestResult(nbTests, nbPassed, nbFailed) {
  const button = testFrameBody.getElementById('fcc_test_button');
  button.innerHTML = `Tests ${nbPassed}/${nbTests}`;
  if (nbFailed) {
    button.classList.add('fcc_test_btn-error');
  } else {
    button.classList.add('fcc_test_btn-success');
  }
}

// Updates the button text on the target project, to show how many tests were
// executed so far.
export function FCCUpdateTestProgress(nbTests, nbTestsExecuted) {
  const button = testFrameBody.getElementById('fcc_test_button');
  button.classList.add('fcc_test_btn-executing');
  button.innerHTML = `Testing ${nbTestsExecuted}/${nbTests}`;
}

// Open the main modal.
export function FCCOpenTestModal() {
  const modal = document.getElementById('fcc_test_message-box');
  modal.classList.remove('fcc_test_message-box-hidden');
  modal.classList.add('fcc_test_message-box-shown');
}

// Close the main modal.
export function FCCCloseTestModal() {
  const modal = document.getElementById('fcc_test_message-box');
  modal.classList.remove('fcc_test_message-box-shown');
  modal.classList.add('fcc_test_message-box-hidden');
}

// Close modal on ESC press.
$(document).keyup(function(e) {
  e = e || window.event;
  if (e.keyCode === 27) {
    FCCCloseTestModal();
  }
});

// Close modal on click outside el.
export function FCCclickOutsideToCloseModal(e) {
  if (e.target.id === 'fcc_test_message-box') {
    FCCCloseTestModal();
  }
}

// Cannot reset classList with an = assignment due to cross-browser conflicts.
// TODO: Refactor to eliminate for loops. The first for loop is simply:
// let classListArray = [].slice.call(elem.classList);
function clearClassList(elem) {
  var classListAsArray = new Array(elem.classList.length);

  for (var i = 0; i < elem.classList.length; i++) {
    classListAsArray[i] = elem.classList[i];
  }

  for (var j = 0; j < classListAsArray.length; j++) {
    elem.classList.remove(classListAsArray[j]);
  }
}

// run tests
export function FCCRerunTests() {
  const button = testFrameBody.getElementById('fcc_test_button');
  button.innerHTML = (!projectNameLocal) &&
    (!localStorage.getItem('project_selector'))
    ? 'Load Tests!'
    : 'Testing';
  button.title = (!projectNameLocal) &&
    (!localStorage.getItem('project_selector'))
    ? 'Select test suite from dropdown above'
    : 'CTRL + SHIFT + T';
  clearClassList(button);
  button.classList.add('fcc_foldout_buttons');
  button.classList.add('fcc_test_btn-default');
  FCCInitTestRunner();
}

// Reset tests.
export function FCCResetTests(suite) {
  suite.tests.forEach(function(t) {
    delete t.state;
    t.timedOut = false;
  });
  suite.suites.forEach(FCCResetTests);
}

// Shortcut keys.
// TODO: Need better inline docs on why we need to redefine the global
// onkeydown and onkeyup.
const map = [];
/* global onkeydown:true, onkeyup:true */
/* exported onkeydown, onkeyup */
onkeydown = onkeyup = function(e) {
  const modal = document.getElementById('fcc_test_message-box');
  e = e || window.event;
  map[e.keyCode] = e.type === 'keydown';
  // run tests: Ctrl + Shift + Enter
  if (map[17] && map[16] && map[13]) {
    if (localStorage.getItem('project_selector') === 'markdown-previewer') {
      alertOnce(
        'alerted',
        'Run-Test hotkey disabled for this project, please use mouse.'
      );
      return;
    } else {
      FCCRerunTests();
    }
  // Open/close modal: Ctrl + Shift + T.
  } else if (map[17] && map[16] && map[84]) {
    if (modal.classList.contains('fcc_test_message-box-hidden')) {
      FCCOpenTestModal();
    } else {
      FCCCloseTestModal();
    }
  // Open/close foldout menu: Ctrl + Shift + O.
  } else if (map[17] && map[16] && map[79]) {
    // TODO: Fix css selector namespaces (suggest BEM)
    testFrameBody.getElementById('fcc_toggle').click();
  }
};

// Shortcuts interfere w/ markdown tests, disable and alert.
export function alertOnce(item, message) {
  const alerted = sessionStorage.getItem(item) || false;
  if (alerted) {
    return;
  } else {
    /* eslint no-alert: "off" */
    alert(message);
    sessionStorage.setItem(item, true);
  }
}

// Hamburger menu transformation
export function hamburgerTransform() {
  if (testFrameBody.getElementById('hamburger_top').classList.contains(
    'transform_top')
  ) {
    testFrameBody.getElementById('hamburger_top').classList.remove(
      'transform_top'
    );
    testFrameBody.getElementById('hamburger_middle').classList.remove(
      'transform_middle'
    );
    testFrameBody.getElementById('hamburger_bottom').classList.remove(
      'transform_bottom'
    );
  } else {
    testFrameBody.getElementById('hamburger_top').classList.add(
      'transform_top'
    );
    testFrameBody.getElementById('hamburger_middle').classList.add(
      'transform_middle'
    );
    testFrameBody.getElementById('hamburger_bottom').classList.add(
      'transform_bottom'
    );
    testFrame.style.width = '320px';
  }
}

// Init tests.
export function FCCInitTestRunner() {
  let testRunner = null;
  // Empty the mocha tag in case of rerun.
  document.querySelector('.fcc_test_message-box-body #mocha').innerHTML = '';
  // Empty the test suite in the mocha object.
  mocha.suite.suites = [];
  // Check for hard-coded project selector (for our example projects).
  const hardCodedProjectName = (!projectNameLocal)
    ? null
    : projectNameLocal;
  // create tests
  switch (hardCodedProjectName || localStorage.getItem('project_selector')) {
    case 'random-quote-machine':
      createRandomQuoteMachineTests();
      break;
    case 'javascript-calculator':
      createCalculatorTests();
      break;
    case 'pomodoro-clock':
      createPomodoroClockTests();
      break;
    case 'tribute-page':
      createTributePageTests();
      break;
    case 'drum-machine':
      createDrumMachineTests();
      break;
    case 'portfolio':
      createPortfolioTests();
      break;
    case 'product-landing-page':
      createProductLandingPageTests();
      break;
    case 'survey-form':
      createSurveyFormTests();
      break;
    case 'markdown-previewer':
      createMarkdownPreviewerTests();
      break;
    case 'technical-docs-page':
      createTechnicalDocsPageTests();
      break;
    case 'bar-chart':
      createBarChartTests();
      break;
    case 'scatter-plot':
      createScatterPlotTests();
      break;
    case 'choropleth':
      createChoroplethTests();
      break;
    case 'heat-map':
      createHeatMapTests();
      break;
    case 'tree-map':
      createTreeMapTests();
      break;
    default:
      // Do nothing.
  }

  // Save the number of tests in the selected suite.
  let nbTests = 0;
  mocha.suite.eachTest(() => nbTests++);
  let nbTestsExecuted = 0;
  let nbPassed = 0;
  let nbFailed = 0;
  const hasPassed = () => nbPassed++;
  const hasFailed = () => nbFailed++;
  const updateProgress = () =>
    FCCUpdateTestProgress(nbTests, ++nbTestsExecuted);
  const updateEnd = () =>
    FCCUpdateTestResult && FCCUpdateTestResult(nbTests, nbPassed, nbFailed);
  if (testRunner) {
    FCCResetTests(mocha.suite);
    testRunner.abort();
    testRunner.removeListener('pass', hasPassed);
    testRunner.removeListener('fail', hasFailed);
    testRunner.removeListener('test end', updateProgress);
    testRunner.removeListener('end', updateEnd);
  }
  // Run the test suite.
  testRunner = mocha.run();
  testRunner.on('pass', hasPassed);
  testRunner.on('fail', hasFailed);
  testRunner.on('test end', updateProgress);
  // Update the "tests" button caption at the end of the overhall execution.
  testRunner.on('end', updateEnd);
}

// Polyfill for enabling NodeList.forEach() method - IE, Edge, Safari.
(function() {
  if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
})();
