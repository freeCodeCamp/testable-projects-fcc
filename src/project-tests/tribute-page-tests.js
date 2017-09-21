import { assert } from 'chai';
import $ from 'jquery';
import { responsiveWebDesignStack } from '../utils/shared-test-strings';

export default function createTributePageTests() {

  function getPropValue(el, prop) {
    return window.getComputedStyle(el).getPropertyValue(prop);
  }

  describe('#Tribute Page tests', function() {

    describe('#Technology Stack', function() {
      it(responsiveWebDesignStack, function() {
        assert.ok(true);
      });
    });

    describe('#Content', function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. My tribute page should have an element with corresponding
      id="main", which contains all other elements.`,
      function() {
        assert.isNotNull(document.getElementById('main'));
        assert(
          document.querySelectorAll('#main div, #main a, #main h1, #main img')
          .length,
          'element with id="main" must contain other elements'
        );
      });

      reqNum++;
      it(`${reqNum}. I should see an element with corresponding id="title",
      which contains a string (i.e. text) that describes the subject of the
      tribute page (e.g. "Dr. Norman Borlaug").`,
      function() {
        assert.isNotNull(document.getElementById('title'));
        const titleText = document.getElementById('title').innerText;
        assert.isAbove(
          titleText.length,
          0,
          'Element does not contain any text'
        );
      });

      reqNum++;
      it(`${reqNum}. I should see a <div> element with corresponding
      id="img-div".`,
      function() {
        assert.isNotNull(document.getElementById('img-div'));
      });

      reqNum++;
      it(`${reqNum}. Within the "img-div" element, I should see an <img> element
      with a corresponding id="image".`,
      function() {
        assert.isNotNull(document.getElementById('image'));
        assert.strictEqual(
          $('#img-div').find('#image').length,
          1,
          'Element is not a child of id="img-div" '
        );
      });

      reqNum++;
      it(`${reqNum}. Within the "img-div" element, I should see an element with
      a corresponding id="img-caption" that contains textual content describing
      the image shown in "img-div".`,
      function() {
        assert.isNotNull(document.getElementById('img-caption'));
        assert.strictEqual(
          $('#img-div').find('#img-caption').length,
          1,
          'Element is not a child of id="img-div" '
        );
        const captionContents =
          document.getElementById('img-caption').innerText;
        assert.isAbove(
          captionContents.length,
          0,
          'Element does not have any content '
        );
      });

      reqNum++;
      it(`${reqNum}. I should see an element with a corresponding
      id="tribute-info", which contains textual content describing the subject
      of the tribute page.`,
      function() {
        assert.isNotNull(document.getElementById('tribute-info'));
        const infoContents =
          document.getElementById('tribute-info').innerText;
        assert.isAbove(
          infoContents.length,
          0,
          'Element does not have any content '
        );
      });

      reqNum++;
      it(`${reqNum}. I should see an <a> element with a corresponding
      id="tribute-link", which links to an outside site that contains additional
      information about the subject of the tribute page. HINT: You must give
      your element an attribute of target and set it to "_blank" in order for
      your link to open in a new tab (i.e. target="_blank").`,
      function() {
        const tributeLink = document.getElementById('tribute-link');
        assert.isNotNull(tributeLink);
        assert(
          tributeLink.hasAttribute('href'),
          '<a> element with id="tribute-link" must contain an href attribute '
        );
        assert(
          tributeLink.hasAttribute('target'),
          '<a> element with id="tribute-link" must contain a target' +
          ' attribute '
        );
        assert.strictEqual(
          tributeLink.getAttribute('target'),
          '_blank',
          'The target attribute should be set to "_blank", in order for the' +
          'link to open in a new tab '
        );
      });

    // END #Content
    });

    describe('#Layout', function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. The <img> element should responsively resize, relative to
      the width of its parent element, without exceeding its original size.`,
      function() {
        const img = document.getElementById('image');
        const maxWidthValue = getPropValue(img, 'max-width');
        const displayValue = getPropValue(img, 'display');
        let heightValue;
        assert.notStrictEqual(
          maxWidthValue,
          'none',
          'Try using the "max-width" style property '
        );
        assert.equal(
          displayValue,
          'block',
          'Use the "display" style property with a value of "block" for' +
          'responsive images.'
        );
        // In order to determine if the height style is "auto", we
        // need to use a little trick. If we use getComputedStyle and the
        // element has an actual size we will get the actual pixels. So we
        // temporarily set the "display" style to "none", which will tell
        // us if the height is "auto".
        img.style.display = 'none';
        heightValue = getPropValue(img, 'height');
        assert.equal(
          heightValue,
          'auto',
          'Use the "height" style property with a value of "auto" for' +
          'responsive images.'
        );
        img.style.display = displayValue;
      });

      reqNum++;
      it(`${reqNum}. The <img> element should be centered within its parent
      element.`,
      function() {
        const img = document.getElementById('image'),
          imgParent = document.getElementById('image').parentElement,
          imgLeft = img.getBoundingClientRect().left,
          imgRight = img.getBoundingClientRect().right,
          parentLeft = imgParent.getBoundingClientRect().left,
          parentRight = imgParent.getBoundingClientRect().right;
        assert.approximately(
          imgLeft - parentLeft,
          parentRight - imgRight,
          11,
          'Image is not centered'
        );
      });

    // END #Layout
    });

  // END #TributePageTests
  });

// END createTributePageTests()
}
