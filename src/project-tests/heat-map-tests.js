import {testToolTip} from '../assets/globalD3Tests';
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
      it('1. My heat map should have a title with a corresponding id="title".',
      function() {
        FCC_Global.assert.isNotNull(
          document.getElementById('title'),
          'Could not find an element with id=\"title\" '
        );
      });

      it(`2. My heat map should have a description with a corresponding
      id="description".`,
      function() {
        FCC_Global.assert.isNotNull(
          document.getElementById('description'),
          'Could not find an element with id=\"description\" '
        );
      });

      it(`3. My heat map should have an x-axis with a corresponding
      id="x-axis".`,
      function() {
        FCC_Global.assert.isNotNull(
          document.getElementById('x-axis'),
          'Could not find an element with id=\"x-axis\" '
        );
      });

      it(`4. My heat map should have a y-axis with a corresponding
      id="y-axis".`,
      function() {
        FCC_Global.assert.isNotNull(
          document.getElementById('y-axis'),
          'Could not find an element with id=\"y-axis\" '
        );
      });

      it(`5. My heat map should have cells with a corresponding class="cell"
      that represent the data.`,
      function() {
        FCC_Global.assert.isAbove(
          document.querySelectorAll('.cell').length,
          0,
          'Could not find any elements with a class=\"cell\" '
        );
      });

      it(`6. There should be at least 4 different fill colors used for the
      cells.`,
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
        FCC_Global.assert.isAtLeast(
          uniqueColors.length,
          4,
          'There should be more than four fill colors used for the cells '
        );
      });

      it(`7. Each cell will have the properties "data-month", "data-year",
      "data-temp" containing their corresponding month, year, and temperature
      values.`,
      function() {
        const cells = document.querySelectorAll('.cell');

        FCC_Global.assert.isAbove(
          cells.length,
          0,
          'Could not find any elements with a class="cell" '
        );

        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          FCC_Global.assert.isNotNull(
            cell.getAttribute('data-month'),
            'Could not find property "data-month" in cell '
          );
          FCC_Global.assert.isNotNull(
            cell.getAttribute('data-year'),
            'Could not find property "data-year" in cell '
          );
          FCC_Global.assert.isNotNull(
            cell.getAttribute('data-temp'),
            'Could not find property "data-temp" in cell '
          );
        }
      });

      it(`8. The \"data-month\", \"data-year\" of each cell should be within
      the range of the data.`,
      function() {

        // NOTE:  This test contains the same exact tests from 6 and 7.
        // Is there a way to only run test 8 if test 6 and 7 pass?
        // Should we be putting this code in a utility function?
        const cells = document.querySelectorAll('.cell');
        FCC_Global.assert.isAbove(
          cells.length,
          0,
          'Could not find any elements with a class="cell" '
        );

        for (var i = 0; i < cells.length; i++) {
          var cell = cells[i];
          FCC_Global.assert.isNotNull(
            cell.getAttribute('data-month'),
            'Could not find property "data-month" in cell '
          );
          FCC_Global.assert.isNotNull(
            cell.getAttribute('data-year'),
            'Could not find property "data-year" in cell '
          );
          FCC_Global.assert.isNotNull(
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
        FCC_Global.assert(
          valuesAreBetween(0, 11, cellMonths),
          'Month data values should be between 0 and 11 '
        );
        FCC_Global.assert(
          valuesAreBetween(1753, 2015, cellYears),
          'Year data values should be between 1753 and 2015 '
        );
      });

      it(`9. My heat map should have cells that align with the corresponding
      month on the y-axis.`,
      function() {
        const cellsCollection = document.querySelectorAll('.cell');
        FCC_Global.assert.isAbove(
          cellsCollection.length,
          0,
          'Could not find any elements with a class=\"cell\" '
        );

        const dataAttr = 'data-month';
        const coordAttr = 'y';
        // construct an object with information about axis and data-type
        // supply hard-coded units for an axis if necessary
        var yAxisInfo = getYAxisInfo(
          document.querySelector('#y-axis'),
          dataAttr,
          coordAttr,
          months
        );
        FCC_Global.assert.isTrue(
          /**
           * Check that cells align with axis ticks
           * @function
           * @param {Object} yAxisInfo - from alignmentD3Tests.getAxisInfo
           * @param {HTMLCollection} cellsCollection - const
           * @param {Function} getYMisalignmentCount - Pass specified function
           * for alignmentD3Tests.getMisalignmentCount
           * @param {Function} getFeatureValueMonths - Pass specified function
           * for alignmentD3Tests.getMisalignmentCount.getFeatureValueFunc
           * @param {Function} getTickValueMonths - Pass specified function for
           * alignmentD3Tests.getMisalignmentCountCaller.getTickValueFunc

           * @returns {Boolean} True if no misalignments are counted
           */
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

      it(`10. My heat map should have cells that align with the corresponding
      year on the x-axis.`,
      function() {
        const cellsCollection = document.querySelectorAll('.cell');
        FCC_Global.assert.isAbove(
          cellsCollection.length,
          0,
          'Could not find any elements with a class=\"cell\" '
        );

        const dataAttr = 'data-year';
        const coordAttr = 'x';
        // construct an object with information about axis and data-type
        var xAxisInfo = getXAxisInfo(
          document.querySelector('#x-axis'),
          dataAttr,
          coordAttr
        );

        FCC_Global.assert.isTrue(
          /**
           * Check that cells align with axis ticks
           * @function
           * @param {Object} xAxisInfo - from alignmentD3Tests.getAxisInfo
           * @param {HTMLCollection} cellsCollection - const
           * @param {Function} getXMisalignmentCount - Pass specified function
           * for alignmentD3Tests.getMisalignmentCount
           * @param {Function} getFeatureValueInteger - Pass specified function
           * for alignmentD3Tests.getMisalignmentCount.getFeatureValueFunc
           * @param {Function} getTickValueInteger - Pass specified function for
           * alignmentD3Tests.getMisalignmentCountCaller.getTickValueFunc

           * @returns {Boolean} True if no misalignments are counted
           */
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

      it(`11. My heat map should have multiple tick labels on the y-axis with
      the full month name.`,
      function() {
        const yAxisTickLabels = document.querySelectorAll('#y-axis .tick');

        FCC_Global.assert.isAbove(
          yAxisTickLabels.length,
          0,
          'Could not find tick labels on the y axis'
        );

        for (var i = 0; i < yAxisTickLabels.length; i++) {
          FCC_Global.assert.include(
            months,
            yAxisTickLabels[i].textContent.toLowerCase(),
            'Y axis labels should contain month names '
          );
        }
      });

      it(`12. My heat map should have multiple tick labels on the x-axis with
      the years between 1754 and 2015.`,
      function() {
        const xAxisTickLabels = document.querySelectorAll('#x-axis .tick');

        FCC_Global.assert.isAbove(
          xAxisTickLabels.length,
          0,
          'Could not find tick labels on the x axis'
        );

        for (var i = 0; i < xAxisTickLabels.length; i++) {

          FCC_Global.assert.isAtLeast(
            xAxisTickLabels[i].textContent,
            1754,
            'X axis labels should contain a year that\'s at least 1754 '
          );

          FCC_Global.assert.isAtMost(
            xAxisTickLabels[i].textContent,
            2015,
            'X axis labels should contain a year that\'s at most 2015 '
          );
        }

      });

      it('13. My heat map should have a legend with corresponding id="legend".',
      function() {
        FCC_Global.assert.isNotNull(
          document.getElementById('legend'),
          'Could not find an element with id="legend" '
        );
      });

    });
    testToolTip(document.querySelectorAll('.cell'), 'data-year', 'data-year');
  });
}
