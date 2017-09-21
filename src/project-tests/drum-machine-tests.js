import { assert } from 'chai';
import { frontEndLibrariesStack } from '../utils/shared-test-strings';

// DRUM MACHINE TESTS:
export default function createDrumMachineTests() {

  describe('#Drum Machine tests', function() {

    // vars:
    const drumPads = document.querySelectorAll('.drum-pad');
    const audioElements = document.querySelectorAll('.drum-pad .clip');

    // functions:
    function __triggerKeyboardEvent(el, keyCode) {
      const eventObj = document.createEventObject
        ? document.createEventObject()
        : document.createEvent('Events');
      if (eventObj.initEvent) {
        eventObj.initEvent('keydown', true, true);
      }
      eventObj.keyCode = keyCode;
      eventObj.which = keyCode;
      /* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
      el.dispatchEvent
        ? el.dispatchEvent(eventObj)
        : el.fireEvent('onkeydown', eventObj);
    }


    describe('#Technology Stack', function() {
      it(frontEndLibrariesStack, function() {
        return true;
      });
    });

    describe('#Tests', function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. I should be able to see an outer container with a
      corresponding id="drum-machine" that contains all other elements`,
      function() {
        assert.isNotNull(document.getElementById('drum-machine'));
        assert(
          document.querySelectorAll(
            '#drum-machine div, #drum-machine .drum-pad, #drum-machine ' +
            '#display, #drum-machine .clip'
          ).length,
          'The #drum-machine element must contain other elements '
        );
      });

      reqNum++;
      it(`${reqNum}. Within #drum-machine I can see an element with
      corresponding id="display".`,
      function() {
        assert.isNotNull(document.getElementById('display'));
      });

      reqNum++;
      it(`${reqNum}. Within #drum-machine I can see 9 clickable "drum pad"
      elements, each with a class name of "drum-pad", a unique id that describes
      the audio clip the drum pad will be set up to trigger, and an inner text
      that corresponds to one of the following keys on the keyboard: Q, W, E, A,
      S, D, Z, X, C. The drum pads MUST be in this order.`,
      function() {
        // using .isAtLeast() and .includeMembers() in this challenge so that
        // users have the freedom to add more than 9 drum pads
        let drumPadInnerText = [];
        drumPads.forEach(pad => {
          drumPadInnerText.push(pad.innerText.replace(/\s/g, ''));
          assert.strictEqual(
            pad.hasAttribute('id'),
            true,
            'Each .drum-pad element must have an id attribute '
          );
        });
        assert.isAtLeast(
          drumPads.length,
          9,
          'There should be at least 9 elements with the class "drum-pad" '
        );
        // drumPadInnerText is the superset, the array of letters is the subset.
        assert.includeMembers(
          drumPadInnerText,
          [ 'Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C' ],
          'Each .drum-pad\'s inner text should be one of the following ' +
          'letters (all letters must be represented): "Q", "W", "E", "A", ' +
          '"S", "D", "Z", "X", "C" '
        );
      });

      reqNum++;
      it(`${reqNum}. Within each .drum-pad, there should be an HTML5 <audio>
      element which has a src attribute pointing to an audio clip, a class name
      of "clip", and an id corresponding to the inner text of its parent
      .drum-pad (e.g. id="Q", id="W", id="E" etc.).`,
      function() {
        assert.isAtLeast(
          audioElements.length,
          9,
          'Each .drum-pad should have a child element with the class of "clip" '
        );
        audioElements.forEach(el => {
          assert.strictEqual(
            el.nodeName,
            'AUDIO',
            'Each .clip element should be an HTML5 <audio> element '
          );
          assert.strictEqual(
            el.hasAttribute('src'),
            true,
            'Each <audio> element should have a "src" attribute '
          );
          assert.strictEqual(
            el.hasAttribute('id'),
            true,
            'Each <audio> element should have an "id" attribute '
          );
          assert.strictEqual(
            el.id,
            el.parentElement.innerText.replace(/\s/g, ''),
            'Each <audio> element should have an id equal to its parent ' +
            '.drum-pad\'s inner-text '
          );
        });
      });

      reqNum++;
      it(`${reqNum}. When I click on a .drum-pad element, the audio clip
      contained in its child <audio> element should be triggered.`,
      function() {
        assert.isAtLeast(
          audioElements.length,
          9,
          'Audio elements do not exist '
        );
        audioElements.forEach(el => {
          document.getElementById(el.parentElement.id).click();
          assert.isNotOk(
            document.getElementById(el.id).paused,
            'The <audio> element with id="' + el.id +
            '" does not play when the ' + el.id + ' .drum-pad is clicked '
          );
        });
      });

      reqNum++;
      it(`${reqNum}. When I press the trigger key associated with each
      .drum-pad, the audio clip contained in its child <audio> element should be
      triggered (e.g. pressing the Q key should trigger the drum pad which
      contains the string "Q", pressing the W key should trigger the drum pad
      which contains the string "W", etc.).`,
      function() {
        this.timeout(900);
        const keyCodes = [ 81, 87, 69, 65, 83, 68, 90, 88, 67 ];
        assert.isAtLeast(
          audioElements.length,
          9,
          'Audio elements do not exist '
        );
        return new Promise(resolve => {
          setTimeout(() => {
            audioElements.forEach((el, i) => {
              __triggerKeyboardEvent(
                document.getElementById(el.parentElement.id),
                keyCodes[i]
              );
              assert.isNotOk(
                document.getElementById(el.id).paused,
                'No audio plays when the ' + el.id + ' key is pressed '
              );
            });
            resolve();
          }, 800);
        });
      });

      reqNum++;
      it(`${reqNum}. When a .drum-pad is triggered, a string describing the
      associated audio clip is displayed as the inner text of the #display
      element (each string must be unique).`,
      function() {
        this.timeout(900);
        let displayText = [];
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            drumPads.forEach(pad => {
              document.getElementById(pad.id).click();
              displayText.push(document.getElementById('display').innerText);
            });
            displayText = displayText.filter((str, i) =>
              displayText[0] === displayText[i]
            );
            if (displayText.length === 1) {
              resolve();
            } else {
              reject(new Error(
                'Each time a drum pad is triggered, a unique string should ' +
                'be displayed in the element with the id "display"'
              ));
            }
          }, 800);
        });
      });

    });
    // END #Tests

  // END #DrumMachineTests
  });

// END createDrumMachineTests()
}
