// DRUM MACHINE TESTS:
export default function createDrumMachineTests() {

  const isChrome = !!window.chrome && !!window.chrome.webstore;
  if (isChrome === false) {
    FCC_Global.alertOnce('Drum Machine Alert', 'Some Drum Machine tests may fail in browsers other than Chrome');
  }

  describe('#Drum Machine tests', function() {

    // vars:
    const drumPads = document.querySelectorAll('.drum-pad');
    const audioElements = document.querySelectorAll('.drum-pad .clip');

    // functions:
    function __triggerKeyboardEvent(el, keyCode) {
      const eventObj = document.createEventObject
        ? document.createEventObject()
        : document.createEvent("Events");
      if (eventObj.initEvent) {
        eventObj.initEvent("keydown", true, true);
      }
      eventObj.keyCode = keyCode;
      eventObj.which = keyCode;
      el.dispatchEvent
        ? el.dispatchEvent(eventObj)
        : el.fireEvent("onkeydown", eventObj);
    }

    describe('#Tests', function() {

      it('1. I should be able to see an outer container with a corresponding id="drum-machine" that contains ' +
        'all other elements',
      function() {
        FCC_Global.assert.isNotNull(document.getElementById("drum-machine"));
        FCC_Global.assert(document.querySelectorAll(`#drum-machine div, #drum-machine .drum-pad, #drum-machine #display,
          #drum-machine .clip`).length, 'The #drum-machine element must contain other elements ');
      });

      it('2. Within #drum-machine I can see an element with corresponding id="display".', function() {
        FCC_Global.assert.isNotNull(document.getElementById("display"));
      });

      it('3. Within #drum-machine I can see 9 clickable "drum pad" elements, each with a class name of "drum-pad", ' +
        'a unique id that describes the audio clip the drum pad will be set up to trigger, and an inner text that ' +
        'corresponds to one of the following keys on the keyboard: Q, W, E, A, S, D, Z, X, C. The drum pads MUST be in this order.',
      function() {
        // using .isAtLeast() and .includeMembers() in this challenge so that users have the freedom to add more than 9 drum pads
        let drumPadInnerText = [];
        drumPads.forEach(pad => {
          drumPadInnerText.push(pad.innerText.replace(/\s/g, ''));
          FCC_Global.assert.strictEqual(pad.hasAttribute('id'), true, 'Each .drum-pad element must have an id attribute ');
        });
        FCC_Global.assert.isAtLeast(drumPads.length, 9, 'There should be at least 9 elements with the class "drum-pad" ');
        FCC_Global.assert.includeMembers(drumPadInnerText, // superset
            [ "Q", "W", "E", "A", "S", "D", "Z", "X", "C" ], // subset
            'Each .drum-pad\'s inner text should be one of the following letters ' + '(all letters must be represented): "Q", "W", "E", "A", "S", "D", "Z", "X", "C" ');
      });

      it('4. Within each .drum-pad, there should be an HTML5 <audio> element which has a src attribute pointing to ' +
        'an audio clip, a class name of "clip", and an id corresponding to the inner text of its parent .drum-pad ' +
        '(e.g. id="Q", id="W", id="E" etc.).',
      function() {
        FCC_Global.assert.isAtLeast(audioElements.length, 9, 'Each .drum-pad should have a child element with the class of "clip" ');
        audioElements.forEach(el => {
          FCC_Global.assert.strictEqual(el.nodeName, 'AUDIO', 'Each .clip element should be an HTML5 <audio> element ');
          FCC_Global.assert.strictEqual(el.hasAttribute('src'), true, 'Each <audio> element should have a "src" attribute ');
          FCC_Global.assert.strictEqual(el.hasAttribute('id'), true, 'Each <audio> element should have an "id" attribute ');
          FCC_Global.assert.strictEqual(el.id, el.parentElement.innerText.replace(/\s/g, ''), 'Each <audio> element should have an id equal ' + 'to its parent .drum-pad\'s inner-text ');
        });
      });

      it('5. When I click on a .drum-pad element, the audio clip contained in its child <audio> element ' +
        'should be triggered.',
      function() {
        FCC_Global.assert.isAtLeast(audioElements.length, 9, 'Audio elements do not exist ');
        audioElements.forEach(el => {
          document.getElementById(el.parentElement.id).click();
          FCC_Global.assert.isNotOk(document.getElementById(el.id).paused, 'The <audio> element with id="' + el.id + '" does not play when the ' + el.id + ' .drum-pad is clicked ');
        });
      });

      it('6. When I press the trigger key associated with each .drum-pad, the audio clip contained in ' +
        'its child <audio> element should be triggered (e.g. pressing the Q key should trigger the drum ' +
        'pad which contains the string "Q", pressing the W key should trigger the drum pad which contains ' +
        'the string "W", etc.).',
      function() {
        this.timeout(900);
        const keyCodes = [ 81, 87, 69, 65, 83, 68, 90, 88, 67 ];
        FCC_Global.assert.isAtLeast(audioElements.length, 9, 'Audio elements do not exist ');
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            audioElements.forEach((el, i) => {
              __triggerKeyboardEvent(document.getElementById(el.parentElement.id), keyCodes[i]);
              FCC_Global.assert.isNotOk(document.getElementById(el.id).paused, 'No audio plays when the ' + el.id + ' key is pressed ');
            });
            resolve();
          }, 800);
        });
      });

      it('7. When a .drum-pad is triggered, a string describing the associated audio clip is displayed as ' +
        'the inner text of the #display element (each string must be unique).',
      function() {
        this.timeout(900);
        let displayText = [];
        return new Promise((resolve, reject) => {
          setTimeout(_ => {
            drumPads.forEach((pad, i) => {
              document.getElementById(pad.id).click();
              displayText.push(document.getElementById('display').innerText);
            });
            displayText = displayText.filter((str, i) => displayText[0] === displayText[i]);
            if (displayText.length === 1) {
              resolve();
            } else {
              reject(new Error("Each time a drum pad is triggered, a unique string should be displayed in the " +
                "element with the id 'display' "));
            }
          }, 800);
        });
      });
    }); // END #Tests

  }); // END #DrumMachineTests
} // END createDrumMachineTests()
