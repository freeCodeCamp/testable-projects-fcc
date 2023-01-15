import { assert } from 'chai';
import {
  clickButtonsByIdWithDelay,
  getInputValue
} from '../utils/element-utils';
import { frontEndLibrariesStack } from '../utils/shared-test-strings';
import { timeout } from '../utils/threading';

export default function createCalculatorTests() {
  const _1 = 'one';
  const _2 = 'two';
  const _3 = 'three';
  const _4 = 'four';
  const _5 = 'five';
  const _6 = 'six';
  const _7 = 'seven';
  const _8 = 'eight';
  const _9 = 'nine';
  const _0 = 'zero';
  const _x = 'multiply';
  const _plus = 'add';
  const _min = 'subtract';
  const _div = 'divide';
  const _AC = 'clear';
  const _eq = 'equals';
  const _dec = 'decimal';

  const DELAY = 200;
  const CLICK_DELAY = 10;

  function clearDisplay() {
    if (document.getElementById('clear')) {
      clickButtonsByIdWithDelay([_AC], CLICK_DELAY);
    }
  }

  // React 18 fix: Keep beforeEach callback async.
  describe('Calculator tests', function () {
    beforeEach(async function () {
      clearDisplay();
    });

    after(function () {
      clearDisplay();
    });

    describe('#Technology Stack', function () {
      it(frontEndLibrariesStack, function () {
        return true;
      });
    });

    describe('#Tests', function () {
      it(`My calculator should contain a clickable element
      containing an "=" (equal sign) with a corresponding id="equals"`, function () {
        let element = document.getElementById(_eq);
        assert.isNotNull(element);

        assert.strictEqual(
          getInputValue(element),
          '=',
          'The element with id="equal" should have an "=" as its content '
        );
      });

      it(`My calculator should contain 10 clickable elements
      containing one number each from 0-9, with the following corresponding
      IDs: id="zero", id="one", id="two", id="three", id="four", id="five",
      id="six", id="seven", id="eight", and id="nine"`, function () {
        assert.isNotNull(
          document.getElementById(_0),
          'id="zero" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_1),
          'id="one" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_2),
          'id="two" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_3),
          'id="three" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_4),
          'id="four" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_5),
          'id="five" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_6),
          'id="six" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_7),
          'id="seven" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_8),
          'id="eight" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_9),
          'id="nine" is not yet defined '
        );
      });

      it(`My calculator should contain 4 clickable elements each
      containing one of the 4 primary mathematical operators with the following
      corresponding IDs: id="add", id="subtract", id="multiply",
      id="divide"`, function () {
        assert.isNotNull(
          document.getElementById(_plus),
          'id="add" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_min),
          'id="subtract" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_x),
          'id="multiply" is not yet defined '
        );
        assert.isNotNull(
          document.getElementById(_div),
          'id="divide" is not yet defined '
        );
      });

      it(`My calculator should contain a clickable element
      containing a "." (decimal point) symbol with a corresponding
      id="decimal"`, function () {
        var element = document.getElementById(_dec);
        assert.isNotNull(element, 'id="decimal" is not yet defined ');

        assert.strictEqual(
          getInputValue(element),
          '.',
          'The element with id="decimal" should have "." as its content '
        );
      });

      it(`My calculator should contain a clickable element with an
      id="clear"`, function () {
        assert.isNotNull(
          document.getElementById(_AC),
          'id="clear" is not yet defined '
        );
      });

      it(`My calculator should contain an element to display values
      with a corresponding id="display"`, function () {
        assert.isNotNull(
          document.getElementById('display'),
          'id="display" is not yet defined '
        );
      });

      it(`At any time, pressing the clear button clears the input
      and output values, and returns the calculator to its initialized state; 0
      should be shown in the element with the id of "display"`, async function () {
        clickButtonsByIdWithDelay(
          [_5, _x, _1, _plus, _5, _plus, _9, _2, _eq, _AC],
          CLICK_DELAY
        );
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '0',
          'Element with with id="display" should show 0 '
        );
      });

      it(`As I input numbers, I should be able to see my input in
      the element with the id of "display"`, async function () {
        clickButtonsByIdWithDelay([_1, _2, _3], CLICK_DELAY);
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '123',
          'Numbers do not display correctly within id="display" '
        );
      });

      it(`In any order, I should be able to add, subtract, multiply
      and divide a chain of numbers of any length, and when I hit "=", the
      correct result should be shown in the element with the id of "display"`, async function () {
        clickButtonsByIdWithDelay(
          [_3, _plus, _5, _x, _6, _min, _2, _div, _4, _eq],
          CLICK_DELAY
        );
        await timeout(DELAY);
        assert(
          getInputValue(document.getElementById('display')) === '32.5' ||
            getInputValue(document.getElementById('display')) === '11.5',
          `The expression 3 + 5 * 6 - 2 / 4 should produce 32.5 or 11.5 as an
          answer, depending on the logic your calculator uses
          (formula vs. immediate execution) `
        );
        clearDisplay();
        clickButtonsByIdWithDelay([_5, _min, _9, _plus, _5, _eq], CLICK_DELAY);
        await timeout(DELAY);
        assert(
          getInputValue(document.getElementById('display')) === '1',
          'The expression 5 - 9 + 5 should produce a result of 1 '
        );
      });

      it(`When inputting numbers, my calculator should not allow a
      number to begin with multiple zeros.`, async function () {
        clickButtonsByIdWithDelay([_0, _0, _0], CLICK_DELAY);
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '0',
          'An input of 0 0 0 should display 0 '
        );
      });

      it(`When the decimal element is clicked, a "." should append to
      the currently displayed value; two "." in one number should not be
      accepted`, async function () {
        clickButtonsByIdWithDelay([_5, _dec, _dec, _0], CLICK_DELAY);
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '5.0',
          'An input of "5 . . 0" should display 5.0 '
        );
        clearDisplay();
        await timeout(DELAY);
        clickButtonsByIdWithDelay([_5, _dec, _5, _dec, _5], CLICK_DELAY);
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '5.55',
          'An input of "5 . 5 . 5" should display 5.55 '
        );
      });

      it(`I should be able to perform any operation (+, -, *, /) on
      numbers containing decimal points`, async function () {
        clickButtonsByIdWithDelay(
          [_1, _0, _dec, _5, _min, _5, _dec, _5, _eq],
          CLICK_DELAY
        );
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '5',
          'The expression "10.5 - 5.5" should produce an output of "5" '
        );
        clearDisplay();
        clickButtonsByIdWithDelay([_5, _x, _5, _dec, _5, _eq], CLICK_DELAY);
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '27.5',
          'The expression "5 * 5.5" should produce an output of "27.5" '
        );
        clearDisplay();
        clickButtonsByIdWithDelay(
          [_1, _0, _dec, _5, _plus, _5, _dec, _5, _eq],
          CLICK_DELAY
        );
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '16',
          'The expression "10.5 + 5.5" should produce an output of "16" '
        );
        clearDisplay();
        clickButtonsByIdWithDelay(
          [_1, _0, _div, _2, _dec, _5, _eq],
          CLICK_DELAY
        );
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '4',
          'The expression "10 / 2.5" should produce an output of "4" '
        );
      });

      it(`If 2 or more operators are entered consecutively, the
      operation performed should be the last operator entered (excluding
      the negative (-) sign.`, async function () {
        clickButtonsByIdWithDelay([_5, _x, _min, _5, _eq], CLICK_DELAY);
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '-25',
          'The sequence "5 * - 5" = should produce an output of "-25" '
        );
        clearDisplay();
        clickButtonsByIdWithDelay([_5, _x, _min, _plus, _5, _eq], CLICK_DELAY);
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '10',
          'The sequence "5 * - + 5" = should produce an output of "10" '
        );
        clearDisplay();
        clickButtonsByIdWithDelay([_5, _plus, _plus, _5, _eq], CLICK_DELAY);
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '10',
          'The sequence "5 + + 5" = should produce an output of "10" '
        );
      });

      it(`Pressing an operator immediately following "=" should
      start a new calculation that operates on the result of the previous
      evaluation`, async function () {
        clickButtonsByIdWithDelay(
          [_5, _min, _2, _eq, _div, _2, _eq],
          CLICK_DELAY
        );
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '1.5',
          'The sequence "5 - 2 = / 2 =" should produce an output of "1.5" '
        );
        clearDisplay();
        clickButtonsByIdWithDelay(
          [_5, _plus, _5, _eq, _plus, _3, _eq],
          CLICK_DELAY
        );
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          '13',
          'The sequence "5 + 5 = + 3 =" should produce an output of "13" '
        );
      });

      // test for invalid input
      it(`If input begins with an operator other than -, the input is
      invalid and should be handled appropriately`, async function () {
        clickButtonsByIdWithDelay([_plus, _5, _eq], CLICK_DELAY);
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          'Invalid Expression',
          'The sequence "+ 5 =" should produce an output of "Invalid Expression" '
        );
        clearDisplay();
        clickButtonsByIdWithDelay([_x, _5, _eq], CLICK_DELAY);
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          'Invalid Expression',
          'The sequence "* 5 =" should produce an output of "Invalid Expression" '
        );
        clearDisplay();
        clickButtonsByIdWithDelay([_div, _5, _eq], CLICK_DELAY);
        await timeout(DELAY);
        assert.strictEqual(
          getInputValue(document.getElementById('display')),
          'Invalid Expression',
          'The sequence "/ 5 =" should produce an output of "Invalid Expression" '
        );
      });

      it(`My calculator should have several decimal places of
      precision when it comes to rounding (note that there is no exact
      standard, but you should be able to handle calculations like "2 / 7" with
      reasonable precision to at least 4 decimal places)`, async function () {
        clickButtonsByIdWithDelay([_2, _div, _7, _eq], CLICK_DELAY);
        await timeout(DELAY);
        assert.isOk(
          /0?\.2857\d*/.test(getInputValue(document.getElementById('display'))),
          'The expression "2 / 7" should produce an output number with at ' +
            'least 4 decimal places of precision '
        );
      });

      // END #Tests
    });

    // END Calculator Tests
  });

  // END createCalculatorTests()
}
