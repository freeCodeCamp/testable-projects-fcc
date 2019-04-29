import { assert } from 'chai';
import { responsiveWebDesignStack } from '../utils/shared-test-strings';
import { hasMediaQuery } from '../utils/style-sheet-utils';

export default function createTechnicalDocsPageTests() {

  const classArray = (className) => {
    return Array.from(document.getElementsByClassName(className));
  };

  const sharedHeaderTest = (classQty) => {
    let firstChildHeaderQty = classArray('main-section').filter(
      el => el.firstElementChild.nodeName === 'HEADER'
    );
    assert.strictEqual(
      firstChildHeaderQty.length,
      classQty,
      'Not all elements with the class \'main-section\' have a <header> ' +
      'element as a first element child '
    );
  };

  describe('Technical Documentation Page tests',
  function() {

    describe('#Technology Stack', function() {
      it(responsiveWebDesignStack, function() {
        return true;
      });
    });

    describe('#Content', function() {

      it(`I can see a <main> element with a corresponding
      id="main-doc", which contains the page's main content (technical
      documentation).`,
      function() {
        assert.isNotNull(
          document.getElementById('main-doc'),
          'There is no element with an id of \'main-doc\' '
        );
        assert.strictEqual(
          document.getElementById('main-doc').nodeName,
          'MAIN',
          'The \'main-doc\' element should be a <main> '
        );
      });

      it(`Within the #main-doc ( <main> ) element, I can see several
      <section> elements, each with a class of "main-section". There should be
      a minimum of 5.`,
      function() {
        let classQty = classArray('main-section').length;
        let typeQty = classArray('main-section').filter(
          el => el.nodeName === 'SECTION'
        );
        assert.isAbove(
          document.querySelectorAll('#main-doc .main-section').length,
          0,
          'There are no .main-section elements within #main-doc '
        );
        assert.isAtLeast(
          document.querySelectorAll('#main-doc .main-section').length,
          5,
          'There are not at least 5 elements with the class of "main-section" '
        );
        assert.strictEqual(
          document.querySelectorAll('.main-section').length,
          document.querySelectorAll('#main-doc .main-section').length,
          'All of the page\'s .main-section elements should be within ' +
          '#main-doc '
        );
        assert.strictEqual(typeQty.length,
          classQty,
          'Not all of the elements with the class of "main-section" are ' +
          '<section> elements '
        );
      });

      it(`The first element within each .main-section should be a
      <header> element which contains text that describes the topic of that
      section.`,
      function() {
        let classQty = classArray('main-section').length;
        let mustContainText = classArray('main-section').filter(
          el => el.firstElementChild.innerText.length > 0
        );
        assert.isAbove(
          classQty,
          0,
          'No elements with the class "main-section" are defined '
        );
        sharedHeaderTest(classQty);
        assert.strictEqual(
          mustContainText.length,
          classQty,
          'Not all first-child <header> elements within "main-section" ' +
          'elements contain text '
        );
      });

      it(`Each <section> element with the class of "main-section"
      should also have an id comprised of the <header> innerText 
      contained within it, with underscores in place of spaces. The id may
      include special characters if there are special characters in
      the respective <header> innerText. (e.g. The <section> that contains the
      header, "JavaScript & Java", should have a corresponding
      id="JavaScript_&_Java").`,
      function() {

        const mainSections = classArray('main-section');
        assert.isAbove(
          mainSections.length,
          0,
          'No elements with the class "main-section" are defined '
        );

        sharedHeaderTest(mainSections.length);

        const headerText = mainSections.map((el) => {
          assert.isAbove(
            el.firstElementChild.innerText.length,
            0,
            'All headers must contain text '
          );
          // remove leading / trailing spaces  in headerText and then replace
          // all other spaces with underscores.
          return el.firstElementChild.innerText.trim().replace(/\s/g, '_')
            .toUpperCase();
        });

        const mainSectionIDs = mainSections.map((el) => {
          assert.strictEqual(
            el.hasAttribute('id'),
            true,
            'Each \'main-section\' should have an id attribute '
          );
          return el.id.toUpperCase();
        });

        const remainder = headerText.filter(str =>
          mainSectionIDs.indexOf(str) === -1
        );
        assert.strictEqual(
          remainder.length,
          0,
          'Some "main-section" elements are missing the following ids ' +
          '(don\'t forget to replace spaces with underscores!) : ' +
          remainder + ' '
        );
      });

      it(`The .main-section elements should contain at least 10 <p>
      elements total (not each).`,
      function() {
        assert.isAtLeast(
          document.querySelectorAll('.main-section p').length,
          10,
          'There are not at least 10 <p> elements throughout all of the ' +
          'elements with the class of \'main-section\' '
        );
      });

      it(`The .main-section elements should contain at least 5 <code>
      elements total (not each).`,
      function() {
        assert.isAtLeast(
          document.querySelectorAll('.main-section code').length,
          5,
          'There are not at least 5 <code> elements throughout all of the ' +
          'elements with the class of \'main-section\' ');
      });

      it(`The .main-section elements should contain at least 5 <li>
      items total (not each).`,
      function() {
        assert.isAtLeast(
          document.querySelectorAll('.main-section li').length,
          5,
          'There are not at least 5 <li> elements throughout all of the ' +
          'elements with the class of \'main-section\' '
        );
      });

      it(`I can see a <nav> element with a corresponding
      id="navbar".`,
      function() {
        assert.isNotNull(
          document.getElementById('navbar'),
          'There is no element with the id of \'navbar\'.'
        );
        assert.strictEqual(
          document.getElementById('navbar').nodeName,
          'NAV',
          'The element with the id of "navbar" is not a <nav> element '
        );
      });

      it(`The navbar element should contain one <header> element
      which contains text that describes the topic of the technical
      documentation.`,
      function() {
        assert.strictEqual(
          document.getElementById('navbar')
            .getElementsByTagName('header').length,
          1,
          'The navbar element should contain only one <header> element.'
        );
      });

      it(`Additionally, the navbar should contain link (<a>) elements
      with the class of "nav-link". There should be one for every element with
      the class "main-section".`,
      function() {
        const mainSectionQty =
          document.querySelectorAll('#main-doc .main-section').length;
        const navLinkQty =
          document.querySelectorAll('#navbar .nav-link').length;
        const typeQty =
          classArray('nav-link').filter(el => el.nodeName === 'A');
        assert.isAbove(
          navLinkQty,
          0,
          'The element with the id of "navbar" does not contain any elements ' +
          'with the class of "nav-link" '
        );
        assert.strictEqual(
          navLinkQty,
          mainSectionQty,
          'There should be one .nav-link for every element with the class of ' +
          '"main-section", and every .nav-link should be within #navbar '
        );
        assert.strictEqual(
          typeQty.length,
          navLinkQty,
          'Not all of the elements with the class of "nav-link" are <a> ' +
          'elements '
        );
      });

      it(`The <header> element in the navbar must come before any
      link (<a>) elements in the navbar.`,
      function() {
        const navLinks = document.querySelectorAll('#navbar a.nav-link');
        const header = document.querySelectorAll('#navbar header').item(0);
        let allAbove = true;

        navLinks.forEach(navLink => {
          /* eslint no-bitwise: ["error", { "allow": ["&"] }] */
          if (!(header.compareDocumentPosition(navLink) &
            Node.DOCUMENT_POSITION_FOLLOWING)
          ) {
            allAbove = false;
          }
        });

        assert.strictEqual(
          allAbove,
          true,
          'The <header> element contained by the navbar must be come before ' +
          'any link (<a>) elements contained by the navbar'
        );
      });

      it(`Each element with the class of "nav-link" should contain
      text that corresponds to the <header> text within each <section> (e.g. if
      you have a "Hello world" section/header, your navbar should have an
      element which contains the text "Hello world").`,
      function() {
        assert.isAbove(
          classArray('nav-link').length,
          0,
          'No elements with the class "nav-link" have been defined '
        );
        const headerText = classArray('main-section').map(el =>
          el.firstElementChild.innerText.trim().toUpperCase()
        );
        const linkText = classArray('nav-link').map(el =>
          el.innerText.trim().toUpperCase()
        );
        // use indexOf instead of matching index for index, in case for some
        // reason they have them out of order
        const remainder =
          headerText.filter(str => linkText.indexOf(str) === -1);
        assert.strictEqual(remainder.length,
          0,
          'Check that these headers have corresponding .nav-link elements ' +
          'and be mindful of case! : ' + remainder + ' '
        );
      });

      it(`When I click on a navbar element, the page should navigate
      to the corresponding section of the "main-doc" element (e.g. If I click on
      a "nav-link" element that contains the text "Hello world", the page
      navigates to a <section> element that has that id and contains the
      corresponding <header>.`,
      function() {
        const navLinkQty = document.getElementsByClassName('nav-link').length;
        assert.isAbove(
          navLinkQty,
          0,
          'No elements with the class "nav-link" have been defined '
        );
        const hasHref =
          classArray('nav-link').filter(el => el.hasAttribute('href'));
        const hrefValues =
          classArray('nav-link').map((el) => el.getAttribute('href'));
        const mainSectionIDs = classArray('main-section').map((el) => el.id);
        const missingHrefValues = mainSectionIDs.filter(str =>
          hrefValues.indexOf('#' + str) === -1
        );
        assert.strictEqual(
          hasHref.length,
          navLinkQty,
          'Every .nav-link does not have an href attribute.'
        );
        assert.strictEqual(
          missingHrefValues.length,
          0,
          'Every .nav-link should have an href value that links it to its ' +
          'corresponding .main-section (e.g. href="#Introduction"). Check ' +
          'that these .main-section ids have corresponding href values : ' +
          missingHrefValues + ' '
        );
      });

    // END #Content
    });

    describe('#Layout', function() {

      it(`On regular sized devices (laptops, desktops), the element
      with id="navbar" should only display on the left half of the screen. It should
      always be visible to the user and should remain stationary. You may need
      to enlarge the viewport or zoom out to ensure the navbar doesn't scroll
      with the page content.`,
      function() {
        const windowWidth =
          document.documentElement.clientWidth || window.innerWidth;
        const windowHeight =
          document.documentElement.clientHeight || window.innerHeight;
        assert.isAbove(
          windowWidth,
          850,
          'Please run this test in a larger window (before any media queries) '
        );
        var navbar = document.getElementById('navbar');
        // navbar should be in top-left quadrant
        // navbar on left side
        assert.isBelow(
          navbar.getBoundingClientRect().left,
          (windowWidth / 2) - navbar.getBoundingClientRect().width,
          'Left of bounding rectangle is not correct.'
        );
        // navbar above middle
        assert.isBelow(
          navbar.getBoundingClientRect().top,
          windowHeight / 2,
          'Top of bounding rectangle is not correct.'
        );
        window.scroll(0, 1000);
        assert.isBelow(
          navbar.getBoundingClientRect().left,
          (windowWidth / 2) - navbar.getBoundingClientRect().width,
          'After scroll: Left of bounding rectangle is not correct.'
        );
        assert.isBelow(
          navbar.getBoundingClientRect().top,
          windowHeight / 2,
          'After scroll: Top of bounding rectangle is not correct.'
        );
        window.scroll(0, 0);
      });

      it(`My Technical Documentation page should use at least one
      media query.`,
      function() {
        assert.isTrue(
          hasMediaQuery(document.styleSheets),
          'No media queries detected '
        );
      });

     // END #Layout
    });

  // end Technical Docs Page Tests
  });

// end createTechnicalDocsPageTests()
}
