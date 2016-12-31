
import $ from 'jquery';
import chai from 'chai';
import test_suite_skeleton from './assets/test_suite_skeleton';
import test_suite_skeleton_init from './assets/test_suite_skeleton_init';
import mocha_CSS from './assets/mocha_CSS';
import createDrumMachineTests from './project-tests/drum-machine-tests';
import createMarkdownPreviewerTests from './project-tests/markdown-previewer-tests';
import createCalculatorTests from './project-tests/calculator-tests';
import createPomodoroClockTests from './project-tests/pomodoro-clock-tests';
import createTributePageTests from './project-tests/tribute-page-tests';
import createPortfolioTests from './project-tests/portfolio-tests';
import createProductLandingPageTests from './project-tests/product-landing-page-tests';
import createSurveyFormTests from './project-tests/survey-form-tests';
import createTechnicalDocsPageTests from './project-tests/technical-docs-tests';
import createBarChartTests from './project-tests/bar-chart-tests';
import createScatterPlotTests from './project-tests/scatter-plot-tests';
import createRandomQuoteMachineTests from './project-tests/quote-machine-tests';

export const assert = chai.assert;
export let project_selector;
export let random_key = Math.floor(Math.random()*90000) + 10000;
FCC_Global.random_key = FCC_Global.random_key.toString();

// load mocha
(function() {
  // write mocha CSS to page head
  document.write(`<style>${mocha_CSS}</style>`);
  // add a script tag to load mocha JS from a CDN
  var mocha_cdn = document.createElement('script');
  mocha_cdn.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/mocha/3.0.2/mocha.min.js');
  document.head.appendChild(mocha_cdn);
})();

// When the document is fully loaded,
// create the "Tests" button and the corresponding modal window, jquery required)
$(document).ready(function() {
  //let project_name = '';
  // check for chrome
  const isChrome = !!window.chrome && !!window.chrome.webstore;
  if (isChrome === false) {
    alert('Test Suite Compatible with Chrome Only');
  }

  // check mocha is loaded and populate test suite
  let mochaCheck = setInterval(() => runCheck(), 50);
  function runCheck() {
    try {    
      if (mocha) {
        clearInterval(mochaCheck);
        mocha.setup("bdd");
        const testDiv = document.createElement("div");
        testDiv.style.position = "inherit";
        let selected = localStorage.getItem(FCC_Global.random_key);
        if (selected === null && typeof project_name === 'undefined') {
          testDiv.innerHTML = test_suite_skeleton_init;
        } else {
          testDiv.innerHTML = test_suite_skeleton;
        }
        document.body.appendChild(testDiv);
      };
    } catch (err) {
      console.warn('mocha not loaded yet');
    };
  };
  runCheck();
});

// UTILITY FUNCTIONS:

export function selectProject(project) {
  FCC_Global.project_selector = project;
  document.getElementById('fcc_test_selector_modal').classList.add('fcc_test_selector_modal_hidden');
  localStorage.setItem(FCC_Global.random_key, true);
  localStorage.setItem('project', project);
}

export function resetSelection() {
  document.getElementById('fcc_test_selector_modal').classList.remove('fcc_test_selector_modal_hidden');
}

// Updates the button color and text on the target project, to show how many tests passed and how many failed. 
export function FCCUpdateTestResult(nbTests, nbPassed, nbFailed){
  const button = document.getElementById('fcc_test_button');
  button.innerHTML = `Tests ${nbPassed}/${nbTests}`;
  if(nbFailed){
    button.classList.add("fcc_test_btn-error");
  } else {
    button.classList.add("fcc_test_btn-success");
  }
}

// Updates the button text on the target project, to show how many tests were executed so far. 
export function FCCUpdateTestProgress(nbTests, nbTestsExecuted){
  const button = document.getElementById('fcc_test_button');
  button.innerHTML = `Testing ${nbTestsExecuted}/${nbTests}`;
}

export function FCCOpenTestModal(){
  const modal = document.getElementById('fcc_test_message-box');
  modal.classList.remove("fcc_test_message-box-hidden");
  modal.classList.add("fcc_test_message-box-shown");
}

export function FCCCloseTestModal(){
  const modal = document.getElementById('fcc_test_message-box');
  modal.classList.remove("fcc_test_message-box-shown");
  modal.classList.add("fcc_test_message-box-hidden");
}

// close modal on ESC press
$(document).keyup(function(e) {
  e = e || window.event;
  if (e.keyCode == 27) { 
    FCCCloseTestModal() || document.getElementById('fcc_test_selector_modal').classList.add('fcc_test_selector_modal_hidden');
  }
});

// close modal on click outside el
export function FCCclickOutsideToCloseModal(e) {
  if(e.target.id === 'fcc_test_message-box') {
    FCCCloseTestModal();
  } 
}

export function FCCRerunTests(){
  const button = document.getElementById('fcc_test_button');
  button.innerHTML = `Testing`;
  button.classList = [];
  button.classList.add("fcc_test_btn-default");
  FCCInitTestRunner();
}

export function FCCResetTests(suite) {
  suite.tests.forEach(function(t) {
    delete t.state;
    t.timedOut = false;
  });
  suite.suites.forEach(FCCResetTests);
}

// HotKeys
const map = [];
onkeydown = onkeyup = function(e){
  const modal = document.getElementById('fcc_test_message-box');
  e = e || window.event; 
  map[e.keyCode] = e.type == 'keydown';
  if(map[17] && map[16] && map[13]) { // run tests: Ctrl + Shift + Enter 
    if (project_name === 'markdown-previewer') {
      alertOnce();
      return;
    } else {
      FCCRerunTests();
    }
  } else if (map[17] && map[16] && map[84]) { // open/close modal: Ctrl + Shift + T
    if (modal.classList.contains("fcc_test_message-box-hidden")) {
      FCCOpenTestModal() 
    } else {
      FCCCloseTestModal();
    }
  }
}

export function alertOnce() { // hotkey interferes w/ markdown tests, disable and alert
  var alerted = sessionStorage.getItem('alerted') || false;
  if (alerted) {
    return;
  } else {
    alert('Run-Test hotkey disabled for this project, please use mouse.');
    sessionStorage.setItem('alerted', true);
  }
}

export function FCCInitTestRunner(){
  let testRunner = null;
  // empty the mocha tag in case of rerun
  document.querySelector(".fcc_test_message-box-body #mocha").innerHTML = "";
  // empty the test suite in the mocha object
  mocha.suite.suites = [];
  // create tests
  switch (FCC_Global.project_selector || localStorage.getItem('project') || project_name) {
    case "random-quote-machine":
      createRandomQuoteMachineTests();
      break;
    case "javascript-calculator":
      createCalculatorTests();
      break;
    case "pomodoro-clock":
      createPomodoroClockTests();
      break;
    case "tribute-page":
      createTributePageTests();
      break;
    case "drum-machine": 
      createDrumMachineTests();
      break;
    case "portfolio":
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
  };
  
  // save the number of tests in the selected suite
  let nbTests = 0;
  mocha.suite.eachTest( _ => nbTests++);
  let nbTestsExecuted = 0;
  let nbPassed = 0;
  let nbFailed = 0;
  const hasPassed = _ => nbPassed++;
  const hasFailed = _ => nbFailed++;
  const updateProgress= _ => FCCUpdateTestProgress(nbTests, ++nbTestsExecuted);
  const updateEnd = _ => FCCUpdateTestResult && FCCUpdateTestResult(nbTests, nbPassed, nbFailed);
  if(testRunner){
    FCCResetTests(mocha.suite);
    testRunner.abort();
    testRunner.removeListener("pass", hasPassed);
    testRunner.removeListener("fail", hasFailed);
    testRunner.removeListener("test end", updateProgress);
    testRunner.removeListener("end", updateEnd);
  };
  // Run the test suite
  testRunner = mocha.run();
  testRunner.on("pass", hasPassed);
  testRunner.on("fail", hasFailed);
  testRunner.on("test end", updateProgress);
  testRunner.on("end", updateEnd); // update the "tests" button caption at  the end of the overhall execution.
};


