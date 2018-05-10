# Contribution Guide

## If you have not contributed to this repo before:
- If you find a bug in a test suite or in an individual project test, please
open an issue.
- If the bug can be confirmed, we will let you know, and if you would like to
begin working on fixing the bug, please follow the guidelines below.

### In general:
- Fork, clone locally, and install dependencies using `npm install`.
- Please make all PRs against a branch you have created specifically to address the issue you are fixing.
- In order to keep things in scope for this bundle, we have defined a global library object called `FCC_Global`; Chai's `assert` is being exported and can be accessed through this object, as can all of our Utility Functions as defined in `index.js`, e.g.:

```javascript
`FCC_Global.assert.isAtLeast(awesomeness.length, 10000000, 'your awesomeness is too short');`
```
OR

```javascript
`FCC_Global.FCCInitTestRunner()`
```

You can see examples of the above in the `src/project-tests` directory.

- Be sure to run `npm run build` to create a new bundle.

- Be sure to test all your changes to the bundle locally by running `npm test`.
Make sure all tests pass before you create a PR. See the section below
about [Automated Testing](#automated-testing).

### For fixing project test suite bugs / adding new project test suites:
- All tests suites should use only existing dependencies (Mocha, Chai, jQuery).
- We are using Chai's `assert` library.
- Wherever possible, try to avoid using jQuery in your tests, if there is a simple and easy JS equivalent that should take precedence.
- If you do use jQuery as a fallback, you must import `jQuery` into your test suite file before exporting your test function.
- **BREAKING CHANGES:**
    - Please test all of your changes against FCC's [existing example project](http://codepen.io/collection/npZPmR) for whatever project you are working on. If the changes you make cause the example project to fail any tests, this is considered a breaking change, as it could cause other Campers' past solutions to fail. This should, in general, be avoided once freeCodeCamp is no longer in beta, as we do not want to break too many past projects. If you feel that this is a change that is ABSOLUTELY NECESSARY, please discuss this with @no-stack-dub-sack or @QuincyLarson.
    - If the new freeCodeCamp curriculum is still in beta and you make a breaking change, but please be sure to include in your PR a forked version of the official project with updated code that passes all new and existing tests.  Advise one of the above people so that the official project can be changed accordingly if your changes are accepted.
- Each exported test suite must be imported into `index.js`, and a corresponding variable name and call to the imported function must be added to the `switch` in `index.js`. Additionally, for the test suite to appear as an option in the drop-down menu, a new `<option>` tag must be added to the `<select>` in the HTML found in `test-suite-skeleton.js` (which starts somewhere around line 320). The `value` attribute of the `<option>` must be the same as the variable added to the switch statement.
- Please follow naming conventions for naming files and functions.

### For adding functionality to the project test suite itself:
- All "utility functions" are in `index.js` and are called from `test-suite-skeleton.js`, again, through the `FCC_Global` object.
- Take a look at how everything works... If you think you have a feature that would improve functionality, go ahead and open an issue and/or implement it on your end and see how it works.
- If it looks good to you and you think this represents an improvement, go ahead and submit a PR.

### Bundle CDNs:
- FOR PRODUCTION: https://gitcdn.link/repo/freeCodeCamp/testable-projects-fcc/master/build/bundle.js
  - will not throttle our traffic
  - can take 2hrs or more to propagate changes to all users
- FOR DEV: https://rawgit.com/freeCodeCamp/testable-projects-fcc/master/build/bundle.js
  - will throttle heavy traffic
  - changes will propagate much quicker so replace the gitCDN link with this for testing

### Automated testing

Running tests locally, summary:

```
npm test
```

If this is your first time testing, you will need to do some setup before the
above command will work (see the [Setup section](#setup)).

#### Motivation
To better understand why we automated the testing of this project, you could
optionally read the section below on
[To test your code locally](#to-test-your-code-locally). The steps there only
test one CodePen sample project and it will easily take you more than ten
minutes to do this manually. If you were to make a change in one of the
programs shared by all the projects, you would have to repeat those steps more
than a dozen times, and it would take a good hour or so of your time.

To further motivate you, sometimes when testing the code manually and
locally, your changes will work but then fail in the CodePen environment!

By using the automated tests, you can make sure your changes work for all the
sample CodePens in the CodePen environment and in less than five minutes for
*all* the projects, and while working on something else.

So it is well worth it to go through the setup steps below, most of which only
need to be run one time.

#### Setup
1. You should have already run `npm install` per the forking instructions.
1. Make sure you have the Chrome browser installed. You should have version
59.0.3071.115 or later.
1. To make your local `bundle.js` available via https you will need to create
server certificates (see below).
1. You need to configure your test environment by setting up the `test/setup.js`
file (see below).


**Creating Self-Signed Server Certificates**

In order to serve your local bundle.js and test it, you need to use https. We
have done most of the work for you, but you will need to run a few quick
commands. The below works for both Linux and Mac. (YMMV for Windows, and please
update these docs if you figure out how to do this for Windows).

Create the Certificates
- Make sure you have OpenSSL installed.
- From this project's root directory run the following and follow the prompts.
You will need to enter a passphrase (which you will need later), and the answers
to the other questions do not matter so put whatever you want:

```
cd config
openssl genrsa -des3 -out server.key 2048
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
cp live-server-https.example live-server-https.js
```

You should now have the following files in your `config` directory:

```
live-server-https.js
live-server-https.js.example
server.crt
server.csr
server.key
```

Edit the `live-server-https.js` file and change the passphrase to what you used
above. (The `live-server-https.js` file along with your certificates are all
ignored by git, so you don't need to worry about your passphrase being committed
to the repo and the files should be safe from being overwritten once you create
them).

If for some reason these files get clobbered, you can safely re-run the above
commands to recreate the certs.

You can test your work by running the following command:

```
npm run live-serve-build
```

You should see something like the following:

```
> webpack-test@1.0.0 live-serve-build /home/foobar/testable-projects-fcc
> live-server --no-browser --https=config/live-server-https build

Serving "build" at https://127.0.0.1:8080
Ready for changes
```

Save the above address (e.g. https://127.0.0.1:8080) for configuring `setup.js`
in the section below.

You can leave this command running, and every time you rebuild the `bundle.js`,
it will automatically detect the change and reload.

**Configuring your test environment with setup.js**

If you do not already have a `test/setup.js` file, copy the example file to get
you started. From the project root directory:

```
cp test/setup.js.example test/setup.js
```

Now you can edit the `test/setup.js` file and to reflect your environment. It
is well documented inside the file and the defaults should work but at the very
least you will have to choose a value for `global.chromeBinaryPath`.

NOTE: If the address used by `npm run live-serve-build` from the section above
is different from `https://127.0.0.1:8080` you will also need to change the
value of `global.bundleUrl` accordingly.

(The `setup.js` file is ignored by git, so you can be sure it won't be
overwritten by other contributers once you have created it).

**Testing using your local bundle.js file**

This is the most common scenario and requires all of the previously listed steps.

Should be obvious, and you should have already done this, but if you want to
test your local `bundle.js` changes, make sure you have built the bundle first:

```
npm run build
```

Per the previous section, in a separate window, make sure your `bundle.js` is
available via https:

```
npm run live-serve-build
```

Leave that running. And in a new window, you can run the tests:

```
npm test
```

If everything is set up correctly, you should see the following happen
automatically:
1. Chrome browser starts.
1. The URL for one of the sample CodePen projects loads.
1. Layout is changed for better viewing.
1. External javascript settings are changed to use your local copy of bundle.js.
1. The CodePen is re-run to get the new bundle.js.
1. The "Run Tests" button is clicked and the script waits for test to complete.
1. The "Tests" button is clicked to see the test output.
1. A screenshot of the results is saved.
1. Move on to the next CodePen by returning to step 1.

You will find screenshots of all the test results in the `test/screenshots`
directory (or the directory you configured in your `test/setup.js` file).

#### Testing tips

**Turn your volume down**

Some of the tests make noise, so if you are in an environment where that is not
desirable, or you just don't want to scare yourself, you might want to turn your
volume low or off.

**Running just one test**

Many times you are only changing the tests for one CodePen sample project. You
can run the tests for one project by using the Mocha grep command line flag. For
example, the following will run only the D3 Tree Map test. Note the use of
`$(npm bin)` which should be typed in full since it locates the npm bin
directory no matter where you are in the project directory:

```
$(npm bin)/mocha -g 'D3 Tree'
```

For the names used by the grep option, see the `name` attribute in the
`tests` array at the top of the `tests/codepen-project.js` file.

**Running Chrome in a headless environment**

Although it looks kind of magic to see the automated tests run inside Chrome the
first few times, and it can be useful for debugging, it gets annoying quickly
because the browser popping up interferes with other work.

We tried to get headless Chrome (very new as of July 2017) to work but it had a
lot of problems.

In the meantime, you can use the tried and trusted method of running a virtual
screen via the `Xvfb` command. You may need to install the command first.

In a separate window run the following command:

```
Xvfb :99 -screen 0 1920x1080x16
```

And then using the `:99` and (-screen) `0` values from above you run the tests
like this:

```
DISPLAY=':99.0' npm test
```

The tests will now run on the virtual display without popping up the browser.

Running a single test works similarly:

```
DISPLAY=':99.0' $(npm bin)/mocha -g 'D3 Tree'
```

**Capturing video of the tests**

If you use a virtual display, it's pretty easy to capture everything on video,
which can be useful for debugging when the screenshots don't tell you enough.
Run the following just before you start the tests. Note the `:99.0` from above:

```
ffmpeg -video_size 1920x1080 -framerate 10 -f x11grab -i :99.0 -crf 36 test-output.mp4
```

Remember to kill the command (ctrl-c?) when your tests finish!

The framerate is set low and the compression high to keep the video output file
small, but if the video quality is not good enough, you can increase the
`-framerate` value and / or lower the `-crf` value.

#### Port 8080
Note that the `npm run serve-https-local` command may choose a different port
if 8080 is already in use. You will either have to adjust your `test/setup.js`
file to reflect what port the serve-https-local script uses, or make sure port
8080 is not in use before running the script.

#### Mac Retina display
On Mac Retina displays, the value your system gives you for display is
double what you need to put in the `test/setup.js` file. For example, if your
system settings say your resolution is 2880×1800 then you would put the
following in your `test/setup.js`:

```
global.browserMaxWidth = 1440;
global.browserMaxHeight = 900;
```

#### Dependencies
Much like the project tests, we use Mocha and Chai. For automating the browser
we also use Selenium, chromedriver, and serve-https. Please be cautious about
adding new dependencies unless absolutely needed.

#### Travis CI
The automated tests have been setup to run on Travis CI when you create a PR.
PRs should not be merged until they pass the tests (along with a code review
and the usual PR approval and merge process - passing the tests on Travis CI is
only one criteria for merging).

You can see the success / fail status for Travis directly on the PR itself on
github, as well as in the README.md file on the main page of the project.

See the `.travis.yml` file and `test/setup.js.travis` for how the tests are
set up to run on Travis CI.

#### Useful references
https://trac.ffmpeg.org/wiki/Capture/Desktop

https://docs.travis-ci.com/user/uploading-artifacts/

https://atasteofsandwich.wordpress.com/2014/05/04/visual-regression-tests-with-travis-ci-and-github/

https://docs.travis-ci.com/user/gui-and-headless-browsers/

http://seleniumhq.github.io/selenium/docs/api/javascript/

https://github.com/SeleniumHQ/selenium

https://github.com/SeleniumHQ/selenium/wiki

https://groups.google.com/forum/#!forum/selenium-users

https://github.com/SeleniumHQ/selenium/wiki/Selenium-Help

That's the end of the automated testing section. If you want to understand how
to do it manually, see below. But be forewarned that the manual testing will
eventually add up to a lot of lost time, so it's worth it to go through the
one-time local set up and use the automated tests instead.

That is not to say that the local tests are never useful. If someone reports a
bug that effects their local project it can be useful to copy their code for
local testing and debugging. There may be other use cases too.

### To test your code locally:
- Import the code from the
[official FCC example project](http://codepen.io/collection/npZPmR) that you
are creating/editing the test suite for into the `local_test` directory:
- Create folders for your code, i.e. JS, CSS, etc. (NOTE: even if your project
does not have JS, you **MUST** create a folder called **JS** - this is where
bundle.js will be created).
- Include the JS & CSS (if using SCSS or LESS, compile down to CSS first) in
the folders you created in `local_test/`.
- Modify index.html to point to your files and include any other external
resources you need (e.g. React, jQuery, D3, FontAwesome, etc.).
- **NOTE:** Before you push your changes, please be sure to return index.html to
its original state.
- Run `npm start` to start watching your files for changes.
- Then, in another terminal tab navigate into the `local_test` directory and run
`npm run serve-https-local`.
- Now your changes to the test files will be automatically bundled by webpack
and served in the project that is running locally.
- Your changes will not be saved to the bundle we're using for production until
you run `npm run build` and create a PR that is eventually merged.
- As a less desireable alternative, you can push your changes to your fork of
this repo and utilize rawgit.com for a CDN style link that you can use to
populate the test suite in CodePen or wherever else (use the right hand,
non-production link).
