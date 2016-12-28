const test_HTML = `
  <style>
    .fcc_test_message-box-rerun-button {
      position: fixed;
      height: 30px;
      width: 140px;
      z-index: 100000;
      top: 10px; 
      left: 10px; 
      font-size: 20px;
      font-family: Arial, sans-serif;
      text-align: center;
      line-height: 30px;
      color: white;
      background-color: rgba(128, 128, 128, 0.7);
      border-radius: 4px;
      padding: 10px 0 !important;
      transition: all .3s;
      box-sizing: content-box !important;
      /*visibility: hidden;*/
    }
    .fcc_test_message-box-rerun-button:hover {
      color: white;
      background-color: black;
    }
    #fcc_test_button {
      color: white;
      font-size: 20px;
      font-family: Arial, sans-serif;
      position: fixed; 
      left: 10px;
      top: 70px;
      z-index: 100000;
      height: initial;
      width: 140px;
      padding: 15px;
      border: none;
      outline: none;
      border-radius: 4px;
    }
    .fcc_test_btn-default {
      background-color: rgba(128, 128, 128, 0.7);
    }
    .fcc_test_btn-error {
      background-color: rgba(255, 0, 0, 0.7);;
    }
    .fcc_test_btn-success {
      background-color: rgba(81, 211, 81, 0.9);
    }

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
      z-index: 100001;
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
  </style>
      <div class="fcc_test_message-box-rerun-button" title="CTRL + SHIFT + ENTER" onclick="FCC_Global.FCCRerunTests()">
        Run Tests
      </div>
  <button id="fcc_test_button" type="button" class="fcc_test_btn-default"
          onclick="FCC_Global.FCCOpenTestModal()">
    ...
  </button>
  <div id="fcc_test_message-box" class="fcc_test_message-box-hidden" onclick="FCC_Global.FCCclickOutsideToCloseModal(event)">
    <div class="fcc_test_message-box-content">
      <div class="fcc_test_message-box-header">
        <div class="title">Unit tests</div>
      </div>
      <div class="fcc_test_message-box-body">
        <div id="mocha"></div>
      </div>
      <div class="fcc_test_message-box-footer">
        <div class="fcc_test_message-box-close-btn" onclick="FCC_Global.FCCCloseTestModal()">Close</div>
      </div>
    </div>
    <div class="fcc_test_message-box-close-fixed" onclick="FCC_Global.FCCCloseTestModal()"></div>
  </div>`

  export default test_HTML;