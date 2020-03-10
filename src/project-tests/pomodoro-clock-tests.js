import { assert } from 'chai';
import { clickButtonsById, getInputValue } from '../utils/element-utils';
import { frontEndLibrariesStack } from '../utils/shared-test-strings';
import { timeout } from '../utils/threading';

export default function createPomodoroClockTests() {
  const breakMin = 'break-decrement';
  const breakPlus = 'break-increment';
  const seshMin = 'session-decrement';
  const seshPlus = 'session-increment';
  const reset = 'reset';
  const startStop = 'start_stop';
  const originalTimerLabel =
    document.getElementById('timer-label') &&
    document.getElementById('timer-label').innerText;

  function resetTimer() {
    clickButtonsById([reset]);
  }
  // The regex checks for correct time format ([mm]mm:ss)
  const timerRe = new RegExp(/^(\d{2,4})[\.:,\/](\d{2})$/);

  function getMinutes(str) {
    return timerRe.exec(str)[1];
  }

  function getSeconds(str) {
    return timerRe.exec(str)[2];
  }
  /* eslint-enable max-len*/

  function observeElement(target, callback) {
    // create an observer instance
    var observer = new MutationObserver(callback);

    // configuration of the observer:
    var config = {
      childList: true,
      characterData: true,
      subtree: true
    };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    return observer;
  }

  const waitForState = (target, check, errMsg, timeout = 2000) =>
    new Promise((resolve, reject) => {
      const timerId = savedSetTimeout(() => {
        observer.disconnect();
        clearTimeout(waitForChangesTimerId);
        reject(new Error(errMsg));
      }, timeout);

      // If a target does not change for 5 seconds,
      // then stop waiting for changes.
      const waitForChangesTimerId = savedSetTimeout(() => {
        observer.disconnect();
        clearTimeout(timerId);
        reject(new Error(errMsg));
      }, 5000);

      const observer = observeElement(target, () => {
        clearTimeout(waitForChangesTimerId);
        if (check()) {
          observer.disconnect();
          clearTimeout(timerId);
          resolve();
        }
      });
    });

  // Resolves when the timer reaches 00:00.
  const timerHasReachedZero = (timeout = 90000) => {
    const target = document.getElementById('time-left');
    return waitForState(
      target,
      () => /^00[\.:,\/]00$/.test(target.innerText),
      'Timer has not reached 00:00.',
      timeout
    );
  };

  // Resolves when the timer changes.
  const timerStateHasChanged = () => {
    const target = document.getElementById('time-left');
    return waitForState(target, () => true, 'Timer has not changed.');
  };

  // We "Hack" the global setTimeout and setInterval functions so time elapses
  // faster (delay is forced to 30ms)
  // The problem is that we still don't know if it's acceptable to use this
  // hack, because it implies forcing the campers to use setTimeout and
  // setInterval functions to measure time in their pomodoro.
  // In cases where hacking does not work, we wait for the timer
  // as much time as is usually required for it.
  const savedSetTimeout = window.setTimeout;
  const savedSetInterval = window.setInterval;

  function hackGlobalTimerFunctions() {
    window.setTimeout = fun => {
      return savedSetTimeout(fun, 30);
    };
    window.setInterval = fun => {
      return savedSetInterval(fun, 30);
    };
  }

  function restoreGlobalTimerFunctions() {
    window.setTimeout = savedSetTimeout;
    window.setInterval = savedSetInterval;
  }

  // Test suite
  describe('#Pomodoro Clock tests', function() {
    beforeEach(function() {
      resetTimer();
    });

    afterEach(function() {
      restoreGlobalTimerFunctions();
    });

    after(function() {
      resetTimer();
      restoreGlobalTimerFunctions();
    });

    describe('#Technology Stack', function() {
      it(frontEndLibrariesStack, function() {
        return true;
      });
    });

    describe('#Content', function() {
      it(`I can see an element with id="break-label" that contains a
      string (e.g. “Break Length”).`, function() {
        const breakTitle = document.getElementById('break-label');
        assert.isAbove(
          breakTitle.innerText.length,
          0,
          'Element does not contain a string'
        );
      });

      it(`I can see an element with id="session-label" that contains
      a string (e.g. "Session Length”).`, function() {
        const sessionTitle = document.getElementById('session-label');
        assert.isAbove(
          sessionTitle.innerText.length,
          0,
          'Element does not contain a string'
        );
      });

      it(`I can see two clickable elements with corresponding IDs:
      id="break-decrement" and id="session-decrement".`, function() {
        assert.isNotNull(document.getElementById('break-decrement'));
        assert.isNotNull(document.getElementById('session-decrement'));
      });

      it(`I can see two clickable elements with corresponding IDs:
      id="break-increment" and id="session-increment".`, function() {
        assert.isNotNull(document.getElementById('break-increment'));
        assert.isNotNull(document.getElementById('session-increment'));
      });

      it(`I can see an element, with corresponding id="break-length",
      which by default (on load) displays a value of 5.`, function() {
        const breakLength = document.getElementById('break-length');
        assert.strictEqual(
          getInputValue(breakLength),
          '5',
          'A value of 5 is not displayed by default'
        );
      });

      it(`I can see an element, with corresponding
      id="session-length", which by default displays a value of 25.`, function() {
        const sessionLength = document.getElementById('session-length');
        assert.strictEqual(
          getInputValue(sessionLength),
          '25',
          'A value of 25 is not displayed by default'
        );
      });

      it(`I can see an element, with corresponding id="timer-label",
      that contains a string indicating a session is initialized
      (e.g. "Session").`, function() {
        const timerLabel = document.getElementById('timer-label');
        assert.isAbove(
          timerLabel.innerText.length,
          0,
          'Element does not contain a string'
        );
      });

      it(`I can see an element with corresponding id="time-left".
      NOTE: Paused or running, the value in this field should always be
      displayed in mm:ss format (i.e. 25:00).`, function() {
        const target = document.getElementById('time-left');
        assert.isNotNull(target);
        assert.strictEqual(
          getMinutes(target.innerText),
          '25',
          'time-left is not formatted correctly'
        );
        // Set session length to 60
        clickButtonsById(Array(35).fill(seshPlus));
        assert.strictEqual(
          getMinutes(target.innerText),
          '60',
          'time-left is not formatted correctly'
        );
      });

      it(`I can see a clickable element with corresponding
      id="start_stop".`, function() {
        assert.isNotNull(document.getElementById('start_stop'));
      });

      it(`I can see a clickable element with corresponding
      id="reset".`, function() {
        assert.isNotNull(document.getElementById('reset'));
      });
    });

    describe('#Timer', function() {
      it(`When I click the element with the id of "reset", any
      running timer should be stopped, the value within id="break-length" should
      return to 5, the value within id="session-length" should return to 25, and
      the element with id="time-left" should reset to it's default state.`, async function() {
        this.timeout(100000);

        hackGlobalTimerFunctions();
        // decrement session and break length
        clickButtonsById(Array(60).fill(seshMin));
        clickButtonsById(Array(60).fill(breakMin));
        // start the pomodoro
        clickButtonsById([startStop]);

        // wait while timer reaches 00:00
        await timerHasReachedZero();

        restoreGlobalTimerFunctions();
        // once timer has reached zero wait 1.5 seconds then reset and
        // see if every default value is reset
        await timeout(1500);

        resetTimer();
        const timerLabelAfterReset = document.getElementById('timer-label')
          .innerText;
        const secondsAfterReset = getSeconds(
          document.getElementById('time-left').innerText
        );

        // see if timer label changed back
        assert.strictEqual(
          timerLabelAfterReset,
          originalTimerLabel,
          'Default timer label was not properly reset '
        );

        // wait another 1.5 seconds to be sure value has not changed
        // (pomodoro is stopped)
        await timeout(1500);

        assert.strictEqual(
          getInputValue(document.getElementById('break-length')),
          '5',
          'Default values for break length were not properly reset'
        );

        assert.strictEqual(
          getInputValue(document.getElementById('session-length')),
          '25',
          'Default values for session length were not properly reset'
        );

        const secondsAfterAWhile = getSeconds(
          document.getElementById('time-left').innerText
        );

        assert.strictEqual(
          secondsAfterAWhile,
          secondsAfterReset,
          'Pomodoro has paused but time continued elapsing'
        );
      });

      it(`When I click the elements with the id of "break-decrement" and "break-increment" at 
      the same time, the time indicated by the element with the id, "time-left", remains unchanged 
      and equal to the value of the element with the id, "session-length".`, async function() {
        clickButtonsById([breakMin, breakPlus]);

        await timeout(1500);

        const timeLeftMins = getMinutes(
          document.getElementById('time-left').innerText
        );
        const sessionLength = getInputValue(
          document.getElementById('session-length')
        );

        assert.strictEqual(
          timeLeftMins,
          sessionLength,
          'id="time-left" element has been changed'
        );

        resetTimer();
      });

      it(`When I click the element with the id of "break-decrement",
      the value within id="break-length" decrements by a value of 1, and I can
      see the updated value.`, function() {
        clickButtonsById([breakMin, breakMin, breakMin, breakMin]);
        assert.strictEqual(
          getInputValue(document.getElementById('break-length')),
          '1'
        );
        resetTimer();
        clickButtonsById([breakMin]);
        assert.strictEqual(
          getInputValue(document.getElementById('break-length')),
          '4'
        );
      });

      it(`When I click the element with the id of "break-increment",
      the value within id="break-length" increments by a value of 1, and I can
      see the updated value.`, function() {
        clickButtonsById(Array(4).fill(breakPlus));
        assert.strictEqual(
          getInputValue(document.getElementById('break-length')),
          '9'
        );
        resetTimer();
        clickButtonsById([breakPlus]);
        assert.strictEqual(
          getInputValue(document.getElementById('break-length')),
          '6'
        );
      });

      it(`When I click the element with the id of
      "session-decrement", the value within id="session-length" decrements by a
      value of 1, and I can see the updated value.`, function() {
        clickButtonsById(Array(4).fill(seshMin));
        assert.strictEqual(
          getInputValue(document.getElementById('session-length')),
          '21'
        );
        resetTimer();
        clickButtonsById([seshMin]);
        assert.strictEqual(
          getInputValue(document.getElementById('session-length')),
          '24'
        );
      });

      it(`When I click the element with the id of
      "session-increment", the value within id="session-length" increments by a
      value of 1, and I can see the updated value.`, function() {
        clickButtonsById(Array(4).fill(seshPlus));
        assert.strictEqual(
          getInputValue(document.getElementById('session-length')),
          '29'
        );
        resetTimer();
        clickButtonsById([seshPlus]);
        assert.strictEqual(
          getInputValue(document.getElementById('session-length')),
          '26'
        );
      });

      it(`I should not be able to set a session or break length to
      <= 0.`, function() {
        clickButtonsById(Array(10).fill(breakMin));
        assert.strictEqual(
          getInputValue(document.getElementById('break-length')),
          '1',
          'Value in element with id of "break-length" is less than 1.'
        );
        resetTimer();
        clickButtonsById(Array(30).fill(seshMin));
        assert.strictEqual(
          getInputValue(document.getElementById('session-length')),
          '1',
          'Value in element with id of "session-length" is less than 1.'
        );
      });

      it(`I should not be able to set a session or break length to
      > 60.`, function() {
        clickButtonsById(Array(60).fill(breakPlus));
        assert.strictEqual(
          getInputValue(document.getElementById('break-length')),
          '60',
          'Value in element with id of "break-length" is greater than 60.'
        );
        resetTimer();
        clickButtonsById(Array(40).fill(seshPlus));
        assert.strictEqual(
          getInputValue(document.getElementById('session-length')),
          '60',
          'Value in element with id of "session-length" is greater than 60.'
        );
      });

      it(`When I first click the element with id="start_stop", the
      timer should begin running from the value currently displayed in
      id="session-length", even if the value has been incremented or
      decremented from the original value of 25.`, function() {
        clickButtonsById([startStop]);
        assert.strictEqual(
          getMinutes(document.getElementById('time-left').innerText),
          getInputValue(document.getElementById('session-length'))
        );
      });

      it(`If the timer is running, the element with the id of
      "time-left" should display the remaining time in mm:ss format
      (decrementing by a value of 1 and updating the display every 1000ms).`, async function() {
        this.timeout(2500);
        // start the pomodoro
        clickButtonsById([startStop]);

        const secondsBefore = getSeconds(
          document.getElementById('time-left').innerText
        );

        // wait 1.5 seconds then see if displayed time has changed
        // (decremented)
        await timeout(1500);

        const secondsAfter = getSeconds(
          document.getElementById('time-left').innerText
        );

        assert.isAbove(
          +secondsAfter,
          +secondsBefore,
          'Pomodoro has started but time displayed is not changing '
        );
      });

      it(`If the timer is running and I click the element with
      id="start_stop", the countdown should pause.`, async function() {
        this.timeout(4000);
        // start the pomodoro
        clickButtonsById([startStop]);

        const secondsBefore = getSeconds(
          document.getElementById('time-left').innerText
        );

        // wait 1.5 seconds then see if displayed time has changed
        await timeout(1500);

        const secondsAfter = getSeconds(
          document.getElementById('time-left').innerText
        );

        assert.notStrictEqual(
          secondsAfter,
          secondsBefore,
          'Pomodoro has started but time displayed is not changing'
        );

        // Pause the pomodoro
        clickButtonsById([startStop]);

        // wait another 1.5 seconds to be sure value has not changed
        await timeout(1500);

        const secondsAfterPause = getSeconds(
          document.getElementById('time-left').innerText
        );

        assert.strictEqual(
          secondsAfterPause,
          secondsAfter,
          'Pomodoro has paused but time continued elapsing'
        );
      });

      it(`If the timer is paused and I click the element with
      id="start_stop", the countdown should resume running from the point at
      which it was paused.`, async function() {
        this.timeout(6000);
        // start the pomodoro
        clickButtonsById([startStop]);

        const secondsBefore = getSeconds(
          document.getElementById('time-left').innerText
        );

        // wait 1.5 seconds then see if displayed time has changed
        await timeout(1500);

        const secondsAfter = getSeconds(
          document.getElementById('time-left').innerText
        );

        assert.notStrictEqual(
          secondsAfter,
          secondsBefore,
          'Pomodoro has started but time displayed is not changing'
        );

        // Pause the pomodoro
        clickButtonsById([startStop]);

        // wait another 1.5 seconds to be sure value has not changed
        await timeout(1500);

        const secondsAfterPause = getSeconds(
          document.getElementById('time-left').innerText
        );

        assert.strictEqual(
          secondsAfterPause,
          secondsAfter,
          'Pomodoro has paused but time continued elapsing'
        );

        // Resume the pomodoro
        clickButtonsById([startStop]);

        // wait another 1.5 seconds to be sure time is decrementing again
        await timeout(1500);

        const secondsAfterResume = getSeconds(
          document.getElementById('time-left').innerText
        );

        assert.isBelow(
          +secondsAfterResume,
          +secondsAfterPause,
          'Pomodoro has resumed but displayed time is not changing '
        );
      });

      it(`When a session countdown reaches zero (NOTE: timer MUST
      reach 00:00), and a new countdown begins, the element with the id of
      "timer-label" should display a string indicating a break has begun.`, async function() {
        this.timeout(100000);
        hackGlobalTimerFunctions();
        // we decrement session time to the minimum (1 minute)
        clickButtonsById(Array(60).fill(seshMin));
        // start the pomodoro
        clickButtonsById([startStop]);

        let tLabelA = document.getElementById('timer-label').innerHTML;

        await timerHasReachedZero();
        await timerStateHasChanged();

        const breakLength = +getInputValue(
          document.getElementById('break-length')
        );
        const breakTime = +getMinutes(
          document.getElementById('time-left').innerText
        );
        assert.isAtMost(
          breakTime,
          breakLength,
          "Break time didn't start with the correct value."
        );

        let tLabelB = document.getElementById('timer-label').innerHTML;

        assert.notStrictEqual(
          tLabelB,
          tLabelA,
          "Timer has reached zero but didn't switch to Break time"
        );
      });

      it(`When a session countdown reaches zero (NOTE: timer MUST
      reach 00:00), a new break countdown should begin, counting down from the
      value currently displayed in the id="break-length" element.`, async function() {
        this.timeout(100000);
        hackGlobalTimerFunctions();
        // we decrement session time to the minimum (1 minute)
        clickButtonsById(Array(60).fill(seshMin));
        // start the pomodoro
        clickButtonsById([startStop]);

        let sessionLabel = document.getElementById('timer-label').innerHTML;

        await timerHasReachedZero();
        await timerStateHasChanged();

        const currentTimer = document.getElementById('timer-label').innerHTML;
        assert.notStrictEqual(
          currentTimer,
          sessionLabel,
          "Timer has reached zero but didn't switch to Break time"
        );

        const breakLength = +getInputValue(
          document.getElementById('break-length')
        );
        const breakTime = +getMinutes(
          document.getElementById('time-left').innerText
        );
        assert.strictEqual(
          breakTime,
          breakLength,
          "Timer has switched to Break time, but it didn't start with " +
            'the correct value.'
        );
      });

      it(`When a break countdown reaches zero (NOTE: timer MUST reach
      00:00), and a new countdown begins, the element with the id of
      "timer-label" should display a string indicating a session has begun.`, async function() {
        this.timeout(200000);
        hackGlobalTimerFunctions();
        // decrement session length and break length to the minimum (1 minute)
        clickButtonsById(Array(60).fill(seshMin));
        clickButtonsById(Array(60).fill(breakMin));
        // start the pomodoro
        clickButtonsById([startStop]);

        await timerHasReachedZero();
        await timerStateHasChanged();

        const breakLabel = document.getElementById('timer-label').innerHTML;

        await timerHasReachedZero();
        await timerStateHasChanged();

        const timerLabel = document.getElementById('timer-label').innerHTML;

        assert.notStrictEqual(
          timerLabel,
          breakLabel,
          "Timer has reached zero but didn't switch back to Session time."
        );
      });

      it(`When a break countdown reaches zero (NOTE: timer MUST
      reach 00:00), a new session countdown should begin, counting down from
      the value currently displayed in the id="session-length" element.`, async function() {
        this.timeout(200000);
        hackGlobalTimerFunctions();
        // decrement session length and break length to the minimum (1 minute)
        clickButtonsById(Array(60).fill(seshMin));
        clickButtonsById(Array(60).fill(breakMin));
        // start the pomodoro
        clickButtonsById([startStop]);

        await timerHasReachedZero();
        await timerStateHasChanged();

        const breakLabel = document.getElementById('timer-label').innerHTML;

        await timerHasReachedZero();
        await timerStateHasChanged();

        const timerLabel = document.getElementById('timer-label').innerHTML;

        assert.notStrictEqual(
          timerLabel,
          breakLabel,
          "Timer has reached zero but didn't switch back to Session time."
        );

        const sessionLength = +getInputValue(
          document.getElementById('session-length')
        );
        const currentTime = +getMinutes(
          document.getElementById('time-left').innerText
        );
        assert.strictEqual(
          currentTime,
          sessionLength,
          'Timer has switched back to Session time, but it ' +
            "didn't start with the correct value."
        );
      });
    });

    describe('#Audio', function() {
      it(`When a countdown reaches zero (NOTE: timer MUST reach
      00:00), a sound indicating that time is up should play. This should
      utilize an HTML5 <audio> tag and have a corresponding id="beep".`, async function() {
        this.timeout(100000);

        assert.isNotNull(
          document.querySelector('audio#beep'),
          'There is no audio tag with ID "beep" on the page.'
        );

        hackGlobalTimerFunctions();
        // decrement session time to the minimum (1 minute)
        clickButtonsById(Array(60).fill(seshMin));
        // start the pomodoro
        clickButtonsById([startStop]);

        await timerHasReachedZero();

        restoreGlobalTimerFunctions();

        await timeout(200);

        assert.isFalse(
          document.getElementById('beep').paused,
          'Timer has reached zero but audio is not playing while it should.'
        );
      });

      it(`The audio element with id="beep" must be 1 second or
      longer.`, async function() {
        const audio = document.querySelector('audio#beep');
        assert.isNotNull(
          audio,
          'There is no audio tag with ID "beep" on the page.'
        );

        if (audio.readyState === 0) {
          // Wait for the audio to load.
          await new Promise(resolve => {
            const listener = audio.addEventListener('loadeddata', () => {
              if (audio.readyState > 0) {
                audio.removeEventListener('loadeddata', listener);
                resolve();
              }
            });
          });
        }

        assert.isAbove(
          document.getElementById('beep').duration,
          1,
          'Audio element with id="beep" is not at least 1 second long.'
        );
      });

      it(`The audio element with id of "beep" must stop playing and
      be rewound to the beginning when the element with the id of "reset" is
      clicked.`, function() {
        // Call document.getElementById('beep') each time to overcome framework
        // cache
        document.getElementById('beep').play();
        resetTimer();

        assert.isTrue(
          document.getElementById('beep').paused,
          'Audio element was not stopped when reset was clicked.'
        );

        assert.strictEqual(
          document.getElementById('beep').currentTime,
          0,
          'Audio element was not rewound when reset was clicked. HINT: use ' +
            'the currentTime property of the audio element to rewind.'
        );
      });
      // END #Audio
    });
    // END #PomodoroClockTests
  });
  // END createPomodoroClockTests()
}
