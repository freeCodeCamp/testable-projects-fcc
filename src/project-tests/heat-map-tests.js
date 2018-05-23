import { d3ProjectStackNoAxes } from '../utils/shared-test-strings';
import { hasUniqueColorsCount } from '../utils/element-utils';
import { areShapesAlignedWithTicks } from '../utils/alignment-D3';

import { assert } from 'chai';
import { testToolTip } from '../utils/global-D3-tests';

export default function createHeatMapTests() {

  describe('#HeatMapTests', function() {

    describe('#Technology Stack', function() {
      it(d3ProjectStackNoAxes, function() {
        return true;
      });
    });

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
      it(`${reqNum}. My heat map should have <rect> elements with a class="cell"
      that represent the data.`,
      function() {
        assert.isAbove(
          document.querySelectorAll('rect.cell').length,
          0,
          'Could not find any <rect> elements with a class="cell" '
        );
      });

      reqNum++;
      it(`${reqNum}. There should be at least 4 different fill colors used for
      the cells.`,
      function() {
        const cells = document.querySelectorAll('rect.cell');

        assert.isTrue(
          hasUniqueColorsCount(cells, 4),
          'There should be four or more fill colors used for the cells '
        );
      });

      reqNum++;
      it(`${reqNum}. Each cell will have the properties "data-month",
      "data-year", "data-temp" containing their corresponding month, year, and
      temperature values.`,
      function() {
        const cells = document.querySelectorAll('rect.cell');

        // Without this assertion, the other assertions will never be reached
        // (forEach loop below is never entered) and we would get a false
        // positive for the overall test.
        assert.isAbove(
          cells.length,
          0,
          'Could not find any <rect> elements with a class="cell" '
        );

        cells.forEach(cell => {
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
        });
      });

      reqNum++;
      it(`${reqNum}. The "data-month", "data-year" of each cell should be
      within the range of the data.`,
      function() {

        const cells = document.querySelectorAll('rect.cell');

        // Without this assertion, the other assertions will never be reached
        // (forEach loop below is never entered) and the test would falsely
        // pass.
        assert.isAbove(
          cells.length,
          0,
          'Could not find any <rect> elements with a class="cell" '
        );

        cells.forEach((cell) => {
          const dataMonth = cell.getAttribute('data-month');

          assert.isAtLeast(dataMonth, 0, 'data-month should be at least 0');
          assert.isAtMost(dataMonth, 11, 'data-month should be at most 11');
        });

        cells.forEach((cell) => {
          const dataYear = cell.getAttribute('data-year');

          assert.isAtLeast(dataYear, 1753, 'data-year should be at least 1753');
          assert.isAtMost(dataYear, 2015, 'data-year should be at most 2015');
        });
      });

      reqNum++;
      it(`${reqNum}. My heat map should have cells that align with the
      corresponding month on the y-axis.`,
      function() {

        const axis = document.querySelector('#y-axis');
        const coordAttr = 'y';
        const cellsCollection = document.querySelectorAll('rect.cell');
        const ticksCollection = axis.querySelectorAll('.tick');
        const shapeAttr = 'data-month';
        // options are 'minute', 'month', 'thousand', and 'year'
        const dataType = 'month';
        // what vertex of shape to measure against the axis
        // options are 'topLeft' and 'center'
        const shapeAlign = 'center';

        assert.isTrue(
          areShapesAlignedWithTicks(
            cellsCollection,
            ticksCollection,
            coordAttr,
            shapeAttr,
            dataType,
            shapeAlign
          ),
          'month values don\'t line up with y locations '
        );
      });

      reqNum++;
      it(`${reqNum}. My heat map should have cells that align with the
      corresponding year on the x-axis.`,
      function() {
        const cellsCollection = document.querySelectorAll('rect.cell');
        const axis = document.querySelector('#x-axis');
        const coordAttr = 'x';
        const ticksCollection = axis.querySelectorAll('.tick');
        const shapeAttr = 'data-year';
        // options are 'minute', 'month', 'thousand', and 'year'
        const dataType = 'year';
        // what vertex of shape to measure against the axis
        // options are 'topLeft' and 'center'
        const shapeAlign = 'center';

        assert.isTrue(
          areShapesAlignedWithTicks(
            cellsCollection,
            ticksCollection,
            coordAttr,
            shapeAttr,
            dataType,
            shapeAlign
          ),
          'year values don\'t line up with x locations '
        );
      });

      reqNum++;
      it(`${reqNum}. My heat map should have multiple tick labels on the y-axis
      with the full month name.`,
      function() {
        const yAxisTickLabels = document.querySelectorAll('#y-axis .tick');
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

        // Prevent a false pass of this test by making sure there are at least
        // some labels.
        assert.isAbove(
          yAxisTickLabels.length,
          0,
          'Could not find tick labels on the y axis'
        );

        yAxisTickLabels.forEach(tickLabel => {
          assert.include(
            months,
            tickLabel.textContent.toLowerCase(),
            'Y axis labels should contain full month names (example: January)'
          );
        });
      });

      reqNum++;
      it(`${reqNum}. My heat map should have multiple tick labels on the x-axis
      with the years between 1754 and 2015.`,
      function() {
        const xAxisTickLabels = document.querySelectorAll('#x-axis .tick');

        // Without this assertion, the test would pass when there are no
        // tick labels.
        assert.isAbove(
          xAxisTickLabels.length,
          0,
          'Could not find tick labels on the x axis'
        );

        xAxisTickLabels.forEach(tickLabel => {
          assert.isAtLeast(
            tickLabel.textContent,
            1754,
            'X axis labels should contain a year that\'s at least 1754 '
          );

          assert.isAtMost(
            tickLabel.textContent,
            2015,
            'X axis labels should contain a year that\'s at most 2015 '
          );
        });

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

      reqNum++;
      it(`${reqNum}. My legend should contain <rect> elements.`,
      function() {
        assert.isAbove(
          document.querySelectorAll('#legend rect').length,
          0,
          'Could not find <rect> elements contained by the legend element '
        );
      });

      reqNum++;
      it(`${reqNum}. The <rect> elements in the legend should use at least 4 
      different fill colors`,
      function() {
        const legendItems =
          document.querySelectorAll('#legend rect');

        assert.isTrue(
          hasUniqueColorsCount(legendItems, 4),
          'There should be four or more fill colors used for the legend '
        );
      });

    });

    // Tooltip tests.
    testToolTip(document.querySelectorAll('.cell'), 'data-year', 'data-year');

  });
}
