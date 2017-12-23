master branch: [![Build Status](https://travis-ci.org/freeCodeCamp/testable-projects-fcc.svg?branch=master)](https://travis-ci.org/freeCodeCamp/testable-projects-fcc)

# testable-projects-fcc
A CDN loaded test-suite for testing the beta.freecodecamp.com Frontend Libraries Certification waypoint projects.
![image](https://cloud.githubusercontent.com/assets/18563015/26524733/08557ed8-430b-11e7-9861-2d4e8e2806ae.png)
![image](https://cloud.githubusercontent.com/assets/18563015/26524736/2380f3d6-430b-11e7-85cb-45f92b73323c.png)

### What is this, you ask?
- This repo is a part of the FreeCodeCamp.com curriculum expansion, and represents our front end testable projects, err... project.
- Our goal is to make every waypoint project, which each correspond to different sections of the curriculum, fully testable using a TDD-like methodology - such that our campers will have predefined test cases, which start out failing, and that they must make pass.
- This codebase is the test suite, and individual sets of test cases for each of these projects.
- We are serving the tests via CDNs (see below), which can easily be imported into any of our projects, whether they are developed locally, on CodePen (as our example projects are), or anywhere else.
- You can see examples of these projects here: http://codepen.io/collection/npZPmR

### Bundle CDNs:
- FOR PRODUCTION: https://gitcdn.link/repo/freeCodeCamp/testable-projects-fcc/master/build/bundle.js
  - will not throttle our traffic
  - can take 2hrs or more to propagate changes to all users
- FOR DEV: https://rawgit.com/freeCodeCamp/testable-projects-fcc/master/build/bundle.js
  - will throttle heavy traffic
  - changes will propagate much quicker so replace the gitCDN link with this for testing

### Testing this project
Warning that this gets a little meta. This project provides a feature that will
test *camper project code*.

As such, this project should be seen as more of a feature, than as automated
testing. The feature mostly includes automated testing for the students to
run, but it does have a UI, and the tests do not run against our code.

So how do we make sure this feature, used by millions of campers, actually works
in production? The confusing answer is that we need to test this feature, which
means testing the Camper tests.

We do this by running the Camper project tests (everything in the `src`
directory) over the
[example CodePen projects](http://codepen.io/collection/npZPmR). Since the
example CodePen projects are supposed to be working examples, if the
tests do not pass for the example CodePen projects, we need to either fix the tests,
or fix the example project that fails.

In most projects you wouldn't test the tests, but in this case, the CodePen
Camper Project Tests are a production feature potentially used by millions of
campers, so it is important we don't break that feature.

This is important to understand so I'll repeat it in different words: the tests
in the `src` directory of this project are not typical tests used to check our
own code before deploying. Quite the opposite, they are a production feature
that is used by students in a live setting to check *their own code*.
As such, it is very important that we don't break those tests.

In order to keep things from being confusing, we refer to everything in the
`src` directory as the "CodePen Project Tests" or the "Camper Project Tests" or
"Testable Projects Tests". Those tests *are the feature* we are shipping.

Opposite of the above, all of the code that lives in the `test` directory *is*
the typical tests used to check our own code before deploying. We simply call
this code the "automated testing". It *tests the feature* we are shipping.

The automated testing can (and should) be performed locally by you before
creating a PR. The tests also run automatically on Travis CI every time you
create a PR. A PR that has not passed the Travis CI tests should not be merged.

For all the details about automatically testing this project, please see the
[CONTRIBUTING guide](CONTRIBUTING.md).

### Credits:
__This repo did not originally live here. There are several important contributors who contributed code before this project took its current form. So credit where credit is due, to those contributors, and to the other key contributors for this project:__
- First and foremost is [@Weezlo](https://github.com/Weezlo), thanks for getting us started! And to [@no-stack-dub-sack](https://github.com/no-stack-dub-sack), [@tchaffee](https://github.com/tchaffee) & [@tbushman](https://github.com/tbushman) for seeing it through the rest of the way! Also [@Christian-Paul](https://github.com/Christian-Paul) & [@paycoguy](https://github.com/paycoguy) for coming up with reliable ways to test D3, and [@bonham000](https://github.com/bonham000) for helping us to get this all bundled up nicely in one sweet little package. 
- All tests developed by [@Weezlo](https://github.com/Weezlo) & [@no-stack-dub-sack](https://github.com/no-stack-dub-sack) except for the D3 projects developed by [@Christian-Paul](https://github.com/Christian-Paul) & [@paycoguy](https://github.com/paycoguy), with countless refinements to all projects by [@tbushman](https://github.com/tbushman) & [@tchaffee](https://github.com/tchaffee).
