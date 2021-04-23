import { assert } from 'chai';
import { testHorizontallyCentered } from '../utils/element-utils';
import { frontEndLibrariesStack } from '../utils/shared-test-strings';

export default function createRandomQuoteMachineTests() {
  describe('Random Quote Machine tests', function () {
    // We set the timeout at a very generous 15 seconds because it might take
    // a long time on a slow network to load a new quote. The tests are
    // written in a way that they will pass as soon as we detect success,
    // usually far sooner than 15 seconds.
    const requestTimeout = 15000;

    describe('#Technology Stack', function () {
      it(frontEndLibrariesStack, function () {
        return true;
      });
    });

    describe('#Content', function () {
      it(`I can see a wrapper element with a corresponding
      id="quote-box".`, function () {
        assert.isNotNull(document.getElementById('quote-box'));
      });

      it(`Within #quote-box, I can see an element with corresponding
      id="text".`, function () {
        assert.isNotNull(
          document.getElementById('text'),
          '#text is not defined '
        );
        assert.strictEqual(
          document.querySelectorAll('#quote-box #text').length,
          1,
          '#text is not a child of #quote-box '
        );
      });

      it(`Within #quote-box, I can see an element with corresponding
      id="author".`, function () {
        assert.isNotNull(
          document.getElementById('author'),
          '#author is not defined '
        );
        assert.strictEqual(
          document.querySelectorAll('#quote-box #author').length,
          1,
          '#author is not a child of #quote-box '
        );
      });

      it(`Within #quote-box, I can see a clickable element with
      corresponding id="new-quote".`, function () {
        assert.isNotNull(
          document.getElementById('new-quote'),
          '#new-quote is not defined '
        );
        assert.strictEqual(
          document.querySelectorAll('#quote-box #new-quote').length,
          1,
          '#new-quote button is not a child of #quote-box '
        );
      });

      it(`Within #quote-box, I can see a clickable <a> element with
      corresponding id="tweet-quote".`, function () {
        assert.isNotNull(document.getElementById('tweet-quote'));
        assert.strictEqual(
          document.getElementById('tweet-quote').nodeName,
          'A',
          '#tweet-quote element is not an <a> element'
        );
        assert.strictEqual(
          document.querySelectorAll('#quote-box #tweet-quote').length,
          1,
          '#tweet-quote element is not a child of #quote-box '
        );
      });

      it(`On first load, my quote machine displays a random quote in
      the element with id="text".`, function () {
        const text = document.getElementById('text');

        this.timeout(requestTimeout);

        if (text) {
          // Check every half second if the test passes. If we don't ever detect
          // the success condition, the test will fail by timing out.
          return new Promise((resolve) => {
            const intervalId = setInterval(() => {
              if (text.innerText.length > 0) {
                console.log('Clearing interval ' + intervalId);
                clearInterval(intervalId);
                resolve();
              }
            }, 500);
          });
        } else {
          return false;
        }
      });

      it(`On first load, my quote machine displays the random quote's
      author in the element with id="author".`, function () {
        const author = document.getElementById('author');

        this.timeout(requestTimeout);

        if (author) {
          return new Promise((resolve) => {
            const intervalId = setInterval(() => {
              if (author.innerText.length > 0) {
                console.log('Clearing interval ' + intervalId);
                clearInterval(intervalId);
                resolve();
              }
            }, 500);
          });
        } else {
          return false;
        }
      });

      it(`When the #new-quote button is clicked, my quote machine
      should fetch a new quote and display it in the #text element.`, function () {
        let prevText;
        const newQuoteBtn = document.getElementById('new-quote');

        this.timeout(requestTimeout);

        prevText = document.getElementById('text').innerText;
        newQuoteBtn.click();

        if (prevText) {
          return new Promise((resolve) => {
            const intervalId = setInterval(() => {
              const newText = document.getElementById('text').innerText;
              if (newText !== prevText) {
                clearInterval(intervalId);
                resolve();
              } else {
                newQuoteBtn.click();
              }
            }, 1000);
          });
        } else {
          return false;
        }
      });

      it(`My quote machine should fetch the new quote's author when
      the #new-quote button is clicked and display it in the #author element.`, function () {
        let prevAuth;
        const newQuoteBtn = document.getElementById('new-quote');

        this.timeout(requestTimeout);

        prevAuth = document.getElementById('author').innerText;
        newQuoteBtn.click();

        if (prevAuth) {
          return new Promise((resolve) => {
            const intervalId = setInterval(() => {
              const newAuth = document.getElementById('author').innerText;
              if (newAuth !== prevAuth) {
                clearInterval(intervalId);
                resolve();
              } else {
                newQuoteBtn.click();
              }
            }, 1000);
          });
        } else {
          return false;
        }
      });

      it(`I can tweet the current quote by clicking on the
      #tweet-quote <a> element. This <a> element should include the
      "twitter.com/intent/tweet" path in it's href attribute to tweet the
      current quote.`, function () {
        assert.isOk(
          document.getElementById('tweet-quote').hasAttribute('href'),
          '#tweet-quote <a> element must have an href attribute '
        );
        const href = document.getElementById('tweet-quote').href;
        assert.include(
          href.toLowerCase(),
          'twitter.com/intent/tweet',
          'The #tweet-quote element does not utilize the correct twitter ' +
            'intent '
        );
      });

      // END #Content
    });

    describe('#Layout', function () {
      it(`The #quote-box wrapper element should be horizontally
      centered. Please run tests with browser's zoom level at 100% and page
      maximized.`, function () {
        assert.isOk(testHorizontallyCentered('quote-box', window));
      });

      // END #Layout
    });

    // END Random Quote Machine tests
  });

  // END createRandomQuoteMachineTests()
}
