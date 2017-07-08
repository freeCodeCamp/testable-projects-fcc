import $ from 'jquery';
import {testToolTip} from '../assets/globalD3Tests';

export default function createBarChartTests() {

  describe('#BarChartTests', function() {

    it('1. My chart should have a title with a corresponding id="title"',
    function() {
      FCC_Global.assert.isNotNull(
        document.getElementById('title'),
        'Could not find element with id="title" '
      );
    });

    it('2. My Chart should have an x-axis with a corresponding id="x-axis"',
    function() {
      FCC_Global.assert.isNotNull(
        document.getElementById('x-axis'),
        'Could not find element with id="x-axis" '
      );
      FCC_Global.assert.isAbove(
        document.querySelectorAll('g#x-axis').length,
        0,
        'x-axis should be a <g> SVG element '
      );
    });

    it('3. My Chart should have a y-axis with a corresponding id="y-axis"',
    function() {
      FCC_Global.assert.isNotNull(
        document.getElementById('y-axis'),
        'Could not find element with id="y-axis" '
      );

      FCC_Global.assert.isAbove(
        document.querySelectorAll('g#y-axis').length,
        0,
        'y-axis should be a <g> SVG element '
      );
    });

    it('4. Both axes should contain multiple tick labels',
    function() {
      FCC_Global.assert.isAbove(
        $("#x-axis .tick").length,
        1,
        "There are not enough tick labels on the x-axis "
      );
      FCC_Global.assert.isAbove(
        $("#y-axis .tick").length,
        1,
        "There are not enough tick labels on the y-axis "
      );
    });

    it(`5. My Chart should have a bar for each data point with a corresponding
    class="bar" displaying the data`, function() {
      FCC_Global.assert.isAbove(
        document.querySelectorAll('rect.bar').length,
        0,
        'Could not find any elements with class="bar" '
      );
      FCC_Global.assert.equal(
        document.querySelectorAll('rect.bar').length,
        275,
        'The number of bars is not equal to the number of data points '
      );
    });

    it(`6. Each bar should have the properties "data-date" and "data-gdp"
    containing date and GDP values`, function() {
      const bars = document.getElementsByClassName('bar');
      FCC_Global.assert.isAtLeast(
        bars.length,
        1,
        'no elements with the class of "bar" are detected '
      );
      for (var i = 0; i < bars.length; i++) {
        var bar = bars[i];
        FCC_Global.assert.isNotNull(
          bar.getAttribute("data-date"),
          'Could not find property "data-date" in bar '
        );
        FCC_Global.assert.isNotNull(
          bar.getAttribute("data-gdp"),
          'Could not find property "data-gdp" in bar '
        );
      }
    });

    it(`7. The "data-date" properties should match the order of the provided
    data`, function(done) {
      // shortened URL for raw githubusercontent GDP data
      $.getJSON(`https://goo.gl/niytBH`, function(res) {
        try {
          const bars = document.getElementsByClassName('bar');
          FCC_Global.assert.isAtLeast(
            bars.length,
            1,
            'no elements with the class of "bar" are detected '
          );
          for (var i = 0; i < bars.length; i++) {
            var currentBarDate = bars[i].getAttribute("data-date");
            FCC_Global.assert.equal(
              currentBarDate,
              res.data[i][0],
              'Bars should have date data in the same order as the provided data '
            );
          }
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('8. The "data-gdp" properties should match the order of the provided data',
    function(done) {
      // shortened URL for raw githubusercontent GDP data
      $.getJSON(`https://goo.gl/niytBH`, function(res) {
        try {
          const bars = document.getElementsByClassName('bar');
          FCC_Global.assert.isAtLeast(
            bars.length,
            1,
            'no elements with the class of "bar" are detected '
          );
          for (var i = 0; i < bars.length; i++) {
            var currentBarGdp = bars[i].getAttribute("data-gdp");
            FCC_Global.assert.equal(
              currentBarGdp,
              res.data[i][1],
              'Bars should have gdp data in the same order as the provided data '
            );
          }
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it(`9. Each bar's height should accurately represent the data's
    corresponding GDP`, function() {
      const bars = document.querySelectorAll('rect.bar');
      // get the ratio of the first data point to the height of the first bar
      const firstRatio =
      bars[0].getAttribute('data-gdp') / bars[0].getAttribute('height');
      /* iterate through each bar and make sure that its height is consistent
      with its corresponding data point using the first ratio */
      /* this test completely validates the bars, but isn\'t very useful to the
      user, so data-date and data-gdp tests were added for clarity */
      for (var i = 0; i < bars.length; i++) {
        var dataValue = bars[i].getAttribute('data-gdp');
        var barHeight = bars[i].getAttribute('height');
        var ratio = dataValue / barHeight;
        FCC_Global.assert.equal(
          firstRatio.toFixed(3),
          ratio.toFixed(3),
          'The heights of the bars should correspond to the data values '
        );
      }
    });

  });

  testToolTip(document.querySelectorAll('.bar'), "data-date", "data-date")
}
