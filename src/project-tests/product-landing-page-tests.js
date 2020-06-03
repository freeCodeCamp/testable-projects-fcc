import { responsiveWebDesignStack } from '../utils/shared-test-strings';
import {
  allCSSRulesAsArray,
  isTestSuiteRule,
  hasMediaQuery
} from '../utils/style-sheet-utils';
import { assert } from 'chai';

export default function createProductLandingPageTests() {
  describe('#Product Landing Page tests', function () {
    describe('#Technology Stack', function () {
      it(responsiveWebDesignStack, function () {
        assert.ok(true);
      });
    });

    describe('#Content', function () {
      it(`My product landing page should have a <header> element with
      corresponding id="header".`, function () {
        assert.isNotNull(
          document.getElementById('header'),
          '#header is not defined '
        );
      });

      it(`I can see an image within the #header element with a
      corresponding id="header-img". A company logo would make a good image
      here. `, function () {
        const img = document.getElementById('header-img');
        assert.isNotNull(img, '#header-img is not defined ');
        assert.strictEqual(
          img.nodeName,
          'IMG',
          '#header-img is not an <img> element '
        );
        assert.strictEqual(
          document.querySelectorAll('#header #header-img').length,
          1,
          '#header-img is not a child of #header element '
        );
        assert.strictEqual(
          img.hasAttribute('src'),
          true,
          '#header-img must have a src attribute '
        );
        assert.include(
          img.src,
          'http',
          "The src attribute's value should be a url (http...) "
        );
      });

      it(`Within the <header> element I can see a <nav> element with
      corresponding id="nav-bar".'`, function () {
        assert.isNotNull(
          document.getElementById('nav-bar'),
          '#nav-bar is not defined '
        );
        assert.strictEqual(
          document.getElementById('nav-bar').nodeName,
          'NAV',
          'The #nav-bar element is not a <nav> element '
        );
        assert.strictEqual(
          document.querySelectorAll('#header #nav-bar').length,
          1,
          '#nav-bar is not a child of #header '
        );
      });

      it(`I can see at least three clickable elements inside the nav
      element, each with the class "nav-link".`, function () {
        assert.isAtLeast(
          document.querySelectorAll('#nav-bar .nav-link').length,
          3,
          'There are not at least 3 elements with a class of "nav-link" ' +
            'within the #nav-bar element '
        );
      });

      it(`When I click a .nav-link button in the nav element, I am
      taken to the corresponding section of the landing page.'`, function () {
        const navLinks = document.querySelectorAll('#nav-bar .nav-link');
        assert.isAtLeast(
          navLinks.length,
          1,
          'The #nav-bar contains no .nav-link'
        );
        navLinks.forEach((link) => {
          assert.isNotNull(link);
          assert.strictEqual(
            link.hasAttribute('href'),
            true,
            'Each .nav-link element should have an href attribute '
          );
          const linkDestination = link.getAttribute('href').slice(1);
          assert.isNotNull(
            document.getElementById(linkDestination),
            'The .nav-link with href="' +
              link.getAttribute('href') +
              '" is not linked to a corresponding element on the page '
          );
        });
      });

      it('I can watch an embedded product video with id="video".', function () {
        let video = document.getElementById('video');
        assert.isNotNull(video, '#video is not defined ');
        assert(
          video.nodeName === 'VIDEO' || video.nodeName === 'IFRAME',
          '#video should be an <iframe> or <video> element '
        );
        // To accommodate `<source>` elements within `<video>` elements
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
        const sourceNode = video.children;
        if (sourceNode.length > 0) {
          let sourceElement = [...video.children].filter((node) => {
            return node.tagName === 'SOURCE';
          })[0];
          // If there is a `<source>` element inside the `<video>` element
          // use the `<source>` element in the video.src assertion
          if (sourceElement !== void 0) {
            video = sourceElement;
          }
        }
        assert.strictEqual(
          video.hasAttribute('src'),
          true,
          '#video should have a src attribute '
        );
      });

      it(`My landing page has a <form> element with a corresponding
      id="form".'`, function () {
        assert.isNotNull(
          document.getElementById('form'),
          '#form is not defined '
        );
        assert.strictEqual(
          document.getElementById('form').nodeName,
          'FORM',
          '#form should be a <form> element '
        );
      });

      it(`Within the form, there is an <input> field with id="email"
      where I can enter an email address.`, function () {
        assert.isNotNull(
          document.getElementById('email'),
          '#email is not defined '
        );
        assert.strictEqual(
          document.querySelectorAll('#form #email').length,
          1,
          '#email should be a child of the #form element '
        );
        assert.strictEqual(
          document.getElementById('email').nodeName,
          'INPUT',
          '#email should be an <input> element '
        );
      });

      it(`The #email input field should have placeholder text to let
      the user know what the field is for.`, function () {
        const emailElem = document.getElementById('email');
        assert.strictEqual(
          emailElem.hasAttribute('placeholder'),
          true,
          'The #email input field does not have placeholder text '
        );
        assert.isAbove(
          emailElem.getAttribute('placeholder').length,
          0,
          'The #email placeholder attribute should have some text '
        );
      });

      it(`The #email input field uses HTML5 validation to confirm
      that the entered text is an email address.`, function () {
        const emailElem = document.getElementById('email');
        assert.strictEqual(
          emailElem.type,
          'email',
          'The #email input element should use HTML5 validation '
        );
      });

      it(`Within the form, there is a submit <input> with
      corresponding id="submit".`, function () {
        const submitButton = document.getElementById('submit');
        assert.isNotNull(submitButton, '#submit is not defined ');
        assert.strictEqual(
          document.querySelectorAll('#form #submit').length,
          1,
          '#submit should be a child of the #form element '
        );
        assert.strictEqual(
          submitButton.nodeName,
          'INPUT',
          '#submit should be an <input> element '
        );
        assert.strictEqual(
          submitButton.type,
          'submit',
          'The #submit element input type is incorrect '
        );
      });

      it(`When I click the #submit element, the email is submitted to
      a static page (use this mock URL:
      https://www.freecodecamp.com/email-submit).`, function () {
        const emailElem = document.getElementById('email');
        const formElem = document.getElementById('form');
        assert.strictEqual(
          formElem.hasAttribute('action'),
          true,
          'The #form should have an action attribute '
        );
        assert.include(
          formElem.action,
          'http',
          "The action attribute's value should be a url (http...) "
        );
        assert.strictEqual(
          emailElem.hasAttribute('name'),
          true,
          'The #email input should have a name attribute '
        );
        assert.strictEqual(
          emailElem.name,
          'email',
          'The #email element\'s name attribute should have a value of "email" '
        );
      });

      // END #Content
    });

    describe('#Layout', function () {
      // TODO: Most of this function should be extracted to a utility that
      // can be reused.
      it('The navbar should always be at the top of the viewport.', function () {
        const header = document.getElementById('header');
        const headerChildren = header.children;
        // array of all potential elements serving as a navbar
        const navbarCandidates = [header, ...headerChildren];

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
            var currentCandidatePosition = Math.abs(
              candidates[i].getBoundingClientRect().top
            );
            if (currentCandidatePosition < candidatePosition) {
              candidatePosition = currentCandidatePosition;
            }
          }
          return candidatePosition;
        }

        assert.approximately(
          getNavbarPosition(navbarCandidates),
          0,
          15,
          '#header or one of its children should be at the top of the viewport '
        );
        window.scroll(0, 500);
        assert.approximately(
          getNavbarPosition(navbarCandidates),
          0,
          15,
          '#header or one of its children should be at the top of the ' +
            'viewport even after scrolling '
        );
        window.scroll(0, 0);
      });

      it(`My product landing page should have at least one media
      query.`, function () {
        assert.isTrue(
          hasMediaQuery(document.styleSheets),
          'No media queries detected '
        );
      });

      it(`My product landing page should utilize CSS flexbox at least
      once.`, function () {
        // Find CSS rules that use flexbox.
        function isRuleUseFlex(rule) {
          // Eliminate any CSS Rules that are part of our test suite UI.
          if (isTestSuiteRule(rule)) {
            return false;
          }

          return (
            rule.style.display === 'flex' ||
            rule.style.display === 'inline-flex'
          );
        }
        function isStyleSheetsUseFlex(styleSheets) {
          return allCSSRulesAsArray(styleSheets).some((rule) => {
            if (rule.type === CSSRule.STYLE_RULE) {
              return isRuleUseFlex(rule);
            }
            return isStyleSheetsUseFlex([rule]);
          });
        }

        assert.isTrue(
          isStyleSheetsUseFlex(document.styleSheets),
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
