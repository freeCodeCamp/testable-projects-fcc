import { assert } from 'chai';
import { clickButtonsById } from '../utils/element-utils';
import { frontEndLibrariesStack } from '../utils/shared-test-strings';

export default function createPomodoroClockTests() {

  const breakMin = 'break-decrement';
  const breakPlus = 'break-increment';
  const seshMin = 'session-decrement';
  const seshPlus = 'session-increment';
  const reset = 'reset';
  const startStop = 'start_stop';
  const orignalTimerLabel = document.getElementById('timer-label') &&
  document.getElementById('timer-label').innerText;

  function resetTimer() {
    clickButtonsById([reset]);
  }

  function getMinutes(str) {
    const matches = (/^(\d{1,4})\s?([\.:,\/]\s?\d{2}.*)?$/g).exec(str);
    return matches[1];
  }

  function getSeconds(str) {
    const matches = (/^\d{1,4}\s?:\s?(\d{2})/g).exec(str);
    return matches[1];
  }

  // TODO: Check all instances of observer.disconnect() to make sure it's used
  // correctly.
  function observeElement(elementId, callback) {
    // select the target node
    var target = document.getElementById(elementId);

    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function() {
        callback();
      });
    });

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

  // We "Hack" the global setTimeout and setInterval functions so time elapses
  // faster (delay is forced to 30ms)
  // Note: we should consider putting these hacks in the beforeEach function
  // so every timed test can be done in less time
  // The problem is that we still don't know if it's acceptable to use this
  // hack, because it implies forcing the campers to use setTimeout and
  // setInterval functions to measure time in their pomodoro.
  const savedSetTimeout = window.setTimeout;
  const savedSetInterval = window.setInterval;

  function hackGlobalTimerFunctions() {
    window.setTimeout = (fun) => {
      return savedSetTimeout(fun, 30);
    };
    window.setInterval = (fun) => {
      return savedSetInterval(fun, 30);
    };
  }

  function restoreGlobalTimerFunctions() {
    window.setTimeout = savedSetTimeout;
    window.setInterval = savedSetInterval;
  }

  // Test suite
  describe('#Pomodoro Clock tests', function() {
    before(function() {
      clickButtonsById([startStop]);
    });

    beforeEach(function() {
      resetTimer();
      // We "Hack" the global setTimeout and setInterval functions so time
      // elapses faster (delay is forced to 30ms)
      hackGlobalTimerFunctions();
    });

    afterEach(function() {
      restoreGlobalTimerFunctions();
    });

    after(function() {
      resetTimer();
      restoreGlobalTimerFunctions();
    });

    describe('#Technology Stack',
    function() {
      it(frontEndLibrariesStack, function() {
        return true;
      });
    });

    describe('#Content',
    function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. I can see an element with id="break-label" that contains a
      string (e.g. “Break Length”).`, function() {
        const breakTitle = document.getElementById('break-label');
        assert.isAbove(
          breakTitle.innerText.length,
          0,
          'Element does not contain a string'
        );
      });

      reqNum++;
      it(`${reqNum}. I can see an element with id="session-label" that contains
      a string (e.g. "Session Length”).`,
      function() {
        const sessionTitle = document.getElementById('session-label');
        assert.isAbove(
          sessionTitle.innerText.length,
          0,
          'Element does not contain a string'
        );
      });

      reqNum++;
      it(`${reqNum}. I can see two clickable elements with corresponding IDs:
      id="break-decrement" and id="session-decrement".`,
      function() {
        assert.isNotNull(document.getElementById('break-decrement'));
        assert.isNotNull(document.getElementById('session-decrement'));
      });

      reqNum++;
      it(`${reqNum}. I can see two clickable elements with corresponding IDs:
      id="break-increment" and id="session-increment".`,
      function() {
        assert.isNotNull(document.getElementById('break-increment'));
        assert.isNotNull(document.getElementById('session-increment'));
      });

      reqNum++;
      it(`${reqNum}. I can see an element, with corresponding id="break-length",
      which by default (on load) displays a value of 5.`,
      function() {
        const breakLength = document.getElementById('break-length');
        assert.strictEqual(
          breakLength.innerHTML,
          '5',
          'A value of 5 is not displayed by default'
        );
      });

      reqNum++;
      it(`${reqNum}. I can see an element, with corresponding
      id="session-length", which by default displays a value of 25.`,
      function() {
        const sessionLength = document.getElementById('session-length');
        assert.strictEqual(
          sessionLength.innerHTML,
          '25',
          'A value of 25 is not displayed by default'
        );
      });

      reqNum++;
      it(`${reqNum}. I can see an element, with corresponding id="timer-label",
      that contains a string indicating a session is initialized
      (e.g. "Session").`,
      function() {
        const timerLabel = document.getElementById('timer-label');
        assert.isAbove(
          timerLabel.innerText.length,
          0,
          'Element does not contain a string'
        );
      });

      reqNum++;
      it(`${reqNum}. I can see an element with corresponding id="time-left".
      NOTE: Paused or running, the value in this field should always be
      displayed in mm:ss format (i.e. 25:00).`,
      function() {
        assert.isNotNull(document.getElementById('time-left'));
      });

      reqNum++;
      it(`${reqNum}. I can see a clickable element with corresponding
      id="start_stop".`,
      function() {
        assert.isNotNull(document.getElementById('start_stop'));
      });

      reqNum++;
      it(`${reqNum}. I can see a clickable element with corresponding
      id="reset".`,
      function() {
        assert.isNotNull(document.getElementById('reset'));
      });
    });

    describe('#Timer',
    function() {
      let reqNum = 0;
      reqNum++;
      it(`${reqNum}. When I click the element with the id of "reset", any
      running timer should be stopped, the value within id="break-length" should
      return to 5, the value within id="session-length" should return to 25, and
      the element with id="time-left" should reset to it's default state.`,
      function() {
        this.timeout(5000);
        // decrement session and break length
        clickButtonsById(Array(60).fill(seshMin));
        clickButtonsById(Array(60).fill(breakMin));
        // start the pomodoro
        clickButtonsById([startStop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById('time-left');
          const observer = observeElement('time-left', () => {
            if (timeLeft.innerHTML === '00:00') {
              // once timer has reached zero wait 1.5 seconds then reset and
              // see if every default value is reset
              setTimeout(() => {
                resetTimer();
                const timerLabelAfterReset = document.getElementById(
                  'timer-label'
                ).innerText;
                const secondsAfterReset = getSeconds(
                  document.getElementById('time-left').innerHTML
                );

                // see if timer label changed back
                if (orignalTimerLabel !== timerLabelAfterReset) {
                  reject(
                    new Error('Default timer label was not properly reset')
                  );
                }

                // wait another 1.5 seconds to be sure value has not changed
                // (pomodoro is stopped)
                setTimeout(() => {
                  const breakLenAfterResetCorrect = (
                    document.getElementById('break-length').innerHTML === '5'
                  );
                  const sessionLenAfterResetCorrect = (
                    document.getElementById('session-length').innerHTML === '25'
                  );
                  if (
                    !breakLenAfterResetCorrect || !sessionLenAfterResetCorrect
                  ) {
                    reject(
                      new Error(
                        'Default values for break length and session' +
                        'length were not properly reset'
                      )
                    );
                    return;
                  }
                  const secondsAfterAWhile = getSeconds(
                    document.getElementById('time-left').innerHTML
                  );
                  if (secondsAfterReset === secondsAfterAWhile) {
                    resolve();
                  } else {
                    reject(
                      new Error(
                        'Pomodoro has paused but time continued elapsing'
                      )
                    );
                  }
                }, 1500);

              }, 1500);
              observer.disconnect();
            }
          });
        });
      });

      reqNum++;
      it(`${reqNum}. When I click the element with the id of "break-decrement",
      the value within id="break-length" decrements by a value of 1, and I can
      see the updated value.`,
      function() {
        clickButtonsById([breakMin, breakMin, breakMin, breakMin]);
        assert.strictEqual(
          document.getElementById('break-length').innerHTML,
          '1'
        );
        resetTimer();
        clickButtonsById([breakMin]);
        assert.strictEqual(
          document.getElementById('break-length').innerHTML,
          '4'
        );
      });

      reqNum++;
      it(`${reqNum}. When I click the element with the id of "break-increment",
      the value within id="break-length" increments by a value of 1, and I can
      see the updated value.`,
      function() {
        clickButtonsById(Array(4).fill(breakPlus));
        assert.strictEqual(
          document.getElementById('break-length').innerHTML,
          '9'
        );
        resetTimer();
        clickButtonsById([breakPlus]);
        assert.strictEqual(
          document.getElementById('break-length').innerHTML, '6'
        );
      });

      reqNum++;
      it(`${reqNum}. When I click the element with the id of
      "session-decrement", the value within id="session-length" decrements by a
      value of 1, and I can see the updated value.`,
      function() {
        clickButtonsById(Array(4).fill(seshMin));
        assert.strictEqual(
          document.getElementById('session-length').innerHTML,
          '21'
        );
        resetTimer();
        clickButtonsById([seshMin]);
        assert.strictEqual(
          document.getElementById('session-length').innerHTML,
          '24'
        );
      });

      reqNum++;
      it(`${reqNum}. When I click the element with the id of
      "session-increment", the value within id="session-length" increments by a
      value of 1, and I can see the updated value.`,
      function() {
        clickButtonsById(Array(4).fill(seshPlus));
        assert.strictEqual(
          document.getElementById('session-length').innerHTML,
          '29'
        );
        resetTimer();
        clickButtonsById([seshPlus]);
        assert.strictEqual(
          document.getElementById('session-length').innerHTML,
          '26'
        );
      });

      reqNum++;
      it(`${reqNum}. I should not be able to set a session or break length to
      <= 0.`,
      function() {
        clickButtonsById(Array(10).fill(breakMin));
        assert.strictEqual(
          document.getElementById('break-length').innerHTML,
          '1',
          'Value in element with id of "break-length" is less than 1.'
        );
        resetTimer();
        clickButtonsById(Array(30).fill(seshMin));
        assert.strictEqual(
          document.getElementById('session-length').innerHTML,
          '1',
          'Value in element with id of "session-length" is less than 1.'
        );
      });

      reqNum++;
      it(`${reqNum}. I should not be able to set a session or break length to
      > 60.`,
      function() {
        clickButtonsById(Array(60).fill(breakPlus));
        assert.strictEqual(
          document.getElementById('break-length').innerHTML,
          '60',
          'Value in element with id of "break-length" is greater than 60.'
        );
        resetTimer();
        clickButtonsById(Array(40).fill(seshPlus));
        assert.strictEqual(
          document.getElementById('session-length').innerHTML,
          '60',
          'Value in element with id of "session-length" is greater than 60.'
        );
      });

      reqNum++;
      it(`${reqNum}. When I first click the element with id="start_stop", the
      timer should begin running from the value currently displayed in
      id="session-length", even if the value has been incremented or
      decremented from the original value of 25.`,
      function() {
        clickButtonsById([startStop]);
        assert.strictEqual(
          getMinutes(
            document.getElementById('time-left').innerHTML
          ),
          document.getElementById('session-length').innerHTML
        );
      });

      reqNum++;
      it(`${reqNum}. If the timer is running, the element with the id of
      "time-left" should display the remaining time in mm:ss format
      (decrementing by a value of 1 and updating the display every 1000ms).`,
      function() {
        this.timeout(2500);
        // start the pomodoro
        clickButtonsById([startStop]);
        const secondsBefore = getSeconds(
          document.getElementById('time-left').innerHTML
        );
        return new Promise((resolve, reject) => {
          // wait 1.5 seconds then see if displayed time has changed
          // (decremented)
          setTimeout(() => {
            const secondsAfter = getSeconds(
              document.getElementById('time-left').innerHTML
            );
            if (secondsAfter > secondsBefore) {
              resolve();
            } else {
              reject(
                new Error(
                  'Pomodoro has started but time displayed is not changing'
                )
              );
            }
          }, 1500);
        });
      });

      reqNum++;
      it(`${reqNum}. If the timer is running and I click the element with
      id="start_stop", the countdown should pause.`,
      function() {
        this.timeout(4000);
        // start the pomodoro
        clickButtonsById([startStop]);
        const secondsBefore = getSeconds(
          document.getElementById('time-left').innerHTML
        );
        return new Promise((resolve, reject) => {
          // wait 1.5 seconds then see if displayed time has changed
          setTimeout(() => {
            const secondsAfter = getSeconds(
              document.getElementById('time-left').innerHTML
            );
            if (secondsAfter === secondsBefore) {
              reject(
                new Error(
                  'Pomodoro has started but time displayed is not changing'
                )
              );
              return;
            }
            // Pause the pomodoro
            clickButtonsById([startStop]);
            // wait another 1.5 seconds to be sure value has not changed
            setTimeout(() => {
              const secondsAfterPause = getSeconds(
                document.getElementById('time-left').innerHTML
              );
              if (secondsAfter === secondsAfterPause) {
                resolve();
              } else {
                reject(
                  new Error('Pomodoro has paused but time continued elapsing')
                );
              }
            }, 1500);
          }, 1500);
        });
      });

      reqNum++;
      it(`${reqNum}. If the timer is paused and I click the element with
      id="start_stop", the countdown should resume running from the point at
      which it was paused.`,
      function() {
        this.timeout(5000);
        // start the pomodoro
        clickButtonsById([startStop]);
        const secondsBefore = getSeconds(
          document.getElementById('time-left').innerHTML
        );
        return new Promise((resolve, reject) => {
          // wait 1.5 seconds then see if displayed time has changed
          setTimeout(() => {
            const secondsAfter = getSeconds(
              document.getElementById('time-left').innerHTML
            );
            if (secondsAfter === secondsBefore) {
              reject(
                new Error(
                  'Pomodoro has started but time displayed is not changing'
                )
              );
              return;
            }
            // Pause the pomodoro
            clickButtonsById([startStop]);
            // wait another 1.5 seconds to be sure value has not changed
            setTimeout(() => {
              const secondsAfterPause = getSeconds(
                document.getElementById('time-left').innerHTML
              );
              if (secondsAfter !== secondsAfterPause) {
                reject(
                  new Error('Pomodoro has paused but time continued elapsing')
                );
                return;
              }
              // Resume the pomodoro
              clickButtonsById([startStop]);
              // wait another 1.5 seconds to be sure time is decrementing again
              setTimeout(() => {
                const secondsAfterResume = getSeconds(
                  document.getElementById('time-left').innerHTML
                );
                if (secondsAfterPause > secondsAfterResume) {
                  resolve();
                } else {
                  reject(
                    new Error(
                      'Pomodoro has resumed but displayed time is not changing'
                    )
                  );
                }
              }, 1500);
            }, 1500);
          }, 1500);
        });
      });

      reqNum++;
      it(`${reqNum}. When a session countdown reaches zero (NOTE: timer MUST
      reach 00:00), and a new countdown begins, the element with the id of
      "timer-label" should display a string indicating a break has begun.`,
      function() {
        this.timeout(5000);
        // we decrement session time to the minimum (1 minute)
        clickButtonsById(Array(60).fill(seshMin));
        // start the pomodoro
        clickButtonsById([startStop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById('time-left');
          const breakLength = document.getElementById('break-length');
          // Save label to test that it has changed below
          let tLabelA = document.getElementById('timer-label').innerHTML;
          let shouldBeInBreak = false;
          const observer = observeElement('time-left', () => {
            if (timeLeft.innerHTML === '00:00') {
              shouldBeInBreak = true;
            } else if (parseInt(timeLeft.innerHTML.slice(0, 2), 10) > 5) {
              reject(
                new Error(
                  'Test timed out because Break time didn\'t start with the ' +
                  'correct value: ' + (
                    parseInt(getMinutes(timeLeft.innerHTML), 10) + 1
                  ) + ' instead of ' + breakLength.innerHTML
                )
              );
              observer.disconnect();
            } else if (shouldBeInBreak) {
              let tLabelB = document.getElementById('timer-label').innerHTML;
              if (tLabelB !== tLabelA) {
                resolve();
              } else {
                reject(
                  new Error(
                    'Timer has reached zero but didn\'t switch to Break time'
                  )
                );
              }
              observer.disconnect();
            }
          });
        });
      });

      reqNum++;
      it(`${reqNum}. When a session countdown reaches zero (NOTE: timer MUST
      reach 00:00), a new break countdown should begin, counting down from the
      value currently displayed in the id="break-length" element.`,
      function() {
        this.timeout(5000);
        // we decrement session time to the minimum (1 minute)
        clickButtonsById(Array(60).fill(seshMin));
        // start the pomodoro
        clickButtonsById([startStop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById('time-left');
          let shouldBeInBreak = false;
          // Since not requiring specific labels, save the 'session' label to a
          // variable, then test within observer function that label has changed
          // to know when in break
          let sessionLabel = document.getElementById('timer-label').innerHTML;
          const observer = observeElement('time-left', () => {
            const currentTimer = document.getElementById('timer-label');
            const breakLength = document.getElementById('break-length');
            if (timeLeft.innerHTML === '00:00') {
              shouldBeInBreak = true;
            } else if (parseInt(timeLeft.innerHTML.slice(0, 2), 10) > 5) {
              reject(
                new Error(
                  'Timer has switched to Break time, but it didn\'t start ' +
                  'with the correct value: ' + (
                    parseInt(getMinutes(timeLeft.innerHTML), 10) + 1
                  ) + ' instead of ' + breakLength.innerHTML
                )
              );
              observer.disconnect();

            } else if (shouldBeInBreak) {
              if (currentTimer.innerHTML !== sessionLabel) {
                let getTimeLeftHTML = +getMinutes(timeLeft.innerHTML);
                if (getTimeLeftHTML === +breakLength.innerHTML) {
                  resolve();
                } else {
                  reject(
                    new Error(
                      'Timer has switched to Break time, but it didn\'t ' +
                      'start with the correct value: ' +
                      getMinutes(timeLeft.innerHTML) + ' instead of ' +
                      breakLength.innerHTML
                    )
                  );
                  observer.disconnect();
                }
              } else {
                reject(
                  new Error(
                    'Timer has reached zero but didn\'t switch to Break time'
                  )
                );
              }
              observer.disconnect();
            }
          });
        });
      });

      reqNum++;
      it(`${reqNum}. When a break countdown reaches zero (NOTE: timer MUST reach
      00:00), and a new countdown begins, the element with the id of
      "timer-label" should display a string indicating a session has begun.`,
      function() {
        this.timeout(5000);
        // decrement session length and break length to the minimum (1 minute)
        clickButtonsById(Array(60).fill(seshMin));
        clickButtonsById(Array(60).fill(breakMin));
        // start the pomodoro
        clickButtonsById([startStop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById('time-left');
          let shouldBeInBreak = false;
          let shouldBeInSessionAgain = false;
          let breakLabel;
          const observer = observeElement('time-left', () => {
            if (timeLeft.innerHTML === '00:00') {
              if (!shouldBeInBreak && !shouldBeInSessionAgain) {
                shouldBeInBreak = true;
              } else {
                shouldBeInSessionAgain = true;
                shouldBeInBreak = false;
                // when in break, save 'break' label to var, then test below
                // that label has changed
                breakLabel = document.getElementById('timer-label').innerHTML;
              }
            } else if (shouldBeInSessionAgain) {
              let timerLabel = document.getElementById('timer-label').innerHTML;
              if (timerLabel !== breakLabel) {
                resolve();
              } else {
                reject(
                  new Error(
                    'Timer has reached zero but didn\'t switch back to ' +
                    'Session time'
                  )
                );
              }
              observer.disconnect();
            }
          });
        });
      });

      reqNum++;
      it(`${reqNum}. When a break countdown reaches zero (NOTE: timer MUST
      reach 00:00), a new session countdown should begin, counting down from
      the value currently displayed in the id="session-length" element.`,
      function() {
        this.timeout(5000);
        // decrement session length and break length to the minimum (1 minute)
        clickButtonsById(Array(60).fill(seshMin));
        clickButtonsById(Array(60).fill(breakMin));
        // start the pomodoro
        clickButtonsById([startStop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById('time-left');
          let shouldBeInBreak = false;
          let shouldBeInSessionAgain = false;
          let breakLabel;
          const observer = observeElement('time-left', () => {
            if (timeLeft.innerHTML === '00:00') {
              if (!shouldBeInBreak && !shouldBeInSessionAgain) {
                shouldBeInBreak = true;
              } else {
                shouldBeInSessionAgain = true;
                shouldBeInBreak = false;
                // when in break, save 'break' label to var, then test below
                // that label has changed
                breakLabel = document.getElementById('timer-label').innerHTML;
              }
            } else if (shouldBeInSessionAgain) {
              const currentTimer = document.getElementById('timer-label');
              const sessionLength = document.getElementById('session-length');
              if (currentTimer.innerHTML !== breakLabel) {
                let getTimeLeftHTML = +getMinutes(timeLeft.innerHTML);
                if (getTimeLeftHTML === +sessionLength.innerHTML) {
                  resolve();
                } else {
                  reject(
                    new Error(
                      'Timer has switched back to Session time, but it ' +
                      'didn\'t start with the correct value: ' +
                      getMinutes(timeLeft.innerHTML) + ' instead of ' +
                      sessionLength.innerHTML
                    )
                  );
                }
              } else {
                reject(
                  new Error(
                    'Timer has reached zero but didn\'t switch back to ' +
                    'Session time'
                  )
                );
              }
              observer.disconnect();
            }
          });
        });
      });
    });

    describe('#Audio',
    function() {
      let reqNum = 0;
      reqNum++;
      it(`${reqNum}. When a countdown reaches zero (NOTE: timer MUST reach
      00:00), a sound indicating that time is up should play. This should
      utilize an HTML5 <audio> tag and have a corresponding id="beep".`,
      function() {
        this.timeout(5000);
        // decrement session time to the minimum (1 minute)
        clickButtonsById(Array(60).fill(seshMin));
        // start the pomodoro
        clickButtonsById([startStop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById('time-left');
          const breakLength = document.getElementById('break-length');
          const observer = observeElement('time-left', () => {
            if (parseInt(timeLeft.innerHTML.slice(0, 2), 10) > 5) {
              reject(
                new Error(
                  'Test timed out because Break time didn\'t start with ' +
                  'the correct value: ' + (
                    parseInt(getMinutes(timeLeft.innerHTML), 10) + 1
                  ) + ' instead of ' + breakLength.innerHTML
                )
              );
            } else if (timeLeft.innerHTML === '00:00') {
              // note: sound has to be longer than 200 ms, or the test will
              // fail if the sound stops before the test actually happens
              savedSetTimeout(() => {
                const audioElem = document.getElementById('beep');

                if (audioElem && !audioElem.paused) {
                  resolve();
                } else {
                  reject(
                    new Error(
                      'Timer has reached zero but, either there is not ' +
                      'audio tag with ID "beep" on the page, or it\'s not ' +
                      'playing while it should.'
                    )
                  );
                }
              }, 200);
              observer.disconnect();
            }
          });
        });
      });

      reqNum++;
      it(`${reqNum}. The audio element with id="beep" must be 1 second or
      longer.`,
      function() {
        assert.isAbove(
          document.getElementById('beep').duration,
          1,
          'Audio element with id="beep" is not at least 1 second long.'
        );
      });

      reqNum++;
      it(`${reqNum}. The audio element with id of "beep" must stop playing and
      be rewound to the beginning when the element with the id of "reset" is
      clicked.`,
      function() {
        // Call document.getElementById('beep') each time to overcome framework
        // cache
        document.getElementById('beep').play();
        resetTimer();

        assert.isTrue(
          document.getElementById('beep').paused,
          'Audio element was not stopped when reset was clicked.'
        );

        assert.equal(
          0,
          document.getElementById('beep').currentTime,
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
