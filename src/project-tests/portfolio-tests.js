import { assert } from 'chai';

import { responsiveWebDesignStack } from '../utils/shared-test-strings';
import { hasMediaQuery } from '../utils/style-sheet-utils';
import { timeout } from '../utils/threading';

export default function createPortfolioTests() {
  describe('#Portfolio tests', function() {
    describe('#Technology Stack', function() {
      it(responsiveWebDesignStack, function() {
        return true;
      });
    });

    describe('#Content', function() {
      it(`My portfolio should have a Welcome section with an id of
      "welcome-section".`, function() {
        assert.isNotNull(document.getElementById('welcome-section'));
      });

      it(`The welcome section should have an h1 element that contains
      text.`, function() {
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

      it(`My portfolio should have a projects section with an id of
      "projects".`, function() {
        assert.isNotNull(document.getElementById('projects'));
      });

      it(`The projects section should contain at least one element
      with a class of "project-tile" to hold a project.`, function() {
        assert.isAbove(
          document.querySelectorAll('#projects .project-tile').length,
          0
        );
      });

      it(`The projects section should contain at least one link to a
      project.`, function() {
        assert.isAbove(document.querySelectorAll('#projects a').length, 0);
      });

      it('My portfolio should have a navbar with an id of "navbar".', function() {
        const navbar = document.getElementById('navbar');

        assert.isNotNull(navbar);
      });

      it(`The navbar should contain at least one link that I can
      click on to navigate to different sections of the page.`, async function() {
        // We need a longer timeout for this test. 11 seconds
        // is enough to test about 10 nav links.
        this.timeout(11000);

        // Filter links by location hash (don't click external links)
        const links = Array.from(document.querySelectorAll('#navbar a')).filter(
          nav => (nav.getAttribute('href') || '').substr(0, 1) === '#'
        );

        assert.isAbove(
          links.length,
          0,
          'Navbar should contain an anchor link '
        );

        // Scroll the window to the top and then try the nav links to make sure
        // they scroll the window. We delay the starting of the tests because
        // it could take some time to scroll the window to the top.
        window.scroll(0, 0);
        await timeout(500);

        for (let i = 0; i < links.length; i++) {
          links[i].click();
          // We need the timeout in case the CSS uses "scroll-behavior: smooth;"
          // which takes some time to finish scrolling.
          await timeout(500);
          if (window.scrollY) {
            // if the window's y position is not 0, clicking a link made it move
            window.scroll(0, 0);
            return;
          }
        }

        // move window to bottom
        window.scroll(0, document.body.scrollHeight);
        await timeout(500);

        const bottomPositionY = window.scrollY;

        for (let i = 0; i < links.length; i++) {
          links[i].click();
          // We need the timeout in case the CSS uses "scroll-behavior: smooth;"
          // which takes some time to finish scrolling.
          await timeout(500);
          const distanceFromBottom = bottomPositionY - window.scrollY;
          if (distanceFromBottom) {
            // if distance from bottom is not 0, clicking a link made it move
            window.scroll(0, 0);
            return;
          }
        }

        // none of the links changed the scroll position
        window.scroll(0, 0);
        assert.isTrue(
          false,
          'At least one navbar link should move the page position when clicked '
        );
      });

      it(`My portfolio should have a link with an id of
      "profile-link", which opens my GitHub or FCC profile in a new tab.`, function() {
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
      it('My portfolio should have at least one media query.', function() {
        assert.isTrue(
          hasMediaQuery(document.styleSheets),
          'No media queries detected '
        );
      });

      it(`The height of the welcome section should be equal to the
      height of the viewport.`, function() {
        assert.approximately(
          document.getElementById('welcome-section').offsetHeight,
          window.innerHeight,
          window.devicePixelRatio === 1 ? 0 : 1,
          'The height of #welcome-section is not equal to the height of the ' +
            'viewport '
        );
      });

      it('The navbar should always be at the top of the viewport.', async function() {
        const navbar = document.getElementById('navbar');
        assert.approximately(
          navbar.getBoundingClientRect().top,
          0,
          15,
          "Navbar's parent should be body and it should be at the top of " +
            'the viewport '
        );

        window.scroll(0, 500);
        // This timeout is to allow page layout to happen after the
        // window.scroll. Without it the getBoundingClientRect can sometimes
        // report the wrong value while the page is still laying out, when using
        // CSS position:sticky. This is apparently a bug with Chrome.
        // See https://bugs.chromium.org/p/chromium/issues/detail?id=672457
        await timeout(1);
        assert.approximately(
          navbar.getBoundingClientRect().top,
          0,
          15,
          'Navbar should be at the top of the viewport even after ' +
            'scrolling '
        );
        window.scroll(0, 0);
      });

      // END #Layout
    });

    // END #PortfolioTests
  });

  // END createPortfolioTests()
}
