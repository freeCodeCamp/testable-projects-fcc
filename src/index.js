import $ from 'jquery';
import chai from 'chai';
import test_suite_skeleton from './assets/test_suite_skeleton';
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
import createHeatMapTests from './project-tests/heat-map-tests';

export const assert = chai.assert;
//export let project_selector;

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
                testDiv.innerHTML = test_suite_skeleton;
                document.body.appendChild(testDiv);
                let project_titleCase = localStorage.getItem('project_titleCase');
                document.getElementById('placeholder').innerHTML = typeof project_name === 'undefined' && project_titleCase === null ? '- - -' : 
                                                                   typeof project_name === 'undefined' ? project_titleCase : project_name.replace(/-/g, ' ');
                document.getElementById('fcc_test_suite_indicator_wrapper').innerHTML = typeof project_name === 'undefined' && project_titleCase === null ? '' : 
                                                                                        typeof project_name === 'undefined' ? `<span id=fcc_test_suite_indicator>FCC Test Suite: ${project_titleCase}</span>` : 
                                                                                        `<span id=fcc_test_suite_indicator>FCC Test Suite: ${project_name.replace(/-/g, ' ')}</span>`;
            };
        } catch (err) {
            console.warn('mocha not loaded yet');
        };
    };
    runCheck();
});

// UTILITY FUNCTIONS:

// select project dropdown
export function selectProject(project) {
    // store project_selector for initTestRunner function
    localStorage.setItem('project_selector', project);
    // create & store pretty-print project name for display in indicator div
    let project_titleCase = project.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.substr(1)).join(' ');
    document.getElementById('fcc_test_suite_indicator_wrapper').innerHTML = `<span id=fcc_test_suite_indicator>FCC Test Suite: ${project_titleCase}</span>`;
    localStorage.setItem('project_titleCase', project_titleCase);
}

// Updates the button color and text on the target project, to show how many tests passed and how many failed. 
export function FCCUpdateTestResult(nbTests, nbPassed, nbFailed) {
    const button = document.getElementById('fcc_test_button');
    button.innerHTML = `Tests ${nbPassed}/${nbTests}`;
    if (nbFailed) {
        button.classList.add("fcc_test_btn-error");
    } else {
        button.classList.add("fcc_test_btn-success");
    }
}

// Updates the button text on the target project, to show how many tests were executed so far. 
export function FCCUpdateTestProgress(nbTests, nbTestsExecuted) {
    const button = document.getElementById('fcc_test_button');
    button.classList.add('fcc_test_btn-executing');
    button.innerHTML = `Testing ${nbTestsExecuted}/${nbTests}`;
}

// open main modal
export function FCCOpenTestModal() {
    const modal = document.getElementById('fcc_test_message-box');
    modal.classList.remove("fcc_test_message-box-hidden");
    modal.classList.add("fcc_test_message-box-shown");
}

// close main modal
export function FCCCloseTestModal() {
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
    if (e.target.id === 'fcc_test_message-box') {
        FCCCloseTestModal();
    }
}

// run tests
export function FCCRerunTests() {
    const button = document.getElementById('fcc_test_button');
    button.innerHTML = typeof project_name === 'undefined' && 
    localStorage.getItem('project_selector') === null ? 'Load Tests!' : 'Testing';
    button.title = typeof project_name === 'undefined' && 
    localStorage.getItem('project_selector') === null ? 'Select test suite from dropdown above' : 'CTRL + SHIFT + T';
    button.classList = ["fcc_foldout_buttons"];
    button.classList.add("fcc_test_btn-default");
    FCCInitTestRunner();
}

// reset tests
export function FCCResetTests(suite) {
    suite.tests.forEach(function(t) {
        delete t.state;
        t.timedOut = false;
    });
    suite.suites.forEach(FCCResetTests);
}

// shortcut keys
const map = [];
onkeydown = onkeyup = function(e) {
    const modal = document.getElementById('fcc_test_message-box');
    e = e || window.event;
    map[e.keyCode] = e.type == 'keydown';
    if (map[17] && map[16] && map[13]) { // run tests: Ctrl + Shift + Enter 
        if (localStorage.getItem('project_selector') === 'markdown-previewer') {
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
    } else if (map[17] && map[16] && map[79]) { // open/close foldout menu: Ctrl + Shift + O
        document.getElementById('toggle').click();
    }
}

// shortcuts interfere w/ markdown tests, disable and alert
export function alertOnce() {
    const alerted = sessionStorage.getItem('alerted') || false;
    if (alerted) {
        return;
    } else {
        alert('Run-Test hotkey disabled for this project, please use mouse.');
        sessionStorage.setItem('alerted', true);
    }
}

// hamburger menu transformation
export function hamburger_transform() {
    if (document.getElementById('hamburger_top').classList.contains('transform_top')) {
        document.getElementById('hamburger_top').classList.remove('transform_top');
        document.getElementById('hamburger_middle').classList.remove('transform_middle');
        document.getElementById('hamburger_bottom').classList.remove('transform_bottom');
    } else {
        document.getElementById('hamburger_top').classList.add('transform_top');
        document.getElementById('hamburger_middle').classList.add('transform_middle');
        document.getElementById('hamburger_bottom').classList.add('transform_bottom');
    }
}

// init tests
export function FCCInitTestRunner() {
    let testRunner = null;
    // empty the mocha tag in case of rerun
    document.querySelector(".fcc_test_message-box-body #mocha").innerHTML = "";
    // empty the test suite in the mocha object
    mocha.suite.suites = [];
    // check for hard-coded project selector (for our example projects)
    const hardCoded_project_name = typeof project_name === 'undefined' ? null : project_name;
    // create tests
    switch (hardCoded_project_name || localStorage.getItem('project_selector')) {
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
        case 'heat-map';
            createHeatMapTests();
            break;
    };

    // save the number of tests in the selected suite
    let nbTests = 0;
    mocha.suite.eachTest(_ => nbTests++);
    let nbTestsExecuted = 0;
    let nbPassed = 0;
    let nbFailed = 0;
    const hasPassed = _ => nbPassed++;
    const hasFailed = _ => nbFailed++;
    const updateProgress = _ => FCCUpdateTestProgress(nbTests, ++nbTestsExecuted);
    const updateEnd = _ => FCCUpdateTestResult && FCCUpdateTestResult(nbTests, nbPassed, nbFailed);
    if (testRunner) {
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
