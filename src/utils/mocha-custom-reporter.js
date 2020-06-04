/* global Mocha */

// Module from Mocha to reduce length of error stack trace
import utils, { stackTraceFilter, escape } from 'mocha/lib/utils';
import Progress from 'mocha/lib/browser/progress';

const filterStack = stackTraceFilter();

// Based on the standard mocha HTML reporter.
export default class HtmlReporter extends Mocha.reporters.Base {
  constructor(runner, options) {
    super(runner);
    let reporterOptions = options.reporterOptions;
    let title = reporterOptions.title;
    let statRoot = reporterOptions.stats;
    this.reportRoot = reporterOptions.report;
    let reportRoot = this.reportRoot;

    let stats = this.stats;
    stats.total = runner.total;
    stats.testNumber = 0;
    if (reporterOptions.events) {
      Object.keys(reporterOptions.events).forEach((type) => {
        runner.on(type, (...args) => {
          reporterOptions.events[type](stats, ...args);
        });
      });
    }

    let statsTemplate = `<ul class="fcc_test_mocha-stats">
        <li class="passes">passes:<em></em></li>
        <li class="failures">failures:<em></em></li>
        <li class="duration">duration:<em></em></li>
        <li class="progress"><canvas width="40" height="40"></canvas></li>
      </ul>`;
    let stat = fragment(statsTemplate);
    let items = stat.getElementsByTagName('li');
    let passes = items[0].getElementsByTagName('em')[0];
    let failures = items[1].getElementsByTagName('em')[0];
    let duration = items[2].getElementsByTagName('em')[0];
    let canvas = stat.getElementsByTagName('canvas')[0];
    let report = fragment('<ul class="fcc_test_mocha-report"></ul>');
    let stack = [report];
    let progress;
    let ctx;

    if (canvas.getContext) {
      let ratio = window.devicePixelRatio || 1;
      canvas.style.width = canvas.width;
      canvas.style.height = canvas.height;
      canvas.width *= ratio;
      canvas.height *= ratio;
      ctx = canvas.getContext('2d');
      ctx.scale(ratio, ratio);
      progress = new Progress();
      progress.size(40);
    }

    statRoot.innerHTML = '';
    statRoot.appendChild(stat);
    reportRoot.innerHTML = '';
    reportRoot.appendChild(report);

    title.innerText = '';

    runner.on('suite', (suite) => {
      if (suite.root) {
        return;
      }

      if (suite.parent.root) {
        title.innerText = suite.title;
      } else {
        // suite
        let el = fragment('<li class="suite"><h1>%e</h1></li>', suite.title);

        // container
        stack[0].appendChild(el);
        stack.unshift(document.createElement('ul'));
        el.appendChild(stack[0]);
        stats.testNumber = 0;
      }
    });

    runner.on('suite end', (suite) => {
      if (suite.root) {
        updateStats();
        return;
      }
      if (!suite.parent.root) {
        stack.shift();
      }
    });

    runner.on('pass', (test) => {
      let markup = `<li class="test pass %e">
          <h2>%e<span class="duration">%ems</span></h2>
        </li>`;
      let el = fragment(
        markup,
        test.speed,
        this.numberingTestTitle(test.title),
        test.duration
      );
      this.addCodeToggle(el, test.body);
      appendToStack(el);
      updateStats();
    });

    runner.on('fail', (test) => {
      let el = fragment(
        `<li class="test fail">
          <h2>%e</h2>
        </li>`,
        this.numberingTestTitle(test.title)
      );
      let err = test.err;
      let message;
      if (err.message && typeof err.message.toString === 'function') {
        message = err.message;
      } else if (typeof err.inspect === 'function') {
        message = err.inspect();
      } else {
        message = '';
      }
      message = message + '\n' + (!err.stack ? '' : filterStack(err.stack));
      if (test.err.htmlMessage && message) {
        el.appendChild(
          fragment(
            '<div class="html-error">%s\n<pre class="error">%e</pre></div>',
            test.err.htmlMessage,
            message
          )
        );
      } else if (test.err.htmlMessage) {
        el.appendChild(
          fragment('<div class="html-error">%s</div>', test.err.htmlMessage)
        );
      } else {
        el.appendChild(fragment('<pre class="error">%e</pre>', message));
      }

      this.addCodeToggle(el, test.body);
      appendToStack(el);
      updateStats();
    });

    runner.on('pending', (test) => {
      let el = fragment(
        '<li class="test pass pending"><h2>%e</h2></li>',
        this.numberingTestTitle(test.title)
      );
      appendToStack(el);
      updateStats();
    });

    let appendToStack = (el) => {
      if (stack[0]) {
        stack[0].appendChild(el);
      }
    };

    let updateStats = () => {
      let percent = (stats.tests / stats.total) * 100;
      if (progress) {
        progress.update(percent).draw(ctx);
      }

      // update stats
      let ms = new Date() - stats.start;
      passes.innerText = stats.passes;
      failures.innerText = stats.failures;
      duration.innerText = (ms / 1000).toFixed(2);
    };
  }

  numberingTestTitle(title) {
    this.stats.testNumber++;
    if (/^\d+\./.test(title)) {
      return title.replace(/^\d+\.\s*/, `${this.stats.testNumber}. `);
    }
    return `${this.stats.testNumber}. ${title}`;
  }

  addCodeToggle(el, contents) {
    let h2 = el.getElementsByTagName('h2')[0];

    h2.addEventListener('click', () => {
      pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
    });

    let pre = fragment('<pre><code>%e</code></pre>', utils.clean(contents));
    el.appendChild(pre);
    pre.style.display = 'none';
  }
}

const fragment = (html, ...args) => {
  let div = document.createElement('div');
  let i = 0;
  div.innerHTML = html.replace(/%([se])/g, (_, type) => {
    switch (type) {
      case 's':
        return String(args[i++]);
      case 'e':
        return escape(args[i++]);
      default:
        return '';
    }
  });
  return div.firstChild;
};
