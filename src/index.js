
import $ from 'jquery';
import chai from 'chai';
import starter_HTML from './starter_HTML';
import createDrumMachineTests from './project-tests/drumMachineTests.js';

// Setup Mocha and initialize
mocha.setup("bdd");
export const assert = chai.assert;
let testRunner = null;
const requestTimeout = 3000;

// Utility Functions
export function testHorizontallyCentered(elName){
  const centeredElement = document.getElementsByClassName(elName)[0];
  const actualSideGap = centeredElement.offsetLeft;
  const centeredElementWidth = centeredElement.clientWidth;
  const gapExpectedWidth = (window.innerWidth-centeredElementWidth)/2;
  const delta = gapExpectedWidth - actualSideGap; 
  console.log(gapExpectedWidth, actualSideGap, delta);
  return delta < 3 && delta > -3; 
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
    FCCCloseTestModal();
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

// run tests hotkeys
const map = [];
onkeydown = onkeyup = function(e){
  e = e || window.event; 
  map[e.keyCode] = e.type == 'keydown';
  if(map[17] && map[16] && map[13]) { 
    FCCRerunTests();
  }
}

export function FCCInitTestRunner(){
  // empty the mocha tag in case of rerun
  document.querySelector(".fcc_test_message-box-body #mocha").innerHTML = "";
  
  // empty the test suite in the mocha object
  mocha.suite.suites = [];
  
  // create tests
  switch (project_name) {
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
  }
  
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
  }
  
  // Run the test suite
  testRunner = mocha.run();
  testRunner.on("pass", hasPassed);
  testRunner.on("fail", hasFailed);
  testRunner.on("test end", updateProgress);
  testRunner.on("end", updateEnd); // update the "tests" button caption at  the end of the overhall execution.
}

// When the document is fully loaded,
// create the "Tests" button and the corresponding modal window (bootstrap(js/css) and jquery required)
$(document).ready(function() {
  const testDiv = document.createElement("div");
  testDiv.style.position = "inherit";
  testDiv.innerHTML = starter_HTML;
  document.body.appendChild(testDiv);
});