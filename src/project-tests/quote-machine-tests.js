export default function createRandomQuoteMachineTests() {
  describe("Random Quote Machine tests", function() {

    const requestTimeout = 3000;

    function testHorizontallyCentered(elName) {
      const centeredElement = document.getElementById(elName);
      console.log(centeredElement);
      const actualSideGap = centeredElement.offsetLeft;
      const centeredElementWidth = centeredElement.clientWidth;
      const gapExpectedWidth = (window.innerWidth - centeredElementWidth) / 2;
      const delta = gapExpectedWidth - actualSideGap;
      console.log(gapExpectedWidth, actualSideGap, delta);
      return delta < 8.6 && delta > -3;
    }

    beforeEach(function() {});

    after(function() {});

    describe("#Content", function() {
      it('1. I can see a wrapper element with a corresponding id="quote-box".', function() {
        FCC_Global.assert.isNotNull(document.getElementById("quote-box"));
      });

      it('2. Within #quote-box, I can see an element with corresponding id="text".', function() {
        FCC_Global.assert.isNotNull(document.getElementById("text"), '#text is not defined ');
        FCC_Global.assert.strictEqual(document.querySelectorAll('#quote-box #text').length, 1, '#text is not a child of #quote-box ');
      });

      it('3. Within #quote-box, I can see an element with corresponding id="author".', function() {
        FCC_Global.assert.isNotNull(document.getElementById("author"), '#author is not defined ');
        FCC_Global.assert.strictEqual(document.querySelectorAll('#quote-box #author').length, 1, '#author is not a child of #quote-box ');
      });

      it('4. Within #quote-box, I can see a clickable element with corresponding id="new-quote".', function() {
        FCC_Global.assert.isNotNull(document.getElementById("new-quote"), '#new-quote is not defined ');
        FCC_Global.assert.strictEqual(document.querySelectorAll('#quote-box #new-quote').length, 1, '#new-quote button is not a child of #quote-box ');
      });

      it('5. Within #quote-box, I can see a clickable <a> element with corresponding id="tweet-quote".', function() {
        FCC_Global.assert.isNotNull(document.getElementById("tweet-quote"));
        FCC_Global.assert.strictEqual(document.getElementById("tweet-quote").nodeName , "A", '#tweet-quote element is not an <a> element' )
        FCC_Global.assert.strictEqual(document.querySelectorAll('#quote-box #tweet-quote').length, 1, '#tweet-quote element is not a child of #quote-box ');
      });

      it('6. On first load, my quote machine displays a random quote in the element with id="text".', function() {
        this.timeout(requestTimeout + 1000);
        return new Promise((resolve, reject) => {
          setTimeout(_ => {
            const text = document.getElementById("text");
            if (text.innerText.length > 0)
              resolve();
            else
              reject(new Error("There is no initial quote displayed "));
            }
          , requestTimeout);
        });
      });

      it('7. On first load, my quote machine displays the random quote\'s author in the element with id="author".', function() {
        this.timeout(requestTimeout + 1000);
        return new Promise((resolve, reject) => {
          setTimeout(_ => {
            const author = document.getElementById("author");
            if (author.innerText.length > 0)
              resolve();
            else
              reject(new Error("There is no initial author displayed "));
            }
          , requestTimeout);
        });
      });

      it("8. When the #new-quote button is clicked, my quote machine should fetch a new quote and display it in the #text element.", function(done) {
        this.timeout(requestTimeout + 1000);
        const prevText = document.getElementById("text").innerText;
        document.getElementById("new-quote").click();
        setTimeout(_ => {
          const newText = document.getElementById("text").innerText;
          if (newText === prevText) {
            done("The text hasn't changed after button click ");
          } else {
            done();
          }
        }, requestTimeout);
      });

      it("9. My quote machine should fetch the new quote\'s author when the #new-quote button is clicked and display it in the #author element.", function(done) {
        this.timeout(requestTimeout + 1000);
        const prevAuth = document.getElementById("author").innerText;
        document.getElementById("new-quote").click();
        setTimeout(_ => {
          const newAuth = document.getElementById("author").innerText;
          if (newAuth === prevAuth) {
            done("The text hasn't changed after button click ");
          } else {
            done();
          }
        }, requestTimeout);
      });

      it('10. I can tweet the current quote by clicking on the #tweet-quote <a> element. This <a> element should include the "twitter.com/intent/tweet" path in it\'s href attribute to tweet the current quote.', function() {
        this.timeout(requestTimeout + 1000);
        FCC_Global.assert.isOk(document.getElementById("tweet-quote").hasAttribute('href'), '#tweet-quote <a> element must have an href attribute ')
        const href = document.getElementById("tweet-quote").href;
        FCC_Global.assert.include(href.toLowerCase(), 'twitter.com/intent/tweet', 'The #tweet-quote element does not utilize the correct twitter intent ');
      });
    }) // END #Content

    describe("#Layout", function() {

      it('1. The #quote-box wrapper element should be horizontally centered. Please reset your browser\'s zoom level to 100%.', function() {
        FCC_Global.assert.isOk(testHorizontallyCentered('quote-box'));
      });

    }) // END #Layout
  }); // END Random Quote Machine tests
} // END createRandomQuoteMachineTests()
