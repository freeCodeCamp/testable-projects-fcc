const test_suite_skeleton = `
    <style>
        @import url("https://fonts.googleapis.com/css?family=Russo+One");
        #fcc_test_message-box {
            font-size: 20px;
            font-family: Arial, sans-serif;
            position: fixed;
            left: 0;
            bottom: 0;
            right: 0;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.8);
            transition: all .5s;
            z-index: 100000;
            overflow: auto;
        }
    
        .fcc_test_message-box-hidden {
            visibility: hidden;
            opacity: 0;
            top: -300px;
        }
    
        .fcc_test_message-box-shown {
            visibility: visible;
            opacity: 1;
            top: 0;
        }

        .fcc_test_message-box-content {
            position: relative;
            color: black;
            background-color: white;
            top: 10vh;
            width: 80%;
            margin: 0 auto;
            text-align: initial;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
        }
        .fcc_test_message-box-header,
        .fcc_test_message-box-footer{
            position: relative;
            height: 60px;
            flex: none;
            box-sizing: border-box;
            padding: 10px;
        }
        .fcc_test_message-box-header {
            border-bottom: 1px solid rgb(229,229,229);
        }
    
        .fcc_test_message-box-header .title {
            float: left;
            font-size: 30px;
            line-height: 40px;
            margin-left: 10px;
        }

        .fcc_test_message-box-body {
            flex: 1;
        }

        .fcc_test_message-box-footer {
            border-top: 1px solid rgb(229,229,229);
        }
    
        .fcc_test_message-box-close-btn {
            float: right;
            color: black;
            background-color: white;
            border: 1px solid rgb(229,229,229);
            border-radius: 4px;
            padding: 10px 20px;
            transition: all .3s;
        }
        .fcc_test_message-box-close-btn:hover {
            color: white;
            background-color: black;
        }

        #mocha {
            margin: 10px;
        }
        #mocha .test pre {
            background-color: rgb(245, 245, 245);
        }
        #mocha-stats {
            position: absolute;
        }
        #mocha ul {
            max-width: initial;
            margin: initial;
            text-align: initial;
        }

        div {
            position: static;
        }

        .fcc_test_message-box-close-fixed {
            position: fixed;
            top: 10px;
            right: 10px;
            height: 30px;
            width: 30px;
            border-radius: 50%;
            border: 3px solid grey;
            text-align: center;
            transition: all .4s;
        }
        .fcc_test_message-box-close-fixed:after {
            color: grey;
            font-family: Arial, sans-serif;
            font-size: 30px;
            font weight: bold;
            content: "X";
            line-height: 30px;
        }

        
        #fcc_foldout_menu {
            position: absolute;
            top: 0;
            left: -9999px;
            width: 320px;
            height: 195px;
            border-bottom-right-radius: 5px;
            background-color: rgba(255, 255, 204, 0.6);
            z-index: 99997;
            font-family: Russo One, Arial, sans-serif;
        }
        input[type=checkbox]:checked ~ #fcc_foldout_menu {
            left: 0;
            transition: 800ms;
        }
        #fcc_foldout_menu_inner {
            position: relative;
        }
        input[type=checkbox] {
            height: 24px;
            width: 25px;
            position: fixed;
            top: 7px;
            left: 20px;
            border: 1px solid black;
            opacity: 0;
            cursor: pointer;
            z-index: 99999;
        }
        #fcc_foldout_toggler {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 99998;   
        }
        #fcc_hamburger,
        #fcc_hamburger:before,
        #fcc_hamburger:after {
            position: relative;
            width: 25px;
            height: 3px;
            display: block;
            background: black;
            border-radius: 5px;
            content: '';
        }
        #fcc_hamburger:before {
            position: absolute;
            top: -6px;
        }
        #fcc_hamburger:after {
            position: absolute;
            bottom: -6px;
        }

        #fcc_foldout_menu label {
            top: 40px;
            left: 20px;
            position: absolute;
        }
        #fcc_foldout_menu select {
            top: 63px;
            left: 18px;
            position: absolute;
        }

        .fcc_foldout_buttons {
            position: absolute;
            left: 20px;
            height: 20px;
            width: 110px;
            padding: 10px;
            display: block; 
            font-size: 15px;
            line-height: 15px;
            text-align: center;
            border: none;
            outline: none;
            color: white;
            background-color: rgba(128, 128, 128, 0.7);
            border-radius: 4px;
            box-sizing: content-box !important;
            z-index: 0;
            cursor: pointer;
        }
        #fcc_test_message-box-rerun-button {
            top: 90px;
            transition: all .3s;    
        }
        #fcc_test_message-box-rerun-button:hover {
            color: white;
            background-color: black;
        }
        #fcc_test_button {
            top: 140px;
        }
        .fcc_test_btn-default {
            background-color: rgba(128, 128, 128, 0.7);
        }
        .fcc_test_btn-executing {
            background-color: rgba(255, 153, 0, 0.9);
        }
        .fcc_test_btn-error {
            background-color: rgba(255, 0, 0, 0.7);
        }
        .fcc_test_btn-success {
            background-color: rgba(81, 211, 81, 0.9);
        }

        #fcc_legend {
            position: absolute;
            top: 97px;
            left: 160px;
            height: 400px;
            width: 125px;
            vertical-align: top;
        }
        #fcc_legend span {
            height: 15px;
            margin-top: 6px;
            font-size: 12px;
        }
        .key {
            height: 15px;
            width: 15px;
            margin: 5px;
            vertical-align: top;
        }
        .key:first-of-type {
            background-color: rgba(255, 0, 0, 0.7);
        }
        .key:nth-of-type(2) {
            background-color: rgba(81, 211, 81, 0.9);
        }
        .key:nth-of-type(3) {
            background-color: rgba(255, 153, 0, 0.9);
        }
        .fcc_legend {
            position: relative;
            display: inline-block;
        }

        #fcc_test_suite_indicator {
            position: fixed;
            top: 15px;
            right: 20px;
            font-size: 12px;
            background-color: rgba(255, 255, 204, 0.6);
            padding: 3px 5px;
            border-radius: 5px;
        }
    </style>
    <span id="fcc_test_suite_indicator"></span>
    <div id="fcc_foldout_toggler">
        <span id="fcc_hamburger"></span>    
    </div>
    <input type="checkbox" id="toggle" title="CTRL + SHIFT + O">
    <div id="fcc_foldout_menu">
        <div id="fcc_foldout_menu_inner">
            <label for="test-suite-selector">Select Test Suite: </label>
            <select name="Test Suite Selector" id="test-suite-selector" onchange="FCC_Global.selectProject(this.value)">
                <option id="placeholder" value="">- - -</option>
                <option value="tribute-page">Tribute Page</option>
                <option value="portfolio">Personal Portfolio</option>
                <option value="survey-form">Survey Form</option>
                <option value="product-landing-page">Product Landing Page</option>
                <option value="technical-docs-page">Technical Documentation Page</option>
                <option value="random-quote-machine">Random Quote Machine</option>
                <option value="markdown-previewer">Markdown Previewer</option>
                <option value="drum-machine">Drum Machine</option>
                <option value="pomodoro-clock">Pomodoro Clock</option>
                <option value="javascript-calculator">Javascript Calculator</option>  
                <option value="bar-chart">Bar Chart</option>
                <option value="scatter-plot">Scatter Plot</option>
            </select>
            <button id="fcc_test_message-box-rerun-button" type="button" class="fcc_foldout_buttons" title="CTRL + SHIFT + ENTER" onclick="FCC_Global.FCCRerunTests()">
                Run Tests
            </button>
            <button id="fcc_test_button" type="button" class="fcc_foldout_buttons fcc_test_btn-default" title="CTRL + SHIFT + T" onclick="FCC_Global.FCCOpenTestModal()">
                Tests
            </button>
            <div id="fcc_legend">
                    <div class="fcc_legend key"></div><span class="fcc_legend">Test(s) Failed</span>  
                    <div class="fcc_legend key"></div><span class="fcc_legend">Tests Passed</span>
                    <div class="fcc_legend key"></div><span class="fcc_legend">Tests Executing</span>
            </div>
        </div>
    </div>
    <div id="fcc_test_message-box" class="fcc_test_message-box-hidden" onclick="FCC_Global.FCCclickOutsideToCloseModal(event)">
        <div class="fcc_test_message-box-content">
            <div class="fcc_test_message-box-header">
                <div class="title">Unit tests</div>
            </div>
            <div class="fcc_test_message-box-body">
                <div id="mocha">Run Test Suite to See Unit Tests!</div>
            </div>
            <div class="fcc_test_message-box-footer">
                <div class="fcc_test_message-box-close-btn" onclick="FCC_Global.FCCCloseTestModal()">Close</div>
            </div>
        </div>
        <div class="fcc_test_message-box-close-fixed" onclick="FCC_Global.FCCCloseTestModal()"></div>
    </div>`

export default test_suite_skeleton;
