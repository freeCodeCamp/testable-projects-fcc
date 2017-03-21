# Contribution Guide

## If you have not contributed to this repo before:
- If you find a bug in a test suite or in an individual test, please open an issue.
- If the bug can be confirmed, we will let you know, and if you would like to begin working on fixing the bug, please follow the guidelines below.

### In general:
- Fork, clone locally, install dependencies.
- Please make all PRs against a branch you have created specifically to address the issue you are fixing.
- In order to keep things in scope for this bundle, we have defined a global library object called `FCC_Global`; Chai's `assert` is being exported and can be accessed through this object, as can all of our Utility Functions as defined in `index.js`, e.g.:

```javascript
`FCC_Global.assert.isAtLeast(awesomeness.length, 10000000, 'your awesomeness is too short');`
```
OR

```javascript
`FCC_Global.FCCInitTestRunner()`
```
- Be sure to run `npm run build` to create a new bundle before you add, commit, and push your changes.

### For fixing test suite bugs / adding new test suites:
- All tests suites should use only existing dependencies (Mocha, Chai, jQuery).
- We are using Chai's `assert` library.
- Wherever possible, try to avoid using jQuery in your tests, if there is a simple and easy JS equivalent that should take precedence.
- If you do use jQuery as a fallback, you must import `jQuery` into your test suite file before exporting your test function.
- **BREAKING CHANGES:** 
    - Please test all of your changes against FCC's [existing example project](http://codepen.io/collection/npZPmR) for whatever project you are working on. If the changes you make cause the example project to fail any tests, this is considered a breaking change, as it could cause other Campers' past solutions to fail. This should, in general, be avoided once freeCodeCamp is no longer in beta, as we do not want to break too many past projects. If you feel that this is a change that is ABSOLUTELY NECESSARY, please discuss this with @no-stack-dub-sack or @QuincyLarson. 
		- If the new freeCodeCamp curriculum is still in beta and you make a breaking change, but please be sure to include in your PR a forked version of the official project with updated code that passes all new and existing tests.  Advise one of the above people so that the official project can be changed accordingly if your changes are accepted. 
- Each exported test suite must be imported into `index.js`, and a corresponding variable name and call to the imported function must be added to the `switch` in `index.js`. Additionally, for the test suite to appear as an option in the drop-down menu, a new `<option>` tag must be added to the `<select>` in the HTML found in `test_suite_skeleton.js` (which starts somewhere around line 320). The `value` attribute of the `<option>` must be the same as the variable added to the switch statement. 
- Please follow naming conventions for naming files and functions.

### To test your code locally:
- Import the code from the [official FCC example project](http://codepen.io/collection/npZPmR) that you are creating/editing the test suite for into the `local_test` directory:
	- Create folders for your code, i.e. JS, CSS, etc. (NOTE: even if your project does not have JS, you **MUST** create a folder called **JS** - this is where bundle.js will be created).
	- Include the JS & CSS (if using SCSS or LESS, compile down to CSS first) in the folders you created in `local_test/`.
	- Modify index.html to point to your files and include any other external resources you need (e.g. React, jQuery, D3, FontAwesome, etc.).
	- **NOTE:** Before you push your changes, please be sure to return index.html to its original state.
- Run `npm start` to start watching your files for changes.
- Then, in another terminal tab navigate into the `local_test` directory and run `live-server`.
- Now your changes to the test files will be automatically bundled by webpack and served in the project that is running locally.
- Your changes will not be saved to the bundle we're using for production until you run `npm run build`.
- As a less desireable alternative, you can push your changes to your fork of this repo and utilize rawgit.com for a CDN style link that you can use to populate the test suite in CodePen or wherever else (use the right hand, non-production link).

### For adding functionality to the test suite itself:
- All "utility functions" are in `index.js` and are called from `test_suite_skeleton.js`, again, through the `FCC_Global` object.
- Take a look at how everything works... If you think you have a feature that would improve functionality, go ahead and open an issue and/or implement it on your end and see how it works. 
- If it looks good to you and you think this represents an improvement, go ahead and submit a PR.

### Bundle CDNs:
- FOR PRODUCTION: https://gitcdn.link/repo/freeCodeCamp/testable-projects-fcc/master/build/bundle.js
  - will not throttle our traffic
  - can take 2hrs or more to propagate changes to all users
- FOR DEV: https://rawgit.com/freeCodeCamp/testable-projects-fcc/master/build/bundle.js
  - will throttle heavy traffic
  - changes will propagate much quicker so replace the gitCDN link with this for testing 