import {
  getXAxisInfo,
  getYAxisInfo,
  getXMisalignmentCount,
  getYMisalignmentCount,
  getFeatureValueInteger,
  getFeatureValueMonths,
  getTickValueInteger,
  getTickValueMonths,
  isAxisAlignedWithDataPoints
} from '../assets/alignmentD3Tests';
import { assert } from 'chai';
import { testToolTip } from '../assets/globalD3Tests';

const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];

export default function createHeatMapTests() {

  describe('#HeatMapTests', function() {
    describe('#Content', function() {
      let reqNum = 0;

      reqNum++;
      it(`${reqNum}. My heat map should have a title with a corresponding
      id="title".`,
      function() {
        assert.isNotNull(
          document.getElementById('title'),
          'Could not find an element with id="title" '
        );
      });

      reqNum++;
      it(`${reqNum}. My heat map should have a description with a corresponding
      id="description".`,
      function() {
        assert.isNotNull(
          document.getElementById('description'),
          'Could not find an element with id="description" '
        );
      });

      reqNum++;
      it(`${reqNum}. My heat map should have an x-axis with a corresponding
      id="x-axis".`,
      function() {
        assert.isNotNull(
          document.getElementById('x-axis'),
          'Could not find an element with id="x-axis" '
        );
      });

      reqNum++;
      it(`${reqNum}. My heat map should have a y-axis with a corresponding
      id="y-axis".`,
      function() {
        assert.isNotNull(
          document.getElementById('y-axis'),
          'Could not find an element with id="y-axis" '
        );
      });

      reqNum++;
      it(`${reqNum}. My heat map should have cells with a corresponding
      class="cell" that represent the data.`,
      function() {
        assert.isAbove(
          document.querySelectorAll('.cell').length,
          0,
          'Could not find any elements with a class="cell" '
        );
      });

      reqNum++;
      it(`${reqNum}. There should be at least 4 different fill colors used for
      the cells.`,
      function() {
        const cells = document.querySelectorAll('.cell');
        var uniqueColors = [];

        for (var i = 0; i < cells.length; i++) {
          var cellColor = cells[i].style.fill || cells[i].getAttribute('fill');

          // if the current color isn't in the uniqueColors arr, push it
          if (uniqueColors.indexOf(cellColor) === -1) {
            uniqueColors.push(cellColor);
          }
        }
        assert.isAtLeast(
          uniqueColors.length,
          4,
          'There should be more than four fill colors used for the cells '
        );
      });

      reqNum++;
      it(`${reqNum}. Each cell will have the properties "data-month",
      "data-year", "data-temp" containing their corresponding month, year, and
      temperature values.`,
      function() {
        const cells = document.querySelectorAll('.cell');

        assert.isAbove(
          cells.length,
          0,
          'Could not find any elements with a class="cell" '
        );

        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          assert.isNotNull(
            cell.getAttribute('data-month'),
            'Could not find property "data-month" in cell '
          );
          assert.isNotNull(
            cell.getAttribute('data-year'),
            'Could not find property "data-year" in cell '
          );
          assert.isNotNull(
            cell.getAttribute('data-temp'),
            'Could not find property "data-temp" in cell '
          );
        }
      });

      reqNum++;
      it(`${reqNum}. The "data-month", "data-year" of each cell should be
      within the range of the data.`,
      function() {

        // NOTE:  This test contains the same exact tests from 6 and 7.
        // Is there a way to only run test 8 if test 6 and 7 pass?
        // Should we be putting this code in a utility function?
        const cells = document.querySelectorAll('.cell');
        assert.isAbove(
          cells.length,
          0,
          'Could not find any elements with a class="cell" '
        );

        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          assert.isNotNull(
            cell.getAttribute('data-month'),
            'Could not find property "data-month" in cell '
          );
          assert.isNotNull(
            cell.getAttribute('data-year'),
            'Could not find property "data-year" in cell '
          );
          assert.isNotNull(
            cell.getAttribute('data-temp'),
            'Could not find property "data-temp" in cell '
          );
        }

        var cellMonths = [];
        var cellYears = [];

        for (i = 0; i < cells.length; i++) {
          cell = cells[i];

          cellMonths.push(cell.getAttribute('data-month'));
          cellYears.push(cell.getAttribute('data-year'));
        }

        function valuesAreBetween(min, max, data) {
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item < min || item > max) {
              return false;
            }
          }
          return true;
        }
        assert(
          valuesAreBetween(0, 11, cellMonths),
          'Month data values should be between 0 and 11 '
        );
        assert(
          valuesAreBetween(1753, 2015, cellYears),
          'Year data values should be between 1753 and 2015 '
        );
      });

      reqNum++;
      it(`${reqNum}. My heat map should have cells that align with the
      corresponding month on the y-axis.`,
      function() {
        const cellsCollection = document.querySelectorAll('.cell');
        const dataAttr = 'data-month';
        const coordAttr = 'y';

        assert.isAbove(
          cellsCollection.length,
          0,
          'Could not find any elements with a class="cell" '
        );

        // construct an object with information about axis and data-type
        // supply hard-coded units for an axis if necessary
        var yAxisInfo = getYAxisInfo(
          document.querySelector('#y-axis'),
          dataAttr,
          coordAttr,
          months
        );
        assert.isTrue(
          isAxisAlignedWithDataPoints(
            yAxisInfo,
            cellsCollection,
            getYMisalignmentCount,
            getFeatureValueMonths,
            getTickValueMonths
          ),
          'month values don\'t line up with y locations '
        );
      });

      reqNum++;
      it(`${reqNum}. My heat map should have cells that align with the
      corresponding year on the x-axis.`,
      function() {
        const cellsCollection = document.querySelectorAll('.cell');
        const dataAttr = 'data-year';
        const coordAttr = 'x';

        assert.isAbove(
          cellsCollection.length,
          0,
          'Could not find any elements with a class="cell" '
        );

        // construct an object with information about axis and data-type
        var xAxisInfo = getXAxisInfo(
          document.querySelector('#x-axis'),
          dataAttr,
          coordAttr
        );

        assert.isTrue(
          isAxisAlignedWithDataPoints(
            xAxisInfo,
            cellsCollection,
            getXMisalignmentCount,
            getFeatureValueInteger,
            getTickValueInteger
          ),
          'year values don\'t line up with x locations '
        );
      });

      reqNum++;
      it(`${reqNum}. My heat map should have multiple tick labels on the y-axis
      with the full month name.`,
      function() {
        const yAxisTickLabels = document.querySelectorAll('#y-axis .tick');

        assert.isAbove(
          yAxisTickLabels.length,
          0,
          'Could not find tick labels on the y axis'
        );

        for (var i = 0; i < yAxisTickLabels.length; i++) {
          assert.include(
            months,
            yAxisTickLabels[i].textContent.toLowerCase(),
            'Y axis labels should contain month names '
          );
        }
      });

      reqNum++;
      it(`${reqNum}. My heat map should have multiple tick labels on the x-axis
      with the years between 1754 and 2015.`,
      function() {
        const xAxisTickLabels = document.querySelectorAll('#x-axis .tick');

        assert.isAbove(
          xAxisTickLabels.length,
          0,
          'Could not find tick labels on the x axis'
        );

        for (var i = 0; i < xAxisTickLabels.length; i++) {

          assert.isAtLeast(
            xAxisTickLabels[i].textContent,
            1754,
            'X axis labels should contain a year that\'s at least 1754 '
          );

          assert.isAtMost(
            xAxisTickLabels[i].textContent,
            2015,
            'X axis labels should contain a year that\'s at most 2015 '
          );
        }

      });

      reqNum++;
      it(`${reqNum}. My heat map should have a legend with corresponding
      id="legend".`,
      function() {
        assert.isNotNull(
          document.getElementById('legend'),
          'Could not find an element with id="legend" '
        );
      });

    });

    // Addtional tests.
    testToolTip(document.querySelectorAll('.cell'), 'data-year', 'data-year');

  });
}
