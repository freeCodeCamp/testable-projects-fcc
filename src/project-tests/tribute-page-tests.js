import $ from "jquery";

export default function createTributePageTests() {

    function getPropValue(el, prop) {
        return window.getComputedStyle(el).getPropertyValue(prop);
    }

    describe("#Tribute Page tests", function() {

        describe("#Content", function() {
            it('1. My tribute page should have a main <div> element with corresponding id="main", which contains ' +
                'all other elements.',
                function() {
                    FCC_Global.assert.isNotNull(document.getElementById("main"));
                    FCC_Global.assert(document.querySelectorAll("#main div, #main a, #main h1, #main img").length, 'div with id="main" ' +
                        'must contain other elements');
                });

            it('2. I should see an <h1> element with corresponding id="title", which contains a string (i.e. text) ' +
                'that describes the subject of the tribute page (e.g. "Dr. Norman Borlaug").',
                function() {
                    FCC_Global.assert.isNotNull(document.getElementById("title"));
                    const titleText = document.getElementById("title").innerText;
                    FCC_Global.assert.isAbove(titleText.length, 0, "Element does not contain any text");
                });

            it('3. I should see a <div> element with corresponding id="img-div".', function() {
                FCC_Global.assert.isNotNull(document.getElementById("img-div"));
            });

            it('4. Within the "img-div" element, I should see an <img> element with a corresponding ' +
                'id="image".',
                function() {
                    FCC_Global.assert.isNotNull(document.getElementById("image"));
                    FCC_Global.assert.strictEqual($('#img-div').find('#image').length, 1, 'Element is not a child of id="img-div" ');
                });

            it('5. Within the "img-div" element, I should see an element with a corresponding id="img-caption" ' +
                'that contains textual content describing the image shown in "img-div".',
                function() {
                    FCC_Global.assert.isNotNull(document.getElementById("img-caption"));
                    FCC_Global.assert.strictEqual($('#img-div').find('#img-caption').length, 1, 'Element is not a child of id="img-div" ');
                    const captionContents = document.getElementById('img-caption').innerText;
                    FCC_Global.assert.isAbove(captionContents.length, 0, "Element does not have any content ");
                });

            it('6. I should see an element with a corresponding id="tribute-info", which contains textual content ' +
                'describing the subject of the tribute page.',
                function() {
                    FCC_Global.assert.isNotNull(document.getElementById('tribute-info'));
                    const infoContents = document.getElementById('tribute-info').innerText;
                    FCC_Global.assert.isAbove(infoContents.length, 0, "Element does not have any content ");
                });

            it('7. I should see an <a> element with a corresponding id="tribute-link", which links to an outside site ' +
                'that contains additional information about the subject of the tribute page. HINT: You must give your element an attribute of target and set it to "_blank" in order for your link to open in a new tab (i.e. target="_blank").',
                function() {
                    const tributeLink = document.getElementById('tribute-link');
                    FCC_Global.assert.isNotNull(tributeLink);
                    FCC_Global.assert(tributeLink.hasAttribute('href'), '<a> element with id="tribute-link" must contain an href attribute ');
                    FCC_Global.assert(tributeLink.hasAttribute('target'), '<a> element with id="tribute-link" must contain a target attribute ');
                    FCC_Global.assert.strictEqual(tributeLink.getAttribute('target'), '_blank', 'The target attribute should be set to "_blank", in order for the link to open in a new tab ');
                });
        }); // END #Content

        describe('#Layout', function() {

            it('1. The <img> element should responsively resize, relative to the width of its parent element, without ' +
                'exceeding its original size.',
                function() {
                    const img = document.getElementById('image');
                    const maxWidthValue = getPropValue(img, 'max-width');
                    FCC_Global.assert.notStrictEqual(maxWidthValue, 'none', 'Try using the "max-width" style property ');
                });

            it('2. The <img> element should be centered within its parent element.', function() {
                const img = document.getElementById('image'),
                  imgParent = document.getElementById('image').parentElement,
                  imgWidth = img.getBoundingClientRect().width,
                  parentPadLeft = parseInt(getPropValue(imgParent, 'padding-left')),
                  parentPadRight = parseInt(getPropValue(imgParent, 'padding-right')),
                  parentWidth = imgParent.getBoundingClientRect().width - (parentPadRight + parentPadLeft);
                  console.log(parentPadLeft, parentPadRight, parentWidth, imgParent.getBoundingClientRect().width, imgWidth)
                // difference in width between img and parent should be equal to the sum of left margin & right margin
                const difference = parseFloat(parentWidth) - parseFloat(imgWidth);
                // if margin value returns only one entry then all margins are 0, if returns more than one, we need second value.
                const totalMargin = getPropValue(img, 'margin').split(' ').length === 1 ? 0 : parseInt(getPropValue(img, 'margin').split(' ')[1]) * 2;
                FCC_Global.assert.approximately(Math.floor(difference), totalMargin, 11, 'Image is not centered ');
            });
        }); // END #Layout

    }); // END #TributePageTests
} // END createTributePageTests()


