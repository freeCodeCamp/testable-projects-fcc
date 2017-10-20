import {
  isAxisAlignedWithDataPoints
} from '../utils/alignment-D3';

import {
  getShapePositionCircle,
  getShapeValueMinutes,
  getShapeValueYearScatter,
  getTickPosition,
  getTickValueMinutes,
  getTickValueYear
} from '../utils/alignment-D3-support';

import { assert } from 'chai';
import { testToolTip } from '../utils/global-D3-tests';
import { d3ProjectStack } from '../utils/shared-test-strings';

export default function createScatterPlotTests() {

  describe('#ScatterPlotTests', function() {
    const MIN_YEAR = 1990;
    const MAX_YEAR = 2020;
    const MIN_MINUTES = 36;
    const MAX_MINUTES = 40;

    describe('#Technology Stack', function() {
      it(d3ProjectStack, function() {
        return true;
      });
    });

    describe('#Content', function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. I can see a title element that has a corresponding
      id="title".`,
      function() {
        assert.isNotNull(
          document.getElementById('title'),
          'Could not find element with id="title" '
        );
      });

      reqNum++;
      it(`${reqNum}. I can see an x-axis that has a corresponding id="x-axis".`,
      function() {
        assert.isNotNull(
          document.getElementById('x-axis'),
          'There should be an element with id="x-axis" '
        );
        assert.isAbove(
          document.querySelectorAll('g#x-axis').length,
          0,
          'x-axis should be a <g> SVG element '
        );
      });

      reqNum++;
      it(`${reqNum}. I can see a y-axis that has a corresponding id="y-axis".`,
      function() {
        assert.isNotNull(
          document.getElementById('y-axis'),
          'There should be an element with id="y-axis" '
        );
        assert.isAbove(
          document.querySelectorAll('g#y-axis').length,
          0,
          'y-axis should be a <g> SVG element'
        );
      });

      reqNum++;
      it(`${reqNum}. I can see dots, that each have a class of "dot", which
      represent the data being plotted.`,
      function() {
        assert.isAbove(
          document.querySelectorAll('circle.dot').length,
          0,
          'Could not find any <circle> SVG elements with class="dot" '
        );
      });

      reqNum++;
      it(`${reqNum}. Each dot should have the properties "data-xvalue" and
      "data-yvalue" containing their corresponding x and y values.`,
      function() {
        const dots = document.getElementsByClassName('dot');
        assert.isAbove(
          dots.length,
          0,
          'there are no elements with the class of "dot" '
        );
        for (var i = 0; i < dots.length; i++) {
          var dot = dots[i];
          assert.isNotNull(
            dot.getAttribute('data-xvalue'),
            'Could not find property "data-xvalue" in dot '
          );
          assert.isNotNull(
            dot.getAttribute('data-yvalue'),
            'Could not find property "data-yvalue" in dot '
          );
        }
      });

      reqNum++;
      it(`${reqNum}. The data-xvalue and data-yvalue of each dot should be
      within the range of the actual data and in the correct data format. For
      data-xvalue, integers (full years) or Date objects are acceptable for test
      evaluation. For data-yvalue (minutes), use Date objects. `,
      function() {
        const MIN_X_VALUE = MIN_YEAR;
        const MAX_X_VALUE = MAX_YEAR;

        const dotsCollection = document.getElementsByClassName('dot');
        // convert to array
        const dots = [].slice.call(dotsCollection);
        assert.isAbove(
          dots.length,
          0,
          'there are no elements with the class of "dot" '
        );

        dots.forEach(dot => {
          var xYear = new Date(dot.getAttribute('data-xvalue'));
          assert.isAtLeast(
            xYear.getFullYear(),
            MIN_X_VALUE,
            'The data-xvalue of a dot is below the range of the actual data '
          );
          assert.isAtMost(
            xYear.getFullYear(),
            MAX_X_VALUE,
            'The data-xvalue of a dot is above the range of the actual data '
          );

          // compare just the minutes for a good approximation
          var yDate = new Date(dot.getAttribute('data-yvalue'));
          assert.isAtLeast(
            yDate.getMinutes(),
            MIN_MINUTES,
            `The minutes data-yvalue of a dot is below the range of the actual
            minutes data `
          );
          assert.isAtMost(
            yDate.getMinutes(),
            MAX_MINUTES,
            `The minutes data-yvalue of a dot is above the range of the actual
            minutes data `);
        });
      });

      reqNum++;
      it(`${reqNum}. The data-xvalue and its corresponding dot should align
      with the corresponding point/value on the x-axis.`,
      function() {
        const dotsCollection = document.getElementsByClassName('dot');
        const coordAttr = 'x';

        assert.isAbove(
          dotsCollection.length,
          0,
          'there are no elements with the class of "dot" '
        );

        assert.isTrue(
          isAxisAlignedWithDataPoints(
            document.querySelector('#x-axis'),
            coordAttr,
            dotsCollection,
            getShapeValueYearScatter,
            getTickValueYear,
            getShapePositionCircle,
            getTickPosition
          ),
          'x values don\'t line up with x locations '
        );

      });

      reqNum++;
      it(`${reqNum}. The data-yvalue and its corresponding dot should align
      with the corresponding point/value on the y-axis.`,
      function() {
        const dotsCollection = document.getElementsByClassName('dot');
        const coordAttr = 'y';

        assert.isAbove(
          dotsCollection.length,
          0,
          'there are no elements with the class of "dot" '
        );

        assert.isTrue(
          isAxisAlignedWithDataPoints(
            document.querySelector('#y-axis'),
            coordAttr,
            dotsCollection,
            getShapeValueMinutes,
            getTickValueMinutes,
            getShapePositionCircle,
            getTickPosition
          ),
          'y values don\'t line up with y locations '
        );

      });

      reqNum++;
      it(`${reqNum}. I can see multiple tick labels on the y-axis with "%M:%S"
      time format.`,
      function() {
        const yAxisTickLabels = document.querySelectorAll('#y-axis .tick');
        assert.isAbove(
          yAxisTickLabels.length,
          0,
          'Could not find tick labels on the y axis '
        );
        yAxisTickLabels.forEach(label => {
          // match "%M:%S" d3 time format
          assert.match(
            label.textContent,
            /[0-5][0-9]:[0-5][0-9]/,
            'Y-axis tick labels aren\'t in the "%M:%S" d3 time format '
          );
        });
      });

      reqNum++;
      it(`${reqNum}. I can see multiple tick labels on the x-axis that show the
      year.`,
      function() {
        const xAxisTickLabels = document.querySelectorAll('#x-axis .tick');
        assert.isAbove(
          xAxisTickLabels.length,
          0,
          'Could not find tick labels on the x axis '
        );
        xAxisTickLabels.forEach(label => {
          // match check if this is a year
          assert.match(
            label.textContent,
            /[1-2][0-9][0-9][0-9]/,
            'X-axis tick labels do not show the year '
          );
        });
      });

      reqNum++;
      it(`${reqNum}. I can see that the range of the x-axis labels are within
      the range of the actual x-axis data.`,
      function() {
        const xAxisTickLabels = document.querySelectorAll('#x-axis .tick');
        const MIN_YEAR = 1994;
        const MAX_YEAR = 2016;
        assert.isAbove(
          xAxisTickLabels.length,
          0,
          'Could not find tick labels on the x axis '
        );

        xAxisTickLabels.forEach(label => {
          assert.isAtLeast(
            label.textContent,
            MIN_YEAR,
            'x axis labels are below the range of the actual data '
          );
          assert.isAtMost(
            label.textContent,
            MAX_YEAR,
            'x axis labels are above the range of the actual data '
          );
        });
      });

      reqNum++;
      it(`${reqNum}. I can see that the range of the y-axis labels are within
      the range of the actual y-axis data.`,
      function() {
        const yAxisTickLabels = document.querySelectorAll('#y-axis .tick');
        const MIN_TIME = new Date(0, 0, 0, 0, MIN_MINUTES, 0, 0);
        const MAX_TIME = new Date(0, 0, 0, 0, MAX_MINUTES, 0, 0);
        assert.isAbove(
          yAxisTickLabels.length,
          0,
          'Could not find tick labels on the y axis '
        );
        yAxisTickLabels.forEach(label => {
          var timeArr = label.textContent.split(':');
          var mins = timeArr[0];
          var secs = timeArr[1];
          var date = new Date(0, 0, 0, 0, mins, secs, 0);
          assert.isAtLeast(
            date,
            MIN_TIME,
            'y axis labels are below the range of the actual data '
          );
          assert.isAtMost(
            date,
            MAX_TIME,
            'y axis labels are above the range of the actual data '
          );
        });
      });

      reqNum++;
      it(`${reqNum}. I can see a legend containing descriptive text that has
      id="legend".`,
      function() {
        assert.isNotNull(
          document.getElementById('legend'),
          'There should be an element with id="legend" '
        );
        // A legend may be built with D3 svg <text> elements or with plain html
        var legendText;
        if (document.querySelector('#legend text') !== null) {
          legendText = document.querySelector('#legend text').innerHTML;
        } else {
          legendText = document.getElementById('legend').innerText;
        }
        assert.isNotNull(
          legendText,
          'The legend should contain text '
        );
      });
    });

    testToolTip(document.querySelectorAll('.dot'), 'data-year', 'data-xvalue');

  });
}
