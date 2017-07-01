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

  function getElements(elementIds) {
    return elementIds.map(elementId => document.getElementById(elementId));
  }

  function clickButtonsById(buttonIds) {
    const keys = getElements(buttonIds);
    keys.forEach(key => key.click());
  }

  function clearDisplay() {
    if (document.getElementById('clear'))
      clickButtonsById([_AC]);
    }

  describe('Calculator tests', function() {
    beforeEach(function() {
      clearDisplay();
    });

    after(function() {
      clearDisplay();
    });

    describe('#Tests', function() {
      it(`1. My calculator should contain a clickable element containing an =
      with a corresponding id="equals"`, function() {
        FCC_Global.assert.isNotNull(document.getElementById(_eq));
      });

      it(`2. My calculator should contain 10 clickable elements containing one
      number each from 0-9, with the following corresponding IDs: id="zero",
      id="one", id="two", id="three", id="four", id="five", id="six",
      id="seven", id="eight", and id="nine"`, function() {
        FCC_Global.assert.isNotNull(
          document.getElementById(_0),
          'id="zero" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_1),
          'id="one" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_2),
          'id="two" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_3),
          'id="three" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_4),
          'id="four" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_5),
          'id="five" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_6),
          'id="six" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_7),
          'id="seven" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_8),
          'id="eight" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_9),
          'id="nine" is not yet defined '
        );
      });

      it(`3. My calculator should contain 4 clickable elements each containing
      one of the 4 primary mathematical operators with the following
      corresponding IDs: id="add", id="subtract", id="multiply",
      id="divide"`, function() {
        FCC_Global.assert.isNotNull(
          document.getElementById(_plus),
          'id="add" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_min),
          'id="subtract" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_x),
          'id="multiply" is not yet defined '
        );
        FCC_Global.assert.isNotNull(
          document.getElementById(_div),
          'id="divide" is not yet defined '
        );
      });

      it(`4. My calculator should contain a clickable element containing a .
      with a corresponding id="decimal"`, function() {
        FCC_Global.assert.isNotNull(
          document.getElementById(_dec),
          'id="decimal" is not yet defined '
        );
      });

      it(`5. My calculator should contain a clickable element with an
      id="clear"`, function() {
        FCC_Global.assert.isNotNull(
          document.getElementById(_AC),
          'id="clear" is not yet defined '
        );
      });

      it(`6. My calculator should contain an element to display values with a
      corresponding id="display"`, function() {
        FCC_Global.assert.isNotNull(
          document.getElementById('display'),
          'id="display" is not yet defined '
        );
      });

      it(`7. At any time, pressing the clear button clears the input and output
      values, and returns the calculator to its initialized state; 0 should be
      shown in the element with the id of "display"`, function() {
        clickButtonsById([_5, _x, _1, _plus, _5, _plus, _9, _2, _eq, _AC]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '0',
          'Element with with id="display" should show 0 '
        );
      });

      it(`8. As I input numbers, I should be able to see my input in the
      element with the id of "display"`, function() {
        clickButtonsById([_1, _2, _3]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '123',
          'Numbers do not display correctly within id="display" '
        );
      });

      it(`9. In any order, I should be able to add, subtract, multiply and
      divide a chain of numbers of any length, and when I hit =, the correct
      result should be shown in the element with the id of "display"`,
      function() {
        clickButtonsById([_3, _plus, _5, _x, _6, _min, _2, _div, _4, _eq]);
        FCC_Global.assert(
          document.getElementById('display').innerHTML === '32.5' ||
          document.getElementById('display').innerHTML === '11.5',
          `The expression 3 + 5 * 6 - 2 / 4 should produce 32.5 or 11.5 as an
          answer, depending on the logic your calculator uses
          (formula vs. immediate execution) `
        );
        clearDisplay();
        clickButtonsById([_5, _min, _9, _plus, _5, _eq]);
        FCC_Global.assert(
          document.getElementById('display').innerHTML === '1',
          'The expression 5 - 9 + 5 should produce a result of 1 '
        );
      });

      it(`10. When inputting numbers, my calculator should not allow a number
      to begin with multiple zeros.`, function() {
        clickButtonsById([_0, _0, _0]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '0',
          'An input of 0 0 0 should display 0 '
        );
      });

      it(`11. When the decimal element is clicked, a . should append to the
      currently displayed value; two .s in one number should not be accepted`,
      function() {
        clickButtonsById([_5, _dec, _dec, _0]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '5.0',
          'An input of 5 . . 0 should display 5.0 '
        );
        clearDisplay();
        clickButtonsById([_5, _dec, _5, _dec, _5]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '5.55',
          'An input of 5 . 5 . 5 should display 5.55 '
        );
      });

      it(`12. I should be able to perform any operation (+, -, *, /) on numbers
      containing decimal points`, function() {
        clickButtonsById([_1, _0, _dec, _5, _min, _5, _dec, _5, _eq]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '5',
          'The expression 10.5 - 5.5 should produce an output of 5 '
        );
        clearDisplay();
        clickButtonsById([_5, _x, _5, _dec, _5, _eq]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '27.5',
          'The expression 5 * 5.5 should produce an output of 27.5 '
        );
        clearDisplay();
        clickButtonsById([_1, _0, _dec, _5, _plus, _5, _dec, _5, _eq]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '16',
          'The expression 10.5 + 5.5 should produce an output of 16 '
        );
        clearDisplay();
        clickButtonsById([_1, _0, _div, _2, _dec, _5, _eq]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '4',
          'The expression 10 / 2.5 should produce an output of 4 '
        );
      });

      it(`13. If 2 or more operators are entered consecutively, the operation
      performed should be the last operator entered`, function() {
        clickButtonsById([_5, _x, _min, _plus, _5, _eq]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '10',
          'The sequence 5 * - + 5 = should produce an output of 10 '
        );
        clearDisplay();
        clickButtonsById([_5, _plus, _plus, _5, _eq]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '10',
          'The sequence 5 + + 5 = should produce an output of 10 '
        );
      });

      it(`14. Pressing an operator immediately following = should start a new
      calculation that operates on the result of the previous evaluation`,
      function() {
        clickButtonsById([_5, _min, _2, _eq, _div, _2, _eq]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '1.5',
          'The sequence 5 - 2 = / 2 = should produce an output of 1.5 '
        );
        clearDisplay();
        clickButtonsById([_5, _plus, _5, _eq, _plus, _3, _eq]);
        FCC_Global.assert.strictEqual(
          document.getElementById('display').innerHTML,
          '13',
          'The sequence 5 + 3 = + 3 = should produce an output of 13 '
        );
      });

      it(`15. My calculator should have several decimal places of precision when
      it comes to rounding (note that there is no exact standard, but you should
      be able to handle calculations like 2 / 7 with reasonable precision to at
      least 4 decimal places)`, function() {
        clickButtonsById([_2, _div, _7, _eq]);
        FCC_Global.assert.isOk(/0?\.2857\d*/.test(
          document.getElementById('display').innerHTML),
          `The expression 2 / 7 should produce an output number with at least 4
          decimal places of precision `
        );
      });
    }); // END #Tests
  }); // END Calculator Tests
} // END createCalculatorTests()
