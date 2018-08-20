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
    A <div> situated in the top-left corner of the viewport with controls
    for running the tests
 3. mochaModalSkeleton
    A modal <div id="mocha"> automatically inserted into the document via Mocha

 We can use Webpack to inject loaded css into the document. We maintain three
 css files: one for the test control window (fcc-test-ui.css), one for the
 toggler (fcc-test-toggler.css), and one for the Mocha modal (mocha-modal.css)
*/

import $ from 'jquery';
import chai from 'chai';
// Module from Mocha to reduce length of error stack trace
import {stackTraceFilter} from 'mocha/lib/utils';
// Webpack is configured to load those files with the .html extension as Strings
import fCCTestSuiteSkeleton from './utils/fcc-test-suite-skeleton.html';
import fCCTestTogglerSkeleton from './utils/fcc-test-toggler-skeleton.html';
import mochaModalSkeleton from './utils/mocha-modal-skeleton.html';
import mochaTestResultSkeleton from './utils/mocha-test-result.html';
import fCCTestUIStyles from './stylesheets/fcc-test-ui.css';
import mochaModalStyles from './stylesheets/mocha-modal.css';
import fCCTestTogglerStyles from './stylesheets/fcc-test-toggler.css';
import projects from './project-tests';
import { Object } from 'core-js';

chai.config.includeStack = true;

export const assert = chai.assert;

let projectNameLocal = false;
// filter out unnecessary stack trace in Mocha reporter
const filterStack = stackTraceFilter();
// Wrapper for shadow DOM
const testDiv = document.createElement('div');
testDiv.setAttribute('id', 'fcc_test_suite_wrapper');
document.body.appendChild(testDiv);
// Using a shadow DOM, the fCC css won't interfere with student css
// A fallback div is provided.
const supportsShadowDOMV1 = !!HTMLElement.prototype.attachShadow;
let shadowDom;
if (supportsShadowDOMV1) {
  shadowDom = document.getElementById('fcc_test_suite_wrapper')
   .attachShadow({ mode: 'open' });
} else {
  shadowDom = document.getElementById('fcc_test_suite_wrapper');
}
/* This method requires the use of `.querySelector` wherever we formerly used
  `document.getElementBy...`
  Note that
  `shadowDom.getElementBy...` actually works fine when Shadow DOM is supported.
  In the case that Shadow DOM is not supported, `shadowDom` is a regular element
  with which `getElementBy...` is not a function.
*/
const shadow = shadowDom;

// Load mocha.
(function() {
  var mochaCdn = document.createElement('script');
  mochaCdn.setAttribute(
    'src',
    'https://cdnjs.cloudflare.com/ajax/libs/mocha/5.2.0/mocha.min.js'
  );
  shadow.appendChild(mochaCdn);
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
        mocha.setup({
          ui: 'bdd',
          reporter: 'base',
          fullTrace: true
        });
        let projectTitleCase = localStorage.getItem('projectTitleCase');
        // projectName variable is defined in our example projects so the
        // correct test suite is automatically loaded. This sets default text
        // for <option> text and project indicator in top right corner.
        if (typeof projectName !== 'undefined') {
          projectNameLocal = projectName;
        }

        // Create the test UI and its contents.

        // fCCTestTogglerSkeleton has the html for the toggle buttons.
        // fCCTestSuiteSkeleton contains the main test UI.
        // mochaModalSkeleton is where the test output goes.
        const style = document.createElement('style');
        style.innerHTML =
          fCCTestUIStyles + mochaModalStyles + fCCTestTogglerStyles;
        shadow.appendChild(style);

        const fCCToggle = document.createElement('div');
        fCCToggle.className = 'fcc_test_ui';
        fCCToggle.innerHTML = fCCTestTogglerSkeleton;
        shadow.appendChild(fCCToggle);

        const testFrameBody = document.createElement('div');
        testFrameBody.setAttribute('id', 'fcc_foldout_menu');
        testFrameBody.innerHTML = fCCTestSuiteSkeleton;
        fCCToggle.appendChild(testFrameBody);

        const testSuiteSelector = shadow.querySelector('#test-suite-selector');
        Object.keys(projects).forEach(key => {
          const testOption = document.createElement('option');
          testOption.value = key;
          testOption.innerHTML = projects[key].name;
          testSuiteSelector.appendChild(testOption);
        });

        const mochaModal = document.createElement('div');
        mochaModal.className = 'fcc_test_ui';
        mochaModal.innerHTML = mochaModalSkeleton;
        shadow.appendChild(mochaModal);

        let toggleElement = shadow.querySelector('#fcc_toggle');
        let indicatorWrapper = shadow.querySelector(
          '#fcc_test_suite_indicator_wrapper'
        );
        // Determine placeholder for the 'select' dropdown element.
        let placeholder = shadow.querySelector('#placeholder');

        if ((!projectNameLocal) && (projectTitleCase === null)) {
          placeholder.innerHTML = '- - -';
          indicatorWrapper.innerHTML = '';
        } else if (projectNameLocal) {
          placeholder.innerHTML =
            `${localStorage.getItem('example_project')}`;
          indicatorWrapper.innerHTML =
            '<span id=fcc_test_suite_indicator>FCC Test Suite: ' +
            `${localStorage.getItem('example_project')}</span>`;
        } else {
          placeholder.innerHTML = projectTitleCase;
          indicatorWrapper.innerHTML =
            '<span id=fcc_test_suite_indicator>FCC Test Suite: ' +
            `${projectTitleCase}</span>`;
        }
        // If this is the first time loading this project, show test window
        if (!localStorage.getItem(
          'fCC_' + localStorage.getItem('project_selector') + '_hide'
          )) {
          toggleElement.checked = false;
        } else {
          // If student has hidden the test window once, keep it hidden.
          hamburgerTransform();
          toggleElement.checked = true;
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
  localStorage.removeItem(
  'fCC_' + project + '_hide'
  );
  // Store project_selector for initTestRunner function.
  localStorage.setItem('project_selector', project);
  // Create & store pretty-print project name for display in indicator div.
  let projectTitleCase = project.replace(/-/g, ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.substr(1)).join(' ');
  shadow.querySelector(
    '#fcc_test_suite_indicator_wrapper'
  ).innerHTML =
    '<span id=fcc_test_suite_indicator>FCC Test Suite: ' +
    `${projectTitleCase}</span>`;
  localStorage.setItem('projectTitleCase', projectTitleCase);
}

export function FCCHandleTestResultClick(e) {
  var stack = e.target.querySelector('.fcc_err_stack');
  if (stack.style.display === 'inline-block') {
    stack.style.display = 'none';
  } else {
    stack.style.display = 'inline-block';
  }
}

// Updates the button color and text on the target project, to show how many
// tests passed and how many failed.
export function FCCUpdateTestResult(nbTests, nbPassed, nbFailed) {
  const button = shadow.querySelector('#fcc_test_button');
  button.innerHTML = `Tests ${nbPassed}/${nbPassed + nbFailed}`;
  // adding `.fcc_test_btn-done` for simpler querying by Selenium
  button.classList.add('fcc_test_btn-done');
  if (nbFailed) {
    button.classList.add('fcc_test_btn-error');
  } else {
    button.classList.add('fcc_test_btn-success');
  }
  var statsPassed = shadow.querySelector('.fcc_passes');
  var statsFailed = shadow.querySelector('.fcc_failures');
  var statsDuration = shadow.querySelector('.fcc_duration');
  statsPassed.innerText = nbPassed;
  statsFailed.innerText = nbFailed;
  /* Duration calculated with unix timestamp */
  statsDuration.innerText =
    ((Date.now() - mochaTimeStamp) / 1000).toFixed(2) + 's';
}

// Updates the button text on the target project, to show how many tests were
// executed so far.
export function FCCUpdateTestProgress(nbTests, nbTestsExecuted) {
  const button = shadow.querySelector('#fcc_test_button');
  button.classList.add('fcc_test_btn-executing');
  button.innerHTML = `Testing ${nbTestsExecuted}/${nbTests}`;
  const statsProgress = shadow.querySelector('.fcc_progress');
  /* Update percentage */
  statsProgress.innerText =
    ((nbTestsExecuted / nbTests) * 100).toFixed(2) + '%';
}

// Open the main modal.
export function FCCOpenTestModal() {
  const modal = shadow.querySelector('#fcc_test_message-box');
  modal.classList.remove('fcc_test_message-box-hidden');
  modal.classList.add('fcc_test_message-box-shown');
}

// Close the main modal.
export function FCCCloseTestModal() {
  const modal = shadow.querySelector('#fcc_test_message-box');
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
  const button = shadow.querySelector('#fcc_test_button');
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

let count = -1;
let parentTitle, mochaReport, mochaTimeStamp = null;

/* In order to append test results to the shadow DOM, we need to use a custom
 reporter. */
function appendTestResult(test) {
  /* Test Suite title */
  var parentParentTitle = test.parent.parent.title;
  var mainTitleNode =
    shadow.querySelector('.fcc_test_message-box-header .title');
  /* Append #mocha-report if it doesn't exist already */
  if (!mochaReport) {
    mainTitleNode.innerHTML = parentParentTitle;
    mochaReport = document.createElement('ul');
    mochaReport.setAttribute('id', 'mocha-report');
    shadow.querySelector('.fcc_test_message-box-body #mocha')
      .appendChild(mochaReport);
  } else {
    mochaReport = shadow.querySelector('#mocha-report');
  }
  /* If current test.parent.title is different from previous test, count up and
    create a new section with testList */
  if (!parentTitle || parentTitle !== test.parent.title) {
    count++;
    parentTitle = test.parent.title;
    var testSection = document.createElement('li');
    testSection.setAttribute('class', `fcc_section_${count} suite`);
    var parentTitleNode = document.createElement('h1');
    parentTitleNode.innerText = parentTitle;
    testSection.appendChild(parentTitleNode);
    /* TODO: Currently using <ul>, but if we switch to <ol> we can eliminate all
      of the `reqNum` instances in all the test suite files and use automatic
      numbering. */
    var testList = document.createElement('ul');
    testSection.appendChild(testList);
    mochaReport.appendChild(testSection);
  }
  /* Each test <li> is grouped with others in testList */
  var result = document.createElement('li');
  result.setAttribute('class', 'test');
  result.innerHTML = mochaTestResultSkeleton;
  testSection = shadow.querySelector(`.fcc_section_${count}`);
  testList = testSection.querySelector('ul');
  testList.appendChild(result);

  var testTitle = result.querySelector('.fcc_test_title');
  var testTitleNode = testTitle.querySelector('.title');
  testTitleNode.innerText = test.title.replace(/\n/g, ' ');

  var codeBox = result.querySelector('.fcc_err_stack');

  if (test.state !== 'passed') {
    var err = test.err;
    var message;
    if (err.message && typeof err.message.toString === 'function') {
      message = err.message;
    } else if (typeof err.inspect === 'function') {
      message = err.inspect();
    } else {
      message = '';
    }
    var stack = (!err.stack ? '' : filterStack(err.stack));
    result.setAttribute('class', 'test fail');
    codeBox.innerText = message + ' \n' + stack;
  } else {
    var testDuration = result.querySelector('.duration > .number');
    testDuration.innerText = test.duration;

    var classList = 'test pass ' + test.speed;
    result.setAttribute('class', classList);
    /* Add test code to hidden code box */
    codeBox.innerText = test.body.toString();
  }
}

const map = [];
/* global onkeydown:true, onkeyup:true */
/* exported onkeydown, onkeyup */
onkeydown = onkeyup = function(e) {
  const modal = shadow.querySelector('#fcc_test_message-box');
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
    shadow.querySelector('#fcc_toggle').click();
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
  if (shadow.querySelector('#hamburger_top').classList.contains(
    'transform_top')
  ) {
    shadow.querySelector('#hamburger_top').classList.remove(
      'transform_top'
    );
    shadow.querySelector('#hamburger_middle').classList.remove(
      'transform_middle'
    );
    shadow.querySelector('#hamburger_bottom').classList.remove(
      'transform_bottom'
    );
    // Once the student has hidden the test window, this localStorage variable
    // keeps it hidden until manually toggled.
    localStorage.setItem(
      'fCC_' + localStorage.getItem('project_selector') + '_hide', true
    );
  } else {
    shadow.querySelector('#hamburger_top').classList.add(
      'transform_top'
    );
    shadow.querySelector('#hamburger_middle').classList.add(
      'transform_middle'
    );
    shadow.querySelector('#hamburger_bottom').classList.add(
      'transform_bottom'
    );
  }
}

// Init tests.
export function FCCInitTestRunner() {
  mochaTimeStamp = Date.now();
  let testRunner = null;
  // Empty the mocha tag in case of rerun.
  shadow.querySelector('.fcc_test_message-box-body #mocha').innerHTML = '';
  // Empty the test suite in the mocha object.
  mocha.suite.suites = [];
  // Check for hard-coded project selector (for our example projects).
  let hardCodedProjectName = (!projectNameLocal)
    ? null
    : projectNameLocal;
  hardCodedProjectName = hardCodedProjectName ||
    localStorage.getItem('project_selector');

  if (projects.hasOwnProperty(hardCodedProjectName)) {
    projects[hardCodedProjectName].test();
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
    testRunner.removeListener('test end', appendTestResult);
  }

  // Run the test suite.
  testRunner = mocha.run();
  testRunner.on('pass', hasPassed);
  testRunner.on('fail', hasFailed);
  testRunner.on('test end', updateProgress);
  testRunner.on('test end', appendTestResult);
  testRunner.on('end', updateEnd);
}

// Polyfill for enabling NodeList.forEach() method - IE, Edge, Safari.
(function() {
  if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
})();
