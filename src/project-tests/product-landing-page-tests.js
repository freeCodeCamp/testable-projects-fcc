import { responsiveWebDesignStack } from '../assets/sharedTestStrings';
import { allCSSRulesAsArray, isTestSuiteRule } from '../assets/styleSheetUtils';

export default function createProductLandingPageTests() {
  describe('#Product Landing Page tests', function() {

    describe('#Content', function() {

      // Describes the allowed stack for this project.
      it(responsiveWebDesignStack, function() {
        return true;
      });

      it(`1. My product landing page should have a <header> element with
      corresponding id="header".`,
      function() {
        FCC_Global.assert.isNotNull(
          document.getElementById('header'),
          '#header is not defined '
        );
      });

      it(`2. I can see an image within the #header element with a corresponding
      id="header-img". A company logo would make a good image here. `,
      function() {
        const img = document.getElementById('header-img');
        FCC_Global.assert.isNotNull(img, '#header-img is not defined ');
        FCC_Global.assert.strictEqual(
          img.nodeName,
          'IMG',
          '#header-img is not an <img> element '
        );
        FCC_Global.assert.strictEqual(
          document.querySelectorAll('#header #header-img').length,
          1,
          '#header-img is not a child of #header element '
        );
        FCC_Global.assert.strictEqual(
          img.hasAttribute('src'),
          true,
          '#header-img must have a src attribute '
        );
        FCC_Global.assert.include(
          img.src,
          'http',
          'The src attribute\'s value should be a url (http...) ');
      });

      it(`3. Within the <header> element I can see a <nav> element with
      corresponding id="nav-bar".'`,
      function() {
        FCC_Global.assert.isNotNull(
          document.getElementById('nav-bar'),
          '#nav-bar is not defined '
        );
        FCC_Global.assert.strictEqual(
          document.getElementById('nav-bar').nodeName,
          'NAV',
          'The #nav-bar element is not a <nav> element '
        );
        FCC_Global.assert.strictEqual(
          document.querySelectorAll('#header #nav-bar').length,
          1,
          '#nav-bar is not a child of #header '
        );
      });

      it(`4. I can see at least three clickable elements inside the nav
      element, each with the class "nav-link".`,
      function() {
        FCC_Global.assert.isAtLeast(
          document.querySelectorAll('#nav-bar .nav-link').length,
          3,
          'There are not at least 3 elements with a class of "nav-link" ' +
          'within the #nav-bar element '
        );
      });

      it(`5. When I click a .nav-link button in the nav element, I am taken to
      the corresponding section of the landing page.'`,
      function() {
        const navLinks = document.querySelectorAll('#nav-bar .nav-link');
        navLinks.forEach(link => {
          FCC_Global.assert.isNotNull(link);
          FCC_Global.assert.strictEqual(
            link.hasAttribute('href'),
            true,
            'Each .nav-link element should have an href attribute '
          );
          const linkDestination = link.getAttribute('href').slice(1);
          FCC_Global.assert.isNotNull(
            document.getElementById(linkDestination),
            'The .nav-link with href="' +
            link.getAttribute('href') +
            '" is not linked to a corresponding element on the page '
          );
        });
      });

      it(`6. I can watch an embedded product video with id="video".`,
      function() {
        const video = document.getElementById('video');
        FCC_Global.assert.isNotNull(video, '#video is not defined ');
        FCC_Global.assert(
          video.nodeName === 'VIDEO' || video.nodeName === 'IFRAME',
          '#video should be an <iframe> or <video> element '
        );
        FCC_Global.assert.strictEqual(
          video.hasAttribute('src'),
          true,
          '#video should have a scr attribute '
        );
      });

      it(`7. My landing page has a <form> element with a corresponding
      id="form".'`,
      function() {
        FCC_Global.assert.isNotNull(
          document.getElementById('form'),
          '#form is not defined '
        );
        FCC_Global.assert.strictEqual(
          document.getElementById('form').nodeName,
          'FORM',
          '#form should be a <form> element '
        );
      });

      it(`8. Within the form, there is an <input> field with id="email" where I
      can enter an email address.`,
      function() {
        FCC_Global.assert.isNotNull(
          document.getElementById('email'),
          '#email is not defined '
        );
        FCC_Global.assert.strictEqual(
          document.querySelectorAll('#form #email').length,
          1,
          '#email should be a child of the #form element '
        );
        FCC_Global.assert.strictEqual(
          document.getElementById('email').nodeName,
          'INPUT',
          '#email should be an <input> element '
        );
      });

      it(`9. The #email input field should have placeholder text to let the
      user know what the field is for.`,
      function() {
        const emailElem = document.getElementById('email');
        FCC_Global.assert.strictEqual(
          emailElem.hasAttribute('placeholder'),
          true,
          'The #email input field does not have placeholder text '
        );
        FCC_Global.assert.isAbove(
          emailElem.getAttribute('placeholder').length,
          0,
          'The #email placeholder attribute should have some text '
        );
      });

      it(`10. The #email input field uses HTML5 validation to confirm that the
      entered text is an email address.`,
      function() {
        const emailElem = document.getElementById('email');
        FCC_Global.assert.strictEqual(
          emailElem.type,
          'email',
          'The #email input element should use HTML5 validation '
        );
      });

      it(`11. Within the form, there is a submit <input> with corresponding
      id="submit".`,
      function() {
        const submitButton = document.getElementById('submit');
        FCC_Global.assert.isNotNull(
          submitButton,
          '#submit is not defined '
        );
        FCC_Global.assert.strictEqual(
          document.querySelectorAll('#form #submit').length,
          1,
          '#submit should be a child of the #form element '
        );
        FCC_Global.assert.strictEqual(
          submitButton.nodeName,
          'INPUT',
          '#submit should be an <input> element '
        );
        FCC_Global.assert.strictEqual(
          submitButton.type,
          'submit',
          'The #submit element input type is incorrect '
        );
      });

      it(`12. When I click the #submit element, the email is submitted to a
      static page (use this mock URL: https://www.freecodecamp.com/email-submit)
      that confirms the email address was entered (and that it posted
      successfully).`,
      function() {
        const emailElem = document.getElementById('email');
        const formElem = document.getElementById('form');
        const submitElem = document.getElementById('submit');
        FCC_Global.assert.strictEqual(
          formElem.hasAttribute('action'),
          true,
          'The #form should have an action attribute '
        )
        FCC_Global.assert.include(
          formElem.action,
          'http',
          'The action attribute\'s value should be a url (http...) '
        );
        FCC_Global.assert.strictEqual(
          emailElem.hasAttribute('name'),
          true,
          'The #email input should have a name attribute '
        );
        FCC_Global.assert.strictEqual(
          emailElem.name,
          'email',
          'The #email element\'s name attribute should have a value of "email" '
        );
      });

    // END #Content
    });

    describe('#Layout', function() {
      // TODO: Most of this function should be extracted to a utility that
      // can be reused.
      it(`1. The navbar should always be at the top of the viewport.`,
      function() {
        const header = document.getElementById('header');
        const headerChildren = header.children;
        // array of all potential elements serving as a navbar
        const navbarCandidates = [
          header, ...headerChildren
        ];

        // get the 'top' position value from the element whose value is closest
        // to 0
        function getNavbarPosition(candidates) {
          // by default, set to first candidate's top value
          var candidatePosition = Math.abs(
            candidates[0].getBoundingClientRect().top
          );
          for (var i = 1; i < candidates.length; i++) {
            // if another candidate has a top value closer to 0, replace the
            // old value
            var currentCandidatePosition =
              Math.abs(candidates[i].getBoundingClientRect().top);
            if (currentCandidatePosition < candidatePosition) {
              candidatePosition = currentCandidatePosition;
            }
          }
          return candidatePosition
        }

        FCC_Global.assert.approximately(
          getNavbarPosition(navbarCandidates),
          0,
          15,
          '#header or one of its children should be at the top of the viewport '
        );
        window.scroll(0, 500);
        FCC_Global.assert.approximately(
          getNavbarPosition(navbarCandidates),
          0,
          15,
          '#header or one of its children should be at the top of the ' +
          'viewport even after scrolling '
        );
        window.scroll(0, 0);
      });

      it(`2. My product landing page should have at least one media query.`,
      function() {

        // Filter to get only media queries.
        let queryRules = allCSSRulesAsArray(document.styleSheets)
          .filter(rule => rule.type === CSSRule.MEDIA_RULE);

        // Filter out our test suite and Mocha CSS rules. This may be trickier
        // than looks. The reason we can use allCSSRulesAsArray is because
        // media rules have a cssRules attribute.
        let cssMediaRules = allCSSRulesAsArray(queryRules)
          .filter(rule => !isTestSuiteRule(rule));

        FCC_Global.assert.isAbove(
          cssMediaRules.length,
          0,
          'No media queries detected '
        );
      });

      it(`3. My product landing page should utilize CSS flexbox at least once.`,
      function() {
        // Find CSS rules that use flexbox.
        const flexRules = allCSSRulesAsArray(document.styleSheets)
          .filter(rule => {
            // Eliminate any CSS Rules that are part of our test suite UI.
            if (isTestSuiteRule(rule)) {
              return false;
            }

            // Only include flexbox rules.
            return (
              typeof rule.style !== 'undefined' &&
              typeof rule.style.display !== 'undefined'
            ) &&
            (
              rule.style.display === 'flex' ||
              rule.style.display === 'inline-flex'
            );
          });

        FCC_Global.assert.isAbove(
          flexRules.length,
          0,
          'We do not detect a display property set to flex or inline-flex ' +
          'anywhere in your CSS '
        );
      });

    // END #Layout
    });

  // END #ProductLadingPageTests
  });

// END createProductLandingPageTests()
}
