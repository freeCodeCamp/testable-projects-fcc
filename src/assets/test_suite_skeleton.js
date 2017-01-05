const test_suite_skeleton = `
    <style>
        @import url('https://fonts.googleapis.com/css?family=Noto+Sans');

        /* TEST/MESSAGE CENTER CSS */ 

        #fcc_test_message-box {
            font-size: 20px !important;
            font-family: Noto Sans, arial, sans-serif !important;
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
            margin: 0 auto !important;
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
            box-sizing: border-box !important;
            padding: 10px !important;
        }
        .fcc_test_message-box-header {
            border-bottom: 1px solid rgb(229,229,229);
        }
    
        .fcc_test_message-box-header .title {
            float: left;
            font-size: 30px !important;
            line-height: 40px !important;
            margin-left: 10px !important;
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
            padding: 10px 20px !important;
            transition: all .3s;
        }
        .fcc_test_message-box-close-btn:hover {
            color: white;
            background-color: black;
        }

        #mocha {
            margin: 10px !important;
        }
        #mocha .test pre {
            background-color: rgb(245, 245, 245);
        }
        #mocha-stats {
            position: absolute;
        }
        #mocha ul {
            max-width: initial;
            margin: initial !important;
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
            font-family: Noto Sans, arial, sans-serif !important;
            font-size: 30px !important;
            font weight: bold;
            content: "X";
            line-height: 30px !important;
        }

        /* FOLDOUT MENU CSS */

        #fcc_foldout_menu {
            position: absolute;
            top: 0;
            left: -320px;
            width: 320px;
            height: 195px;
            border-bottom-right-radius: 5px;
            background-color: rgba(255, 255, 204, 0.6);
            z-index: 99997;
            font-family: Noto Sans, arial, sans-serif !important;
            box-shadow: 1px 1px 10px rgba(128, 128, 128, 0.6);
            transition: .5s;
        }
        input[type=checkbox]:checked ~ #fcc_foldout_menu {
            left: 0;
            transition: .5s ease-in-out;
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

        .fcc_hamburger {
            position: relative;
            width: 25px;
            height: 3px;
            display: block;
            background: black;
            border-radius: 5px;
            content: '';
            transform-origin: 4px 0px;
            transition: transform 0.4s ease, opacity 0.55s ease;
        }
        #hamburger_top {
            position: absolute;
            top: -6px;
            transform-origin: 0% 80%;
        }
        #hamburger_bottom {
            position: absolute;
            bottom: -6px;
            transform-origin: 20% 80%;
        }
        .transform_top {
            opacity: 1;
            transform: rotate(45deg) translate(-2px, -1px);
        }
        .transform_middle {
            opacity: 0;
            transform: rotate(0deg) scale(0.2, 0.2);
        }
        .transform_bottom {
            opacity: 1;
            transform: rotate(-45deg) translate(-1px, -1px);
        }

        #fcc_foldout_menu label {
            top: 38px;
            left: 20px;
            position: absolute;
            font-size: 15px !important;
        }
        #fcc_foldout_menu select {
            top: 61px;
            left: 18px;
            position: absolute;
            font-family: Noto Sans, Arial, sans-serif !important;
        }

        .fcc_foldout_buttons {
            position: absolute;
            left: 20px;
            height: 20px;
            width: 110px;
            padding: 10px !important;
            display: block; 
            font-size: 15px !important;
            line-height: 15px !important;
            text-align: center;
            border: none;
            outline: none;
            color: white;
            background-color: rgba(128, 128, 128, 0.7);
            border-radius: 4px;
            box-sizing: content-box !important;
            z-index: 0;
            cursor: pointer;
            box-shadow: 1px 1px 4px black;
            font-family: Noto Sans, arial, sans-serif !important;
        }
        #fcc_test_message-box-rerun-button {
            top: 88px;
            transition: all .3s;    
        }
        #fcc_test_message-box-rerun-button:hover {
            color: white;
            background-color: black;
        }
        #fcc_test_button {
            top: 138px;
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

        #fcc_legend_wrapper {
            position: absolute;
            top: 95px;
            left: 160px;
            height: 400px;
            width: 125px;
            vertical-align: top;
            text-align: left !important;
            font-size: 15px;
        }
        #fcc_legend_wrapper span {
            height: 15px;
            margin-top: 6px !important;
            font-size: 12px  !important;
        }
        .key {
            height: 15px;
            width: 15px;
            margin: 5px !important;
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

        #fcc_test_suite_indicator_wrapper {
            position: fixed;
            top: 15px;
            right: 20px;
        }
        #fcc_test_suite_indicator {
            position: fixed;
            top: 15px;
            right: 20px;
            font-size: 12px !important;
            background-color: rgba(255, 255, 204, 0.6);
            padding: 3px 5px !important;
            border-radius: 5px;
            box-shadow: 1px 1px 10px rgba(128, 128, 128, 0.6);
            font-family: Noto Sans, arial, sans-serif !important;
        }
    </style>
    <div id="fcc_test_suite_indicator_wrapper"></div>
    <div id="fcc_foldout_toggler">
        <span id="hamburger_top" class="fcc_hamburger"></span>    
        <span id="hamburger_middle" class="fcc_hamburger"></span>  
        <span id="hamburger_bottom" class="fcc_hamburger"></span>      
    </div>
    <input id="toggle" onclick="FCC_Global.hamburger_transform()" type="checkbox" title="CTRL + SHIFT + O">
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
                <option value="choropleth">Choropleth</option>
            </select>
            <button id="fcc_test_message-box-rerun-button" type="button" class="fcc_foldout_buttons" title="CTRL + SHIFT + ENTER" onclick="FCC_Global.FCCRerunTests()">
                Run Tests
            </button>
            <button id="fcc_test_button" type="button" class="fcc_foldout_buttons fcc_test_btn-default" title="CTRL + SHIFT + T" onclick="FCC_Global.FCCOpenTestModal()">
                Tests
            </button>
            <div id="fcc_legend_wrapper">
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
    </div>`;

export default test_suite_skeleton;
