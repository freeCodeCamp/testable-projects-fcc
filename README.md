# testable-projects-fcc
testable projects for freecodecamp.com curriculum expansion.

### What is this, you ask?
- This repo is a part of the FreeCodeCamp.com curriculum expansion, and represents our front end testable projects, err... project.
- Our goal is to make every waypoint project, which each correspond to different sections of the curriculum, fully testable using a TDD-like methodology - such that our campers will have predefined test cases, which start out failing, and that they must make pass. 
- This codebase is the test suite, and individual sets of test cases for each of these projects. 
- We are serving the tests via CDNs (see below), which can easily be imported into any of our projects, whether they are developed locally, on codepen (as our example projects are), or anywhere else. 
- You can see examples of these projects here: http://codepen.io/collection/nMjJjE/

### Bundle CDNs:
- FOR PRODUCTION: https://gitcdn.link/repo/no-stack-dub-sack/testable-projects-fcc/master/build/bundle.js
  - will not throttle our traffic
  - can take 2hrs or more to propagate changes to all users
- FOR DEV: https://rawgit.com/no-stack-dub-sack/testable-projects-fcc/master/build/bundle.js
  - will throttle heavy traffic
  - changes will propagate much quicker so replace the gitCDN link with this for testing 

### This repo did not originally live here. There are several important contributors who contributed code before this project took its current form. So credit where credit is due:
First and foremost is @Weezlo, thanks for getting us started! And to @no-stack-dub-sack for seeing it through the rest of the way! Also @Christian-Paul & @paycoguy for coming up with reliable ways to test D3, and @bonham000 for helping to get this all bundled up nicely in one sweet little package. 

### Credits:
- credits for individual example projects coming soon...
- All tests developed by @Weezlo & @no-stack-dub-sack except for the D3 projects developed by @Christian-Paul & @paycoguy
