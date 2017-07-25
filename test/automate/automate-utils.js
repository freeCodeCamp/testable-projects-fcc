/* global bundleUrl, browserMaxWidth, browserMaxHeight, screenshotDir,
   chromeBinaryPath.
 */
/*

 * Automates testing of a testable project. In a nutshell, it does everything
 * you would do if you had to test a testable FCC CodePen project manually.
 *
 * It uses Selenium to:
 * - Get the CodePen project webpage and change to the "Full Page" view.
 * - Optionally set the external javascript to a local bundle.js.
 * - Click on the "Run Tests" button.
 * - Wait for the "Tests" button to show failure or success.
 * - Click on the "Tests" button to see the results.
 * - Grab a screenshot of the results and save it to disk.
 *
 * Note that we tried to get headless Chrome to work running these tests but
 * there were intermitant failures, so that is not a viable option as of July
 * 2017. Perhaps a later version will work more reliably. In which case, we
 * no longer need Xvfb in the travis.yml file.
 */

let screenShotUniq = 0;

 // Grab a screenshot and write to disk.
 // TODO: Do we want to grab screenshots for success?
 const saveScreenshot = function(driver, screenshotDir, name, type) {

   const fileName =
     `test-result-${screenShotUniq}-${name.replace(/ /g, '-')}-${type}.png`;

   screenShotUniq++;

   return driver.takeScreenshot()
   .then(function(data) {
     if (data) {
       var base64Data = data.replace(/^data:image\/png;base64,/, '');
       fs.writeFile(
         path.join(screenshotDir, fileName),
         base64Data,
         'base64',
         function(err) {
          if (err) { console.log(err); }
         }
       );
     }
   });
 };

// Chromedriver is used by Selenium and requiring the module avoids having to
// download and install the executable from Google along with setting the path.
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "chromedriver" }] */
let chromedriver = require('chromedriver');

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

// Used to save screenshots.
const fs = require('fs');
const path = require('path');

exports.doesProjectPassTests = function(name, URL) {

  // If elements don't appear within 1 minute, it's usually an error.
  const elementTimeout = 60000;

  // If all of the project tests pass, this is set to true.
  let success = false;

  const chrome = require('selenium-webdriver/chrome');

  // Set up Chrome options. We use both "start-maximized" along with
  // "window-size" because some platforms prefer one or the other.
  let options = new chrome.Options();
  options.addArguments([
    'start-maximized',
    `window-size=${browserMaxWidth}x${browserMaxHeight}`
  ]);
  options.setChromeBinaryPath(chromeBinaryPath);

  // Create the browser.
  var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  // The following functions are defined below instead of outside this function
  // so we do not have to pass the 'driver' as a function parameter. It makes
  // the functions easier to use in a 'then' chain.

  // Locates an element and then clicks it.
  const clickElement = function(locator) {
    return driver.wait(
      until.elementLocated(locator),
      elementTimeout
    )
    .then(clickWhenVisible, errorFunc);
  };

  // Waits for an element to be visible, and then clicks it.
  const clickWhenVisible = function(element) {
    return driver.wait(
     until.elementIsVisible(element),
     elementTimeout
   )
   .then(function(element) {
     element.click();
     return element;
   },
   errorFunc);
  };

  // Waits for an element to have opacity of 1. Helps for waiting for elements
  // that fade in. Returns the element when the opacity reaches '1' so that
  // this can be chained with other promises.
  const waitOpacity = function(element) {
    return driver.wait(function() {
      return element.getCssValue('opacity')
      .then(function(opacity) {
        if (opacity === '1') {
          return element;
        } else {
          return false;
        }
      });
    });
  };

  // Handles errors. Saves a screenshot so we can see what the error is.
  const errorFunc = function(error) {
    // Ignore unexpected alert error, log all others.
    if (error.name === 'UnexpectedAlertOpenError') {
      console.log('Ignoring UnexpectedAlertOpenError');
      saveScreenshot(driver, screenshotDir, name, `ERROR-${error.name}`);
    } else {
      saveScreenshot(driver, screenshotDir, name, `ERROR-${error.name}`);
      console.error(error);
    }
  };

  // Test automation starts here.

  // Mac OS for some reason doesn't like the 'start-maximized' flag.
  // In some cases (e.g. Mac, headless Chrome) the "start-maximized" flag is
  // ignored, so we do this just in case.
  driver.manage().window().setPosition(0, 0);
  driver.manage().window().setSize(browserMaxWidth, browserMaxHeight);

  // Get the specified URL.
  driver.get(URL);

  // Change the CodePen view to put the editor on the left side, so it is easier
  // to see the project tests output.

  clickElement(By.id('view-switcher-button'));
  clickElement(By.id('left-layout'));
  // Need to click again to hide the view switcher.
  clickElement(By.id('view-switcher-button'));

  // Now we need to change some settings.

  // Click on the "Edit Settings" button, and then sleep because the settings
  // modal fades in.
  clickElement(By.id('edit-settings'));

  // Wait for the item settings modal.
  driver.wait(
    until.elementLocated(By.css('#item-settings-modal.open')),
    elementTimeout
  )
  .then(waitOpacity)
  .then(function(element) {
    driver.wait(
     until.elementIsVisible(element),
     elementTimeout
   );
  },
  errorFunc);

  // Click on "Behavior" settings tab.
  clickElement(By.id('settings-behavior-tab'));

  // Wait until it is the active tab.
  driver.wait(
    until.elementLocated(By.css('#settings-behavior.active')),
    elementTimeout
  )
  .then(function(element) {
    return driver.wait(
     until.elementIsVisible(element),
     elementTimeout
   );
  },
  errorFunc);

  // Make sure "Auto-Updating Preview" is not checked. This means we will need
  // to click the "Run" button after making changes. This is more reliable than
  // waiting for the page to refresh on its own.
  driver.wait(
    until.elementLocated(By.id('auto-run')),
    elementTimeout
  )
  .then(function(element) {
    return driver.wait(
     until.elementIsVisible(element),
     elementTimeout
   );
  })
  .then(function(elementAutoRun) {
     return elementAutoRun.getAttribute('checked')
    .then(function(checked) {
      if (checked) {
        elementAutoRun.click();
      }
    });
  })
  .catch(errorFunc);

  // This next section changes the javascript settings to remove the CDN
  // bundle.js and use our local bundle.js from the URL specified in the Mocha
  // setup.js file. Note you must have a setup.js file and set
  // global.bundleUrl for this section to execute.
  if ('undefined' !== typeof bundleUrl) {
    // Click on javascript settings.
    clickElement(By.id('settings-js-tab'));

    // Find the bundle.js input row and set it to blank.
    // TODO: Put the var declaration elsewhere.
    var javascriptRows = driver.findElements(
      By.className('js-resource external-resource tt-input')
    );

    javascriptRows.then(function(webElems) {
      webElems.forEach(function(elem) {
        var value = elem.getAttribute('value');
        value.then(function(val) {
          if (val.includes('bundle.js', 0)) {
            elem.clear();
            elem.sendKeys(bundleUrl);
          }
        });
      });
    });
  }

  // We are done changing the settings. Close the modal.
  clickElement(By.id('close-settings'));

  // Re-run the web page and detect when is reloaded. The way we do this is a
  // little tricky. We get the current "results" iframe and then
  // later (after clicking "Run") we detect when it is no longer present.
  // Which means the new iframe will load.
  let iframeElem = driver.wait(
    until.elementLocated(By.className('result-iframe')),
    elementTimeout
  );

  // Now we click the run button...
  clickElement(By.id('run'));

  // And wait for the previous iframe to no longer exist, because CodePen
  // creates a new iframe for the output on each click of "Run".
  driver.wait(
    until.stalenessOf(iframeElem),
    elementTimeout
  )
  .catch(errorFunc);

  // Switch to the CodePen output frame. This is the frame where the
  // newly refreshed project web page is displayed.
  driver.wait(
    until.ableToSwitchToFrame(By.className('result-iframe')),
    elementTimeout
  );

  // Run the tests by clicking our test button after the element appears.
  clickElement(By.id('fcc_test_message-box-rerun-button'));

  // Wait for the "success" or "error" class to be added to the "Tests" button.
  clickElement(By.css('.fcc_test_btn-error, .fcc_test_btn-success'))
  .then(function(element) {
    return element.getAttribute('class');
  })
  .then(function(classes) {
    success = classes.includes('fcc_test_btn-success', 0);
  },
  errorFunc);

  // Wait for the test results modal. The message box fades in, so we wait for
  // opacity of 1 before grabbing the screenshot.
  driver.wait(until.elementLocated(
    By.className('fcc_test_message-box-shown')),
    elementTimeout
  )
  .then(function(elem) {
    return driver.wait(function() {
      return elem.getCssValue('opacity')
      .then(function(opacity) {
        return opacity === '1';
      });
    });
  },
  errorFunc);

  // Grab a screenshot and write to disk.
  // TODO: Do we want to grab screenshots for success? Might be overkill.
  saveScreenshot(driver, screenshotDir, name, 'FINAL');

  // We are done. Close the browser and return with success status. We return
  // the promise so Mocha will wait correctly for these tests to finish.
  return driver.quit()
  .then(function() {
    return success;
  });
};
