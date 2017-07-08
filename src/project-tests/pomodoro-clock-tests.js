export default function createPomodoroClockTests() {

  const _break_min = "break-decrement";
  const _break_plus = "break-increment";
  const _sesh_min = "session-decrement";
  const _sesh_plus = "session-increment";
  const _reset = "reset";
  const _start_stop = "start_stop";
  const orignalTimerLabel = document.getElementById('timer-label') && document.getElementById('timer-label').innerText;

  function getElements(elementIds) {
    return elementIds.map(elementId => document.getElementById(elementId));
  }

  function clickButtonsById(buttonIds) {
    const keys = getElements(buttonIds);
    keys.forEach(key => key.click());
  }

  function resetTimer() {
    document.getElementById('reset') && clickButtonsById([_reset]);
  }

  function getMinutes(str) {
    const matches = /^(\d{1,4})\s?([\.:,\/]\s?\d{2}.*)?$/g.exec(str);
    return matches[1];
  }

  function getSeconds(str) {
    const matches = /^\d{1,4}\s?:\s?(\d{2})/g.exec(str);
    return matches[1];
  }

  function observeElement(elementId, callback) {
    // select the target node
    var target = document.getElementById(elementId);

    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        callback(mutation.type);
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

  // We "Hack" the global setTimeout and setInterval functions so time elapses faster (delay is forced to 30ms)
  // Note: we should consider putting these hacks in the beforeEach function so every timed test can be done in less time
  // The problem is that we still don't know if it's acceptable to use this hack, because it implies forcing the campers to use setTimeout and setInterval functions to measure time in their pomodoro.
  const savedSetTimeout = window.setTimeout;
  const savedSetInterval = window.setInterval;

  function hackGlobalTimerFunctions() {
    window.setTimeout = (fun, delay) => {
      return savedSetTimeout(fun, 30);
    };
    window.setInterval = (fun, delay) => {
      return savedSetInterval(fun, 30);
    };
  }

  function restoreGlobalTimerFunctions() {
    window.setTimeout = savedSetTimeout;
    window.setInterval = savedSetInterval;
  }

  // Test suite
  describe("#Pomodoro Clock tests", function() {
    before(function() {
      document.getElementById('start_stop') && clickButtonsById([_start_stop]);
    });

    beforeEach(function() {
      resetTimer();
      // We "Hack" the global setTimeout and setInterval functions so time elapses faster (delay is forced to 30ms)
      hackGlobalTimerFunctions();
    });

    afterEach(function() {
      restoreGlobalTimerFunctions();
    })

    after(function() {
      resetTimer();
      restoreGlobalTimerFunctions();
    });

    describe("#Tests", function() {

      it('1. I can see an element with id="break-label" that contains a string (e.g. “Break Length).', function() {
        const break_title = document.getElementById("break-label");
        FCC_Global.assert.isAbove(break_title.innerText.length, 0, "Element does not contain a string");
      });

      it('2. I can see an element with id="session-label" that contains a string (e.g. "Session Length”).', function() {
        const session_title = document.getElementById("session-label");
        FCC_Global.assert.isAbove(session_title.innerText.length, 0, "Element does not contain a string");
      });

      it("3. I can see two clickable elements with corresponding IDs: " +
        "id=\"break-decrement\" and id=\"session-decrement\".",
      function() {
        FCC_Global.assert.isNotNull(document.getElementById("break-decrement"));
        FCC_Global.assert.isNotNull(document.getElementById("session-decrement"));
      });

      it("4. I can see two clickable elements with corresponding IDs: " +
        "id=\"break-increment\" and id=\"session-increment\".",
      function() {
        FCC_Global.assert.isNotNull(document.getElementById("break-increment"));
        FCC_Global.assert.isNotNull(document.getElementById("session-increment"));
      });

      it("5. I can see an element, with corresponding id=\"break-length\", which by default (on load) " +
        "displays a value of 5.",
      function() {
        const break_length = document.getElementById("break-length");
        FCC_Global.assert.strictEqual(break_length.innerHTML, "5", "A value of 5 is not displayed by default");
      });

      it("6. I can see an element, with corresponding id=\"session-length\", which by default" +
        "displays a value of 25.",
      function() {
        const session_length = document.getElementById("session-length");
        FCC_Global.assert.strictEqual(session_length.innerHTML, "25", "A value of 25 is not displayed by default");
      });

      it("7. I can see an element, with corresponding id=\"timer-label\", that contains a string indicating a session is initialized (e.g. \"Session\").", function() {
        const timer_label = document.getElementById("timer-label");
        FCC_Global.assert.isAbove(timer_label.innerText.length, 0, "Element does not contain a string");
      });

      it("8. I can see an element with corresponding id=\"time-left\". NOTE: Paused or running, the value in this field should always be displayedin mm:ss format (i.e. 25:00).", function() {
        FCC_Global.assert.isNotNull(document.getElementById("time-left"));
      });

      it("9. I can see a clickable element with corresponding id=\"start_stop\".", function() {
        FCC_Global.assert.isNotNull(document.getElementById("start_stop"));
      });

      it("10. I can see a clickable element with corresponding id=\"reset\".", function() {
        FCC_Global.assert.isNotNull(document.getElementById("reset"));
      });

      it('11. When I click the element with the id of "reset", any running timer should be stopped, the value within id="break-length" should return to 5, the value within id="session-length" should return to 25, and the element with id="time-left" should reset to it\'s default state.', function() {
        this.timeout(5000);
        // decrement session and break length
        clickButtonsById(Array(60).fill(_sesh_min));
        clickButtonsById(Array(60).fill(_break_min));
        // start the pomodoro
        clickButtonsById([_start_stop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById("time-left");
          const observer = observeElement("time-left", modType => {
            if (timeLeft.innerHTML === "00:00") {
              // once timer has reached zero wait 1.5 seconds then reset and see if every default value is reset
              setTimeout(_ => {
                resetTimer();
                const timerLabelAfterReset = document.getElementById('timer-label').innerText;
                const secondsAfterReset = getSeconds(document.getElementById("time-left").innerHTML);

                // see if timer label changed back
                if (orignalTimerLabel !== timerLabelAfterReset) {
                  reject(new Error("Default timer label was not properly reset"));
                }

                // wait another 1.5 seconds to be sure value has not changed (pomodoro is stopped)
                setTimeout(_ => {
                  const breakLengthAfterResetIsCorrect = document.getElementById("break-length").innerHTML == 5;
                  const sessionLengthAfterResetIsCorrect = document.getElementById("session-length").innerHTML == 25;
                  if (!breakLengthAfterResetIsCorrect || !sessionLengthAfterResetIsCorrect) {
                    reject(new Error("Default values for break length and session length were not properly reset"));
                    return;
                  }
                  const secondsAfterAWhile = getSeconds(document.getElementById("time-left").innerHTML);
                  if (secondsAfterReset === secondsAfterAWhile)
                    resolve();
                  else
                    reject(new Error("Pomodoro has paused but time continued elapsing"));
                  }
                , 1500);

              }, 1500);
              observer.disconnect();
            }
          });

        });

      });

      it('12. When I click the element with the id of "break-decrement", the value within ' +
        'id="break-length" decrements by a value of 1, and I can see the updated value.',
      function() {
        clickButtonsById([_break_min, _break_min, _break_min, _break_min]);
        FCC_Global.assert.strictEqual(document.getElementById("break-length").innerHTML, "1");
        resetTimer();
        clickButtonsById([_break_min]);
        FCC_Global.assert.strictEqual(document.getElementById("break-length").innerHTML, "4");
      });

      it('13. When I click the element with the id of "break-increment", the value within id="break-length" increments by a value of 1, and I can see the updated value.', function() {
        clickButtonsById(Array(4).fill(_break_plus));
        FCC_Global.assert.strictEqual(document.getElementById("break-length").innerHTML, "9");
        resetTimer();
        clickButtonsById([_break_plus]);
        FCC_Global.assert.strictEqual(document.getElementById("break-length").innerHTML, "6");
      });

      it('14. When I click the element with the id of "session-decrement", the value within id="session-length" decrements by a value of 1, and I can see the updated value.', function() {
        clickButtonsById(Array(4).fill(_sesh_min));
        FCC_Global.assert.strictEqual(document.getElementById("session-length").innerHTML, "21");
        resetTimer();
        clickButtonsById([_sesh_min]);
        FCC_Global.assert.strictEqual(document.getElementById("session-length").innerHTML, "24")
      });

      it('15. When I click the element with the id of "session-increment", the value within id="session-length" increments by a value of 1, and I can see the updated value.', function() {
        clickButtonsById(Array(4).fill(_sesh_plus));
        FCC_Global.assert.strictEqual(document.getElementById("session-length").innerHTML, "29");
        resetTimer();
        clickButtonsById([_sesh_plus]);
        FCC_Global.assert.strictEqual(document.getElementById("session-length").innerHTML, "26")
      });

      it('16. I should not be able to set a session or break length to <= 0.', function() {
        clickButtonsById(Array(10).fill(_break_min));
        FCC_Global.assert.strictEqual(document.getElementById("break-length").innerHTML, "1", 'Value in element with ' + 'id of "break-length" is less than 1.');
        resetTimer();
        clickButtonsById(Array(30).fill(_sesh_min));
        FCC_Global.assert.strictEqual(document.getElementById("session-length").innerHTML, "1", 'Value in element with ' + 'id of "session-length" is less than 1.');
      });

      it('17. I should not be able to set a session or break length to > 60.', function() {
        clickButtonsById(Array(60).fill(_break_plus));
        FCC_Global.assert.strictEqual(document.getElementById("break-length").innerHTML, "60", 'Value in element with ' + 'id of "break-length" is greater than 60.');
        resetTimer();
        clickButtonsById(Array(40).fill(_sesh_plus));
        FCC_Global.assert.strictEqual(document.getElementById("session-length").innerHTML, "60", 'Value in element with ' + 'id of "session-length" is greater than 60.');
      });

      it('18. When I first click the element with id="start_stop", the timer should begin running from the value currently displayed in id="session-length", even if the value has been incremented or decremented from the original value of 25.', function() {
        clickButtonsById([_start_stop]);
        FCC_Global.assert.strictEqual(getMinutes(document.getElementById("time-left").innerHTML), document.getElementById("session-length").innerHTML);
      });

      it('19. If the timer is running, the element with the id of "time-left" should display the remaining time in mm:ss format (decrementing by a value of 1 and updating the display every 1000ms).', function() {
        this.timeout(2500);
        // start the pomodoro
        clickButtonsById([_start_stop]);
        const secondsBefore = getSeconds(document.getElementById("time-left").innerHTML);
        return new Promise((resolve, reject) => {
          // wait 1.5 seconds then see if displayed time has changed (decremented)
          setTimeout(_ => {
            const secondsAfter = getSeconds(document.getElementById("time-left").innerHTML);
            if (secondsAfter > secondsBefore)
              resolve();
            else
              reject(new Error("Pomodoro has started but time displayed is not changing"));
            }
          , 1500);
        });
      });

      it('20. If the timer is running and I click the element with id="start_stop", the countdown should pause.', function() {
        this.timeout(4000);
        // start the pomodoro
        clickButtonsById([_start_stop]);
        const secondsBefore = getSeconds(document.getElementById("time-left").innerHTML);
        return new Promise((resolve, reject) => {
          // wait 1.5 seconds then see if displayed time has changed
          setTimeout(_ => {
            const secondsAfter = getSeconds(document.getElementById("time-left").innerHTML);
            if (secondsAfter === secondsBefore) {
              reject(new Error("Pomodoro has started but time displayed is not changing"));
              return;
            }
            // Pause the pomodoro
            clickButtonsById([_start_stop]);
            // wait another 1.5 seconds to be sure value has not changed
            setTimeout(_ => {
              const secondsAfterPause = getSeconds(document.getElementById("time-left").innerHTML);
              if (secondsAfter === secondsAfterPause)
                resolve();
              else
                reject(new Error("Pomodoro has paused but time continued elapsing"));
              }
            , 1500);
          }, 1500);
        });
      });

      it('21. If the timer is paused and I click the element with id="start_stop", the countdown should resume running from the point at which it was paused.', function() {
        this.timeout(5000);
        // start the pomodoro
        clickButtonsById([_start_stop]);
        const secondsBefore = getSeconds(document.getElementById("time-left").innerHTML);
        return new Promise((resolve, reject) => {
          // wait 1.5 seconds then see if displayed time has changed
          setTimeout(_ => {
            const secondsAfter = getSeconds(document.getElementById("time-left").innerHTML);
            if (secondsAfter === secondsBefore) {
              reject(new Error("Pomodoro has started but time displayed is not changing"));
              return;
            }
            // Pause the pomodoro
            clickButtonsById([_start_stop]);
            // wait another 1.5 seconds to be sure value has not changed
            setTimeout(_ => {
              const secondsAfterPause = getSeconds(document.getElementById("time-left").innerHTML);
              if (secondsAfter !== secondsAfterPause) {
                reject(new Error("Pomodoro has paused but time continued elapsing"));
                return;
              }
              // Resume the pomodoro
              clickButtonsById([_start_stop]);
              // wait another 1.5 seconds to be sure time is decrementing again
              setTimeout(_ => {
                const secondsAfterResume = getSeconds(document.getElementById("time-left").innerHTML);
                if (secondsAfterPause > secondsAfterResume)
                  resolve();
                else
                  reject(new Error("Pomodoro has resumed but displayed time is not changing"));
                }
              , 1500);
            }, 1500);
          }, 1500);
        });
      });

      it('22. When a session countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of "timer-label" should display a string indicating a break has begun.', function() {
        this.timeout(5000);
        // we decrement session time to the minimum (1 minute)
        clickButtonsById(Array(60).fill(_sesh_min));
        // start the pomodoro
        clickButtonsById([_start_stop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById("time-left");
          const breakLength = document.getElementById("break-length");
          // Save label to test that it has changed below
          let sessionLabel = document.getElementById("timer-label").innerHTML;
          let shouldBeInBreak = false;
          const observer = observeElement("time-left", modType => {
            if (timeLeft.innerHTML === "00:00") {
              shouldBeInBreak = true;
            } else {
              if (parseInt(timeLeft.innerHTML.slice(0, 2)) > 5) {
                reject(new Error("Test timed out because Break time didn't start with the correct value: " + (parseInt(getMinutes(timeLeft.innerHTML)) + 1) + " instead of " + breakLength.innerHTML));
              } else if (shouldBeInBreak) {
                if (document.getElementById("timer-label").innerHTML !== sessionLabel) {
                  resolve();
                } else {
                  reject(new Error("Timer has reached zero but didn't switch to Break time"));
                }
                observer.disconnect();
              }
            }
          });
        });
      });

      it('23. When a session countdown reaches zero (NOTE: timer MUST reach 00:00), a new break countdown should begin, counting down from the value currently displayed in the id="break-length" element.', function() {
        this.timeout(5000);
        // we decrement session time to the minimum (1 minute)
        clickButtonsById(Array(60).fill(_sesh_min));
        // start the pomodoro
        clickButtonsById([_start_stop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById("time-left");
          let shouldBeInBreak = false;
          // Since not requiring specific labels, save the 'session' label to a variable, then test
          // within observer function that label has changed to know when in break
          let sessionLabel = document.getElementById("timer-label").innerHTML;
          const observer = observeElement("time-left", modType => {
            const currentTimer = document.getElementById("timer-label");
            const breakLength = document.getElementById("break-length");
            if (timeLeft.innerHTML === "00:00") {
              shouldBeInBreak = true;
            } else {
              if (parseInt(timeLeft.innerHTML.slice(0, 2)) > 5) {
                reject(new Error("Timer has switched to Break time, but it didn't start with the correct value: " + (parseInt(getMinutes(timeLeft.innerHTML)) + 1) + " instead of " + breakLength.innerHTML));
              } else if (shouldBeInBreak) {
                if (currentTimer.innerHTML !== sessionLabel) {
                  if (+ getMinutes(timeLeft.innerHTML) === + breakLength.innerHTML)
                    resolve();
                  else {
                    reject(new Error("Timer has switched to Break time, but it didn't start with the correct value: " + getMinutes(timeLeft.innerHTML) + " instead of " + breakLength.innerHTML));
                  }
                } else {
                  reject(new Error("Timer has reached zero but didn't switch to Break time"));
                }
                observer.disconnect();
              }
            }
          });
        });
      });

      it('24. When a break countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of "timer-label" should display a string indicating a session has begun.', function() {
        this.timeout(5000);
        // we decrement session length and break length to the minimum (1 minute)
        clickButtonsById(Array(60).fill(_sesh_min));
        clickButtonsById(Array(60).fill(_break_min));
        // start the pomodoro
        clickButtonsById([_start_stop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById("time-left");
          let shouldBeInBreak = false;
          let shouldBeInSessionAgain = false;
          let breakLabel;
          const observer = observeElement("time-left", modType => {
            if (timeLeft.innerHTML === "00:00") {
              if (!shouldBeInBreak && !shouldBeInSessionAgain) {
                shouldBeInBreak = true;
              } else {
                shouldBeInSessionAgain = true;
                shouldBeInBreak = false;
                // when in break, save 'break' label to var, then test below that label has changed
                breakLabel = document.getElementById("timer-label").innerHTML;
              }
            } else {
              if (shouldBeInSessionAgain) {
                if (document.getElementById("timer-label").innerHTML !== breakLabel) {
                  resolve();
                } else {
                  reject(new Error("Timer has reached zero but didn't switch back to Session time"));
                }
                observer.disconnect();
              }
            }
          });
        });
      });

      it('25. When a break countdown reaches zero (NOTE: timer MUST reach 00:00), a new session countdown should begin, counting down from the value currently displayed in the id="session-length" element.', function() {
        this.timeout(5000);
        // decrement session length and break length to the minimum (1 minute)
        clickButtonsById(Array(60).fill(_sesh_min));
        clickButtonsById(Array(60).fill(_break_min));
        // start the pomodoro
        clickButtonsById([_start_stop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById("time-left");
          let shouldBeInBreak = false;
          let shouldBeInSessionAgain = false;
          let breakLabel;
          const observer = observeElement("time-left", modType => {
            if (timeLeft.innerHTML === "00:00") {
              if (!shouldBeInBreak && !shouldBeInSessionAgain) {
                shouldBeInBreak = true;
              } else {
                shouldBeInSessionAgain = true;
                shouldBeInBreak = false;
                // when in break, save 'break' label to var, then test below that label has changed
                breakLabel = document.getElementById("timer-label").innerHTML;
              }
            } else {
              if (shouldBeInSessionAgain) {
                const currentTimer = document.getElementById("timer-label");
                const sessionLength = document.getElementById("session-length");
                if (currentTimer.innerHTML !== breakLabel) {
                  if (+ getMinutes(timeLeft.innerHTML) === + sessionLength.innerHTML)
                    resolve();
                  else {
                    reject(new Error("Timer has switched back to Session time, but it didn't start with the correct value: " + getMinutes(timeLeft.innerHTML) + " instead of " + sessionLength.innerHTML));
                  }
                } else {
                  reject(new Error("Timer has reached zero but didn't switch back to Session time"));
                }
                observer.disconnect();
              }
            }
          });
        });
      });

      it('26. When a countdown reaches zero (NOTE: timer MUST reach 00:00), a sound (must be 200ms or longer) indicating that time is up should play. This should utilize an HTML5 <audio> tag and have a corresponding id="beep".', function() {
        this.timeout(5000);
        // decrement session time to the minimum (1 minute)
        clickButtonsById(Array(60).fill(_sesh_min));
        // start the pomodoro
        clickButtonsById([_start_stop]);
        return new Promise((resolve, reject) => {
          const timeLeft = document.getElementById("time-left");
          const breakLength = document.getElementById("break-length");
          const observer = observeElement("time-left", modType => {
            if (parseInt(timeLeft.innerHTML.slice(0, 2)) > 5) {
              reject(new Error("Test timed out because Break time didn't start with the correct value: " + (parseInt(getMinutes(timeLeft.innerHTML)) + 1) + " instead of " + breakLength.innerHTML));
            } else if (timeLeft.innerHTML === "00:00") {
              // note: sound has to be longer than 200 ms, or the test will fail if the sound stops before the test actually happens
              savedSetTimeout(_ => {
                if (document.getElementById("beep") && !document.getElementById("beep").paused) {
                  resolve();
                } else {
                  reject(new Error("Timer has reached zero but, either there is not audio tag with ID 'beep' on the page, or it's not playing while it should."));
                }
              }, 200);
            }
          });
        });
      });

    }); // END #Tests

  }); // END #PomodoroClockTests
} // END createPomodoroClockTests()
