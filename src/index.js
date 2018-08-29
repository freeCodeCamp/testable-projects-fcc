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

        // projectName variable is defined in our example projects so the
        // correct test suite is automatically loaded. This sets default text
        // for <option> text and project indicator in top right corner.
        if (typeof projectName !== 'undefined' &&
            projects.hasOwnProperty(projectName)) {
          testSuiteSelector.disabled = true;
          localStorage.setItem('project_selector', projectName);
        }

        let projectNameLocal = localStorage.getItem('project_selector');
        if (!projectNameLocal) {
          testSuiteSelector.value = '';
          indicatorWrapper.innerHTML = '';
        } else {
          testSuiteSelector.value = projectNameLocal;
          indicatorWrapper.innerHTML =
            '<span id=fcc_test_suite_indicator>FCC Test Suite: ' +
            `${projects[projectNameLocal].name}</span>`;
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
  localStorage.removeItem('fCC_' + project + '_hide');
  // Store project_selector for initTestRunner function.
  localStorage.setItem('project_selector', project);

  let indicatorWrapper = shadow.querySelector(
    '#fcc_test_suite_indicator_wrapper'
  );
  if (project) {
    indicatorWrapper.innerHTML =
      '<span id=fcc_test_suite_indicator>FCC Test Suite: ' +
      `${projects[project].name}</span>`;
  } else {
    indicatorWrapper.innerHTML = '';
  }
}

export function FCCHandleTestResultClick(e) {
  var stack = e.target.querySelector('.fcc_err_stack');
  if (stack.style.display === 'inline-block') {
    stack.style.display = 'none';
  } else {
    stack.style.display = 'inline-block';
  }
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
  if (!alerted) {
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

// Close modal on click outside el.
export function FCCClickOutsideToCloseModal(e) {
  if (e.target.id === 'fcc_test_message-box') {
    FCCCloseTestModal();
  }
}

// Cannot reset classList with an = assignment due to cross-browser conflicts.
function clearClassList(elem) {
  [].slice.call(elem.classList).forEach(className => {
     elem.classList.remove(className);
  });
}

// run tests
export function FCCRerunTests() {
  const button = shadow.querySelector('#fcc_test_button');
  button.innerHTML = !localStorage.getItem('project_selector')
    ? 'Load Tests!'
    : 'Testing';
  button.title = !localStorage.getItem('project_selector')
    ? 'Select test suite from dropdown above'
    : 'CTRL + SHIFT + T';
  clearClassList(button);
  button.classList.add('fcc_foldout_buttons');
  button.classList.add('fcc_test_btn-default');
  FCCInitTestRunner();
}

// Init tests.
function FCCInitTestRunner() {
  let currentSection = shadow.querySelector('#mocha-report');

  function startSuite(suite) {
    if (suite.parent.root) {
      let mainTitleNode =
        shadow.querySelector('.fcc_test_message-box-header .title');
      mainTitleNode.innerHTML = suite.title;
      return;
    }

    let suiteSection = document.createElement('li');
    suiteSection.setAttribute('class', 'suite');
    let suiteTitleNode = document.createElement('h1');
    suiteTitleNode.innerText = suite.title;
    suiteSection.appendChild(suiteTitleNode);

    let childrenList;
    if (suite.tests.length) {
      /* TODO: Currently using <ul>, but if we switch to <ol> we can eliminate
        all of the `reqNum` instances in all the test suite files and use
        automatic numbering. */
      childrenList = document.createElement('ul');
    } else {
      childrenList = document.createElement('ul');
    }

    suiteSection.appendChild(childrenList);
    currentSection.appendChild(suiteSection);
    currentSection = childrenList;
  }

  function endSuite(suite) {
    if (!suite.parent || !suite.parent.root) {
      currentSection = currentSection.parentNode.parentNode;
    }
  }

  function appendTestResult(test) {
    let result = document.createElement('li');
    result.innerHTML = mochaTestResultSkeleton;
    currentSection.appendChild(result);

    let testTitle = result.querySelector('.fcc_test_title');
    let testTitleNode = testTitle.querySelector('.title');
    testTitleNode.innerText = test.title.replace(/\n/g, ' ');

    let codeBox = result.querySelector('.fcc_err_stack');

    if (test.state !== 'passed') {
      let err = test.err;
      let message;
      if (err.message && typeof err.message.toString === 'function') {
        message = err.message;
      } else if (typeof err.inspect === 'function') {
        message = err.inspect();
      } else {
        message = '';
      }
      let stack = (!err.stack ? '' : filterStack(err.stack));
      result.setAttribute('class', 'test fail');
      codeBox.innerText = message + ' \n' + stack;
      codeBox.style.display = 'inline-block';
    } else {
      let testDuration = result.querySelector('.duration > .number');
      testDuration.innerText = test.duration;

      result.setAttribute('class', `test pass ${test.speed}`);
      /* Add test code to hidden code box */
      codeBox.innerText = test.body.toString();
    }
  }

  // Updates the button color and text on the target project, to show how many
  // tests passed and how many failed.
  function updateTestResult(nbPassed, nbFailed, startTimeStamp) {
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
      ((Date.now() - startTimeStamp) / 1000).toFixed(2) + 's';
  }

  // Updates the button text on the target project, to show how many tests were
  // executed so far.
  function updateTestProgress(nbTests, nbTestsExecuted) {
    const button = shadow.querySelector('#fcc_test_button');
    button.classList.add('fcc_test_btn-executing');
    button.innerHTML = `Testing ${nbTestsExecuted}/${nbTests}`;
    const statsProgress = shadow.querySelector('.fcc_progress');
    /* Update percentage */
    statsProgress.innerText =
      ((nbTestsExecuted / nbTests) * 100).toFixed(2) + '%';
  }

  let startTimeStamp = Date.now();
  // Empty the mocha tag in case of rerun.
  currentSection.innerHTML = '';
  // Empty the test suite in the mocha object.
  mocha.suite.suites = [];
  // Check for hard-coded project selector (for our example projects).
  let projectNameLocal = localStorage.getItem('project_selector');

  if (projects.hasOwnProperty(projectNameLocal)) {
    projects[projectNameLocal].test();
  }

  // Save the number of tests in the selected suite.
  let nbTests = mocha.suite.total();
  let nbTestsExecuted = 0;
  let nbPassed = 0;
  let nbFailed = 0;
  const hasPassed = () => nbPassed++;
  const hasFailed = () => nbFailed++;
  const updateProgress = () => updateTestProgress(nbTests, ++nbTestsExecuted);
  const updateEnd = () => updateTestResult(nbPassed, nbFailed, startTimeStamp);

  // Run the test suite.
  let testRunner = mocha.run();
  testRunner.on('pass', hasPassed);
  testRunner.on('fail', hasFailed);
  testRunner.on('test end', updateProgress);
  testRunner.on('suite', startSuite);
  testRunner.on('test end', appendTestResult);
  testRunner.on('suite end', endSuite);
  testRunner.on('end', updateEnd);
}

// Polyfill for enabling NodeList.forEach() method - IE, Edge, Safari.
(function() {
  if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
})();
