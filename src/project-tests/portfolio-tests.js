import { responsiveWebDesignStack } from '../utils/shared-test-strings';
import { allCSSRulesAsArray, isTestSuiteRule } from
  '../utils/style-sheet-utils';
import { assert } from 'chai';

export default function createPortfolioTests() {

  describe('#Portfolio tests', function() {

    describe('#Technology Stack', function() {
      it(responsiveWebDesignStack, function() {
        return true;
      });
    });

    describe('#Content', function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. My portfolio should have a Welcome section with an id of
      "welcome-section".`,
      function() {
        assert.isNotNull(document.getElementById('welcome-section'));
      });

      reqNum++;
      it(`${reqNum}. The welcome section should have an h1 element that contains
      text.`,
      function() {

        assert.isAbove(
          document.querySelectorAll('#welcome-section h1').length,
          0,
          'Welcome section should contain an h1 element '
        );

        assert.isAbove(
          document.querySelectorAll('#welcome-section h1')[0].innerText.length,
          0,
          'h1 element in welcome section should contain your name or camper ' +
          'name '
        );
      });

      reqNum++;
      it(`${reqNum}. My portfolio should have a projects section with an id of
      "projects".`,
      function() {
        assert.isNotNull(document.getElementById('projects'));
      });

      reqNum++;
      it(`${reqNum}. The projects section should contain at least one element
      with a class of "project-tile" to hold a project.`,
      function() {
        assert.isAbove(
          document.querySelectorAll('#projects .project-tile').length,
          0
        );
      });

      reqNum++;
      it(`${reqNum}. The projects section should contain at least one link to a
      project.`,
      function() {
        assert.isAbove(
          document.querySelectorAll('#projects a').length,
          0
        );
      });

      reqNum++;
      it(`${reqNum}. My portfolio should have a navbar with an id of "navbar".`,
      function() {
        const navbar = document.getElementById('navbar');

        assert.isNotNull(navbar);
      });

      reqNum++;
      it(`${reqNum}. The navbar should contain at least one link that I can
      click on to navigate to different sections of the page.`,
      function(done) {
        // Filter anchors by location hash (don't click external links)
        let links = Array.from(document.querySelectorAll('#navbar a'));
        links = links.filter((nav) => {
          return nav.getAttribute('href').substr(0, 1) === '#';
        });
        let linksIndex = 0;
        let bottomScroll = false;
        let bottomPositionY;

        // If the window has been scrolled then the nav link worked.
        let testTopCondition = () => {
          return window.scrollY !== 0;
        };

        // Similar to above, but we are testing if the window scrolled from the
        // bottom.
        let testBottomCondition = () => {
          let distanceFromBottom = bottomPositionY - window.scrollY;
          // if distance from bottom is not 0, clicking a link made it move,
          // so we end the loop.
          return distanceFromBottom !== 0;
        };

        // Tests if the window scrolled, and if not it clicks the next link
        // and calls itself to see if that link scrolled. We need the timeout
        // in case the CSS uses "scroll-behavior: smooth;" which takes some
        // time to finish scrolling.
        // NOTE: This function is not easy to understand. Some well placed
        // console.log statements will help understand what is happening.
        let testScroll = (testCondition) => {
          setTimeout(() => {
            // If the test condition passes, we are done. Scroll the window
            // back to the top before successfully ending the tests.
            if (testCondition()) {
              window.scroll(0, 0);
              done();
            } else {
              // Test condition did not pass, so try the next link and then
              // call this function to test to see if it scrolled the window.
              linksIndex++;
              if (linksIndex < links.length) {
                links[linksIndex].click();
                testScroll(testCondition);
              } else if (!bottomScroll) {
                // We are out of the links. If we have not yet tested with
                // scrolling from the bottom, then run the tests again after
                // first scrolling to the bottom.
                bottomScroll = true;
                window.scroll(0, document.body.scrollHeight);
                // Before running the new set of tests, give it some time to
                // finish scrolling to the bottom.
                setTimeout(() => testBottomScroll(), 500);
              }
            }
          }, 500);
        };

        // Kicks off the tests that will check if the nav links scroll the
        // window from the bottom.
        let testBottomScroll = () => {
          bottomPositionY = window.scrollY;
          linksIndex = 0;
          links[linksIndex].click();
          testScroll(testBottomCondition);
        };

        // Tests start here. We need a longer timeout for this test. 10 seconds
        // is enough to test about 10 nav links.
        this.timeout(10000);
        // Filter anchors by location hash (don't click external links)
        let anchors = Array.from(document.querySelectorAll('#navbar a'));
        anchors = anchors.filter((nav) => {
          return nav.getAttribute('href').substr(0, 1) === '#';
        });

        assert.isAbove(
          anchors.length,
          0,
          'Navbar should contain a link '
        );

        // Scroll the window to the top and then try the nav links to make sure
        // they scroll the window. We delay the starting of the tests because
        // it could take some time to scroll the window to the top.
        window.scroll(0, 0);
        links[linksIndex].click();
        setTimeout(() => testScroll(testTopCondition), 500);
      });

      reqNum++;
      it(`${reqNum}. My portfolio should have a link with an id of
      "profile-link", which opens my GitHub or FCC profile in a new tab.`,
      function() {
        const profileLink = document.getElementById('profile-link');

        assert.isNotNull(profileLink);

        assert.equal(profileLink.nodeName, 'A');

        assert.strictEqual(
          profileLink.hasAttribute('target'),
          true,
          '#profile-link should have a target attribute '
        );

        assert.equal(
          profileLink.target,
          '_blank',
          'Clicking #profile-link should cause a link to open in a new tab '
        );

      });

    // END #Content
    });

    describe('#Layout', function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. My portfolio should have at least one media query.`,
      function() {

        // Filter to get only media queries.
        let queryRules = allCSSRulesAsArray(document.styleSheets)
          .filter(rule => rule.type === CSSRule.MEDIA_RULE);

        // Filter out our test suite and Mocha CSS rules. This may be trickier
        // than looks. The reason we can use allCSSRulesAsArray is because
        // media rules have a cssRules attribute.
        let cssMediaRules = allCSSRulesAsArray(queryRules)
          .filter(rule => !isTestSuiteRule(rule));

        assert.isAbove(
          cssMediaRules.length,
          0,
          'No media queries detected '
        );
      });

      reqNum++;
      it(`${reqNum}. The height of the welcome section should be equal to the
      height of the viewport.`,
      function() {
        assert.equal(
          document.getElementById('welcome-section').offsetHeight,
          window.innerHeight,
          'The height of #welcome-section is not equal to the height of the ' +
          'viewport '
        );
      });

      reqNum++;
      it(`${reqNum}. The navbar should always be at the top of the viewport.`,
      function(done) {
        const navbar = document.getElementById('navbar');
        assert.approximately(
          navbar.getBoundingClientRect().top,
          0,
          15,
          'Navbar\'s parent should be body and it should be at the top of ' +
          'the viewport '
        );

        window.scroll(0, 500);
        // This timeout is to allow page layout to happen after the
        // window.scroll. Without it the getBoundingClientRect can sometimes
        // report the wrong value while the page is still laying out, when using
        // CSS position:sticky. This is apparently a bug with Chrome.
        // See https://bugs.chromium.org/p/chromium/issues/detail?id=672457
        setTimeout(function() {
          assert.approximately(
            navbar.getBoundingClientRect().top,
            0,
            15,
            'Navbar should be at the top of the viewport even after scrolling '
          );
          window.scroll(0, 0);
          done();
        }, 1);

      });

    // END #Layout
    });

  // END #PortfolioTests
  });

// END createPortfolioTests()
}
