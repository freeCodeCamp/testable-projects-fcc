/* global bundleUrl, browserMaxWidth, browserMaxHeight, screenshotDir,
   chromeBinaryPath, firefoxBinaryPath
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
 */

// Used to save screenshots.
const fs = require('fs');
const path = require('path');

let screenShotUniq = 0;

// Chromedriver and geckodriver are used by Selenium and requiring the module
// avoids having to download and install the executable from Google
// along with setting the path.
/* eslint no-unused-vars: ["error", {
    "varsIgnorePattern": "chromedriver|geckodriver"
   }] */
let chromedriver = require('chromedriver');
let geckodriver = require('geckodriver');

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

exports.doesProjectPassTests = (browser, name, URL) => {

  // If elements don't appear within 1 minute, it's usually an error.
  const elementTimeout = 60000;

  // If all of the project tests pass, this is set to true.
  let success = false;

  // headless mode for chrome and firefox is enabled by default
  let headless = process.env.HEADLESS !== '0';

  let capabilities;

  if (browser === 'chrome') {

    // Set up Chrome options.
    const chrome = require('selenium-webdriver/chrome');
    let chromeOptions = (new chrome.Options())
      .addArguments([
        // Decrease log output, on Windows it's verbose.
        'log-level=3',
        // Some of the tests make noise, so turn off the sound.
        'mute-audio'
      ])
      .setChromeBinaryPath(chromeBinaryPath);
    if (headless) {
      chromeOptions.headless();
    }

    capabilities = chromeOptions.toCapabilities();

  } else if (browser === 'firefox') {

    // Set up Firefox options.
    const firefox = require('selenium-webdriver/firefox');
    let profile = new firefox.Profile();
    // Some of the tests make noise, so turn off the sound.
    profile.setPreference('media.volume_scale', '0.0');
    let firefoxOptions = (new firefox.Options())
      .setProfile(profile)
      .setBinary(firefoxBinaryPath);
    if (headless) {
      firefoxOptions.headless();
    }

    capabilities = firefoxOptions.toCapabilities();

  } else {
    throw new Error(`Browser ${browser} is not supported`);
  }

  // For tests purpose, we use a self-signed certificate, so accept
  // insecure certificates
  capabilities.set('acceptInsecureCerts', true);

  // Create the browser.
  let driver = new webdriver.Builder()
    .withCapabilities(capabilities)
    .build();

  // The following functions are defined below instead of outside this function
  // so we do not have to pass the 'driver' as a function parameter. It makes
  // the functions easier to use in a 'then' chain.

  // Grab a screenshot and write to disk.
  // TODO: Do we want to grab screenshots for success?
  const saveScreenshot = (name, type) => {

    const fileName =
      `test-result-${screenShotUniq}-${browser}-` +
      `${name.replace(/[ :]/g, '_')}-${type}.png`;

    screenShotUniq++;

    return driver.takeScreenshot()
      .then(data => {
        if (data) {
          var base64Data = data.replace(/^data:image\/png;base64,/, '');
          return fs.writeFile(
            path.join(screenshotDir, fileName),
            base64Data,
            'base64',
            err => {if (err) { console.log(err); }}
          );
        }
        return null;
      });
  };

  // Locates an element and then clicks it.
  const clickElement = locator => driver.wait(
      until.elementLocated(locator),
      elementTimeout
    )
    .then(clickWhenVisible);

  // Waits for an element to be visible, and then clicks it.
  const clickWhenVisible = element => driver.wait(
      until.elementIsVisible(element),
      elementTimeout
    )
    .then(element => element.click().then(() => element));

  // Waits for an element to have opacity of 1. Helps for waiting for elements
  // that fade in. Returns the element when the opacity reaches '1' so that
  // this can be chained with other promises.
  const waitOpacity = element => driver.wait(() => (
    element.getCssValue('opacity')
    .then(opacity => (opacity === '1') ? element : false)
  ));

  // Handles errors. Saves a screenshot so we can see what the error is.
  const errorFunc = error => {
      console.error(error);
      return saveScreenshot(name, `ERROR-${error.name}`);
  };

  // Alert appears only once.
  let accepted = false;
  const acceptAlert = () => {
    if (accepted) { return null; }
    return driver.wait(until.alertIsPresent(), 10000)
      .then(
        () => {
          accepted = true;
          return driver.switchTo().alert().accept();
        },
        () => 'do nothing'
      );
  };

  // Test automation starts here.

  // Firefox doesn't have an option to maximize the window
  // So we set the size here.
  return driver.manage().window().setPosition(0, 0)
  .then(() => driver.manage().window()
    .setSize(browserMaxWidth, browserMaxHeight)
  )

  // Get the specified URL.
  .then(() => driver.get(URL))

  // Will not be needed after deploy
  .then(acceptAlert)

  // Change the CodePen view to put the editor on the left side, so it is easier
  // to see the project tests output.
  .then(() => clickElement(By.id('view-switcher-button')))
  .then(() => clickElement(By.id('left-layout')))
  // Need to click again to hide the view switcher.
  .then(() => clickElement(By.id('view-switcher-button')))

  // Now we need to change some settings.

  // Click on the "Edit Settings" button, and then sleep because the settings
  // modal fades in.
  .then(() => clickElement(By.id('edit-settings')))

  // Wait for the item settings modal.
  .then(() => driver.wait(
    until.elementLocated(By.css('#item-settings-modal.open')),
    elementTimeout
  ))
  .then(waitOpacity)
  .then(element => driver.wait(
    until.elementIsVisible(element),
    elementTimeout
  ))

  // Click on "Behavior" settings tab.
  .then(() => clickElement(By.id('settings-behavior-tab')))

  // Wait until it is the active tab.
  .then(() => driver.wait(
    until.elementLocated(By.css('#settings-behavior.active')),
    elementTimeout
  ))
  .then(element => driver.wait(
    until.elementIsVisible(element),
    elementTimeout
  ))

  // Make sure "Auto-Updating Preview" is not checked. This means we will need
  // to click the "Run" button after making changes. This is more reliable than
  // waiting for the page to refresh on its own.
  .then(() => driver.wait(
    until.elementLocated(By.id('auto-run')),
    elementTimeout
  )
  .then(element => driver.wait(
     until.elementIsVisible(element),
     elementTimeout
  ))
  .then(elementAutoRun => elementAutoRun.getAttribute('checked')
    .then(checked => checked ? elementAutoRun.click() : null)
  ))

  // This next section changes the javascript settings to remove the CDN
  // bundle.js and use our local bundle.js from the URL specified in the Mocha
  // setup.js file. Note you must have a setup.js file and set
  // global.bundleUrl for this section to execute.
  .then(() => clickElement(By.id('settings-js-tab')))
  // Wait until it is the active tab.
  .then(() => driver.wait(
    until.elementLocated(By.css('#settings-js.active')),
    elementTimeout
  ))
  .then(element => driver.wait(
    until.elementIsVisible(element),
    elementTimeout
  ))

  // Find the bundle.js input row and set it to bundleUrl.
  .then(() => driver.findElements(
    By.css("input[class*='js-resource external-resource'][value*='bundle.js']")
  ))
  .then(rows => [].slice.call(rows)
    .reduce((P, elem) => (
      // Without ' ' works wrong in Firefox
      P.then(() => elem.clear().then(() => elem.sendKeys(bundleUrl + ' ')))
    ), Promise.resolve(''))
  )

  // We are done changing the settings. Close the modal.
  .then(() => clickElement(By.id('close-settings')))

  // Re-run the web page and detect when is reloaded. The way we do this is a
  // little tricky. We get the current "results" iframe and then
  // later (after clicking "Run") we detect when it is no longer present.
  // Which means the new iframe will load.
  .then(() => driver.wait(
    until.elementLocated(By.className('result-iframe')),
    elementTimeout
  ))

  // Now we click the run button...
  .then(iframeElement => {
    clickElement(By.id('run'));
    return driver.wait(
      until.stalenessOf(iframeElement),
      elementTimeout
    );
  })

  // Switch to the CodePen output frame. This is the frame where the
  // newly refreshed project web page is displayed.
  .then(() => driver.wait(
    until.ableToSwitchToFrame(By.className('result-iframe')),
    elementTimeout
  ))

  // Wait for the page to finish loading. In some cases, just for example the
  // D3 projects, projects are loading remote data, so we have to be generous
  // here.
  // TODO: A better way to do this is to change all of the example projects to
  // set a variable such as 'fccTestableProjectsDataLoaded', and then we can
  // wait for that variable to be true. But that will require changing every
  // example project.
  .then(() => driver.sleep(2000))

  .then(() => driver.wait(
    until.elementLocated(By.id('fcc_test_suite_wrapper')),
    elementTimeout
  ))

  // Run the tests by clicking our test button after the element appears.
  // In order to click anything inside the Shadow DOM, we need to locate by
  // webdriver.By.js, which uses webdriver.executeScript internally. It accepts
  // a stringified Function as the first argument and an additional argument --
  // in this case the element, #fcc_test_suite_wrapper
  // More info in https://stackoverflow.com/a/21125803/3530394 and
  // https://www.codesd.com/item/access-to-the-elements-in-the-shadow-dom.html
  // and in the jsdocs for `selenium-webdriver/by.js`

  .then(wrapper => clickElement(
    By.js(wrapper => (
        (wrapper.shadowRoot ? wrapper.shadowRoot : wrapper)
          .querySelector('#fcc_test_message-box-rerun-button')
      ),
      wrapper
    ))
    .then(() => wrapper)
  )

  // Wait for 'fcc_test_btn-done' class to be added to the 'Tests' button
  // then click
  .then(wrapper => clickElement(
    By.js(wrapper => (
        (wrapper.shadowRoot ? wrapper.shadowRoot : wrapper)
          .querySelector('.fcc_test_btn-done')
      ),
      wrapper
    ))
    .then(element => element.getAttribute('class'))
    .then(classes => {
      success = classes.includes('fcc_test_btn-success', 0);
      return wrapper;
    })
  )

  // Wait for the test results modal. The message box fades in, so we wait for
  // opacity of 1 before grabbing the screenshot.
  .then(wrapper => driver.wait(until.elementLocated(
    By.js(wrapper => (
        (wrapper.shadowRoot ? wrapper.shadowRoot : wrapper)
          .querySelector('.fcc_test_message-box-shown')
      ),
      wrapper
    )),
    elementTimeout
  ))
  .then(waitOpacity)

  // Grab a screenshot and write to disk.
  // TODO: Do we want to grab screenshots for success? Might be overkill.
  .then(() => saveScreenshot(name, 'FINAL'))

  // Catches all possible errors.
  .catch(errorFunc)
  // We are done. Close the browser and return with success status. We return
  // the promise so Mocha will wait correctly for these tests to finish.
  .then(() => driver.quit())
  .then(() => success, () => success);
};
