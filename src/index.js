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
    A modal <div> to show the Mocha tests report

 We can use Webpack to inject loaded css into the document. We maintain four
 css files: one to set default css values (default.css), one for the test
 control window (fcc-test-ui.css), one for the toggler (fcc-test-toggler.css),
 and one for the Mocha modal (mocha-modal.css)
*/

import $ from 'jquery';
import chai from 'chai';
import 'mocha/mocha';
import fccMochaReporter from './utils/mocha-custom-reporter';
// Webpack is configured to load those files with the .html extension as Strings
import fCCTestSuiteSkeleton from './utils/fcc-test-suite-skeleton.html';
import fCCTestTogglerSkeleton from './utils/fcc-test-toggler-skeleton.html';
import mochaModalSkeleton from './utils/mocha-modal-skeleton.html';
import fCCDefaultStyles from './stylesheets/default.css';
import fCCTestUIStyles from './stylesheets/fcc-test-ui.css';
import mochaModalStyles from './stylesheets/mocha-modal.css';
import fCCTestTogglerStyles from './stylesheets/fcc-test-toggler.css';
import projects from './project-tests';

chai.config.includeStack = true;

export const assert = chai.assert;

let projectNameLocal;

/* This method requires the use of `.querySelector` wherever we formerly used
  `document.getElementBy...`
  Note that
  `shadowDom.getElementBy...` actually works fine when Shadow DOM is supported.
  In the case that Shadow DOM is not supported, `shadowDom` is a regular element
  with which `getElementBy...` is not a function.
*/
const shadow = (function attachShadow() {
  // Wrapper for shadow DOM
  const testDiv = document.createElement('div');
  testDiv.setAttribute('id', 'fcc_test_suite_wrapper');
  // Position our user interface at the top layer
  testDiv.style.setProperty('position', 'relative', 'important');
  testDiv.style.setProperty('z-index', '99999', 'important');
  document.body.appendChild(testDiv);
  // Using a shadow DOM, the fCC css won't interfere with student css
  // A fallback div is provided.
  const supportsShadowDOMV1 = !!HTMLElement.prototype.attachShadow;
  let shadowDom;
  if (supportsShadowDOMV1) {
    shadowDom = testDiv.attachShadow({ mode: 'open' });
  } else {
    shadowDom = testDiv;
  }
  return shadowDom;
})();

// Create the tests UI, init mocha and look for the project name
// when the document is fully loaded (jquery required).
$(document).ready(function initTests() {
  // Alert users about blocking third-party cookies.
  // Blocking third-party cookies blocks localStorage, which we depend on.
  try {
    localStorage.setItem('fccTest', 'fccTest');
    localStorage.removeItem('fccTest');
  } catch (e) {
    /* eslint no-alert: "off" */
    alert(
      'Test suites depend on access to localStorage. ' +
        'Please enable third-party cookies in the browser. ' +
        'See documentation for your browser for instructions ' +
        'on how to enable third-party cookies. ' +
        'Thanks and Happy Coding!'
    );
    // Return to avoid throwing an error from trying to access localStorage later
    return;
  }

  // Alert users about cross-browser compatibility issues.
  const isBrowserSupported = /(Chrome|Gecko)\/[\d\.]+/.test(
    navigator.userAgent
  );
  if (isBrowserSupported === false) {
    alertOnce(
      'Intro Alert',
      'Test suites are currently optimized for Chrome and Firefox. ' +
        'There are known issues that we are trying to work through to make ' +
        'these suites fully cross-browser compatible, but it is a work ' +
        'in progress. For the best user experience, please use Chrome or ' +
        'Firefox until these issues are resolved. ' +
        'Thanks and Happy Coding!'
    );
  }

  const style = document.createElement('style');
  style.innerHTML =
    fCCDefaultStyles +
    fCCTestUIStyles +
    mochaModalStyles +
    fCCTestTogglerStyles;
  shadow.appendChild(style);

  const fCCToggle = document.createElement('div');
  fCCToggle.className = 'fcc_test_ui';
  fCCToggle.innerHTML = fCCTestTogglerSkeleton;
  shadow.appendChild(fCCToggle);

  const testFrameBody = document.createElement('div');
  testFrameBody.setAttribute('id', 'fcc_foldout_menu');
  testFrameBody.innerHTML = fCCTestSuiteSkeleton;
  fCCToggle.appendChild(testFrameBody);

  const mochaModal = document.createElement('div');
  mochaModal.className = 'fcc_test_ui';
  mochaModal.innerHTML = mochaModalSkeleton;
  shadow.appendChild(mochaModal);

  // Populate a test suite selector
  const testSuiteSelector = shadow.querySelector('#test-suite-selector');
  Object.keys(projects).forEach((key) => {
    const testOption = document.createElement('option');
    testOption.value = key;
    testOption.innerHTML = projects[key].name;
    testSuiteSelector.appendChild(testOption);
  });

  // projectName variable is defined in our example projects so the
  // correct test suite is automatically loaded. This sets default text
  // for <option> text and project indicator in top right corner.
  if (
    typeof projectName !== 'undefined' &&
    projects.hasOwnProperty(projectName)
  ) {
    testSuiteSelector.disabled = true;
    projectNameLocal = projectName;
  } else {
    projectNameLocal = localStorage.getItem('project_selector');
  }

  let indicatorWrapper = shadow.querySelector(
    '#fcc_test_suite_indicator_wrapper'
  );

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
  let toggleElement = shadow.querySelector('#fcc_toggle');
  if (!localStorage.getItem('fCC_' + projectNameLocal + '_hide')) {
    toggleElement.checked = false;
  } else {
    // If student has hidden the test window once, keep it hidden.
    hamburgerTransform();
    toggleElement.checked = true;
  }

  // Init custom reporter for Mocha
  const button = shadow.querySelector('#fcc_test_button');
  const reporterOptions = {
    title: mochaModal.querySelector('.fcc_test_title'),
    stats: mochaModal.querySelector('.fcc_test_stats'),
    report: mochaModal.querySelector('.fcc_test_report'),
    events: {
      start: () => {
        button.classList.add('fcc_test_btn-executing');
      },
      'test end': ({ tests, total }) => {
        button.innerHTML = `Testing ${tests}/${total}`;
      },
      end: ({ passes, failures, total }) => {
        button.innerHTML = `Tests ${passes}/${total}`;
        button.classList.remove('fcc_test_btn-executing');
        // Adding `.fcc_test_btn-done` for simpler querying by Selenium
        button.classList.add('fcc_test_btn-done');
        if (failures) {
          button.classList.add('fcc_test_btn-error');
        } else {
          button.classList.add('fcc_test_btn-success');
        }
      }
    }
  };

  mocha.setup({
    ui: 'bdd',
    fullTrace: true
  });
  mocha.reporter(fccMochaReporter, reporterOptions);
  mocha.cleanReferencesAfterRun(false);
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
  projectNameLocal = project;
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
$(document).keyup(function (e) {
  e = e || window.event;
  if (e.keyCode === 27) {
    FCCCloseTestModal();
  }
});

const map = [];
/* exported onkeydown, onkeyup */
onkeydown = onkeyup = function (e) {
  e = e || window.event;
  map[e.keyCode] = e.type === 'keydown';
  // Run tests: Ctrl + Shift + Enter
  if (map[17] && map[16] && map[13]) {
    FCCRerunTests();
    // Open/close modal: Ctrl + Shift + T.
  } else if (map[17] && map[16] && map[84]) {
    const modal = shadow.querySelector('#fcc_test_message-box');
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
  if (
    shadow.querySelector('#hamburger_top').classList.contains('transform_top')
  ) {
    shadow.querySelector('#hamburger_top').classList.remove('transform_top');
    shadow
      .querySelector('#hamburger_middle')
      .classList.remove('transform_middle');
    shadow
      .querySelector('#hamburger_bottom')
      .classList.remove('transform_bottom');
    // Once the student has hidden the test window, this localStorage variable
    // keeps it hidden until manually toggled.
    localStorage.setItem('fCC_' + projectNameLocal + '_hide', true);
  } else {
    shadow.querySelector('#hamburger_top').classList.add('transform_top');
    shadow.querySelector('#hamburger_middle').classList.add('transform_middle');
    shadow.querySelector('#hamburger_bottom').classList.add('transform_bottom');
  }
}

// Close modal on click outside el.
export function FCCClickOutsideToCloseModal(e) {
  if (e.target.id === 'fcc_test_message-box') {
    FCCCloseTestModal();
  }
}

// run tests
export function FCCRerunTests() {
  const button = shadow.querySelector('#fcc_test_button');
  button.innerHTML = !projectNameLocal ? 'Load Tests!' : 'Testing';
  button.title = !projectNameLocal
    ? 'Select test suite from dropdown above'
    : 'CTRL + SHIFT + T';
  button.className = 'fcc_foldout_button fcc_test_btn-default';
  if (projectNameLocal === 'markdown-previewer') {
    loadMarked(FCCInitTestRunner);
  } else {
    FCCInitTestRunner();
  }
}

function loadMarked(callback) {
  if (typeof marked === 'undefined') {
    const markedCDN = document.createElement('script');
    markedCDN.src =
      'https://cdnjs.cloudflare.com/ajax/libs/marked/0.5.0/marked.min.js';
    markedCDN.onload = callback;
    shadow.appendChild(markedCDN);
  } else {
    callback();
  }
}

// Init tests.
function FCCInitTestRunner() {
  mocha.suite.suites = [];

  if (projects.hasOwnProperty(projectNameLocal)) {
    projects[projectNameLocal].test();
  }

  mocha.run();
}

// Polyfill for enabling NodeList.forEach() method - IE, Edge, Safari.
(function () {
  if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
})();
