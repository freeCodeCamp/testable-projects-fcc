import { areShapesAlignedWithTicks } from '../utils/alignment-D3';

import { assert } from 'chai';
import { testToolTip } from '../utils/global-D3-tests';
import $ from 'jquery';
import { d3ProjectStack } from '../utils/shared-test-strings';

export default function createBarChartTests() {
  describe('#BarChartTests', function () {
    describe('#Technology Stack', function () {
      it(d3ProjectStack, function () {
        return true;
      });
    });

    describe('#Content', function () {
      it(`My chart should have a title with a corresponding
      id="title"`, function () {
        assert.isNotNull(
          document.getElementById('title'),
          'Could not find element with id="title" '
        );
      });

      it(`My Chart should have a <g> element x-axis with a 
      corresponding id="x-axis"`, function () {
        assert.isAbove(
          document.querySelectorAll('g#x-axis').length,
          0,
          'Could not find a <g> SVG element with id="x-axis" '
        );
      });

      it(`My Chart should have a <g> element y-axis with a 
      corresponding id="y-axis"`, function () {
        assert.isAbove(
          document.querySelectorAll('g#y-axis').length,
          0,
          'Could not find a <g> SVG element with id="y-axis" '
        );
      });

      it(`Both axes should contain multiple tick labels, each with 
      the corresponding class="tick" `, function () {
        assert.isAbove(
          $('#x-axis .tick').length,
          1,
          'There are not enough tick labels on the x-axis '
        );
        assert.isAbove(
          $('#y-axis .tick').length,
          1,
          'There are not enough tick labels on the y-axis '
        );
      });

      it(`My Chart should have a <rect> element for each data point 
      with a corresponding class="bar" displaying the data`, function () {
        assert.isAbove(
          document.querySelectorAll('rect.bar').length,
          0,
          'Could not find any <rect> elements with class="bar" '
        );
        assert.equal(
          document.querySelectorAll('rect.bar').length,
          275,
          'The number of bars is not equal to the number of data points '
        );
      });

      it(`Each bar should have the properties "data-date" and
      "data-gdp" containing date and GDP values`, function () {
        const bars = document.querySelectorAll('rect.bar');

        assert.isAtLeast(
          bars.length,
          1,
          'no <rect> elements with the class of "bar" are detected '
        );

        bars.forEach(function (bar) {
          assert.isNotNull(
            bar.getAttribute('data-date'),
            'Could not find property "data-date" in bar '
          );
          assert.isNotNull(
            bar.getAttribute('data-gdp'),
            'Could not find property "data-gdp" in bar '
          );
        });
      });

      it(`The bar elements' "data-date" properties should match the 
      order of the provided data`, function (done) {
        $.getJSON(
          'https://raw.githubusercontent.com/FreeCodeCamp/' +
            'ProjectReferenceData/master/GDP-data.json',
          function (res) {
            try {
              const bars = document.querySelectorAll('rect.bar');
              assert.isAtLeast(
                bars.length,
                1,
                'no <rect> elements with the class of "bar" are detected '
              );
              bars.forEach(function (bar, i) {
                var currentBarDate = bar.getAttribute('data-date');
                assert.equal(
                  currentBarDate,
                  res.data[i][0],
                  'Bars should have date data in the same order as the ' +
                    'provided data '
                );
              });
              done();
            } catch (e) {
              done(e);
            }
          }
        );
      });

      it(`The bar elements' "data-gdp" properties should match the 
      order of the provided data`, function (done) {
        $.getJSON(
          'https://raw.githubusercontent.com/FreeCodeCamp/' +
            'ProjectReferenceData/master/GDP-data.json',
          function (res) {
            try {
              const bars = document.querySelectorAll('rect.bar');
              assert.isAtLeast(
                bars.length,
                1,
                'no <rect> elements with the class of "bar" are detected '
              );
              bars.forEach(function (bar, i) {
                var currentBarGdp = bar.getAttribute('data-gdp');
                assert.equal(
                  currentBarGdp,
                  res.data[i][1],
                  'Bars should have gdp data in the same order as the ' +
                    'provided data '
                );
              });
              done();
            } catch (e) {
              done(e);
            }
          }
        );
      });

      it(`Each bar element's height should accurately represent the 
      data's corresponding GDP`, function () {
        const bars = document.querySelectorAll('rect.bar');
        // get the ratio of the first data point to the height of the first bar
        const firstRatio =
          parseFloat(bars[0].getAttribute('data-gdp')) /
          parseFloat(bars[0].getAttribute('height'));
        /* iterate through each bar and make sure that its height is consistent
        with its corresponding data point using the first ratio */
        /* this test completely validates the bars, but isn\'t very useful to
        the user, so data-date and data-gdp tests were added for clarity */
        bars.forEach(function (bar) {
          var dataValue = bar.getAttribute('data-gdp');
          var barHeight = bar.getAttribute('height');
          var ratio = parseFloat(dataValue) / parseFloat(barHeight);
          assert.equal(
            firstRatio.toFixed(3),
            ratio.toFixed(3),
            'The heights of the bars should correspond to the data values '
          );
        });
      });

      it(`The data-date attribute and its corresponding bar element 
      should align with the corresponding value on the x-axis.`, function () {
        const axis = document.querySelector('#x-axis');
        const coordAttr = 'x';
        const barsCollection = document.querySelectorAll('.bar');
        const ticksCollection = axis.querySelectorAll('.tick');
        const shapeAttr = 'data-date';
        // options are 'minute', 'month', 'thousand', and 'year'
        const dataType = 'year';
        // what vertex of shape to measure against the axis
        // options are 'topLeft' and 'center'
        const shapeAlign = 'topLeft';

        assert.isAbove(
          barsCollection.length,
          0,
          'there are no <rect> elements with the class of "bar" '
        );

        assert.isTrue(
          areShapesAlignedWithTicks(
            barsCollection,
            ticksCollection,
            coordAttr,
            shapeAttr,
            dataType,
            shapeAlign
          ),
          "x values don't line up with x locations "
        );
      });

      it(`The data-gdp attribute and its corresponding bar element 
      should align with the corresponding value on the y-axis.`, function () {
        const axis = document.querySelector('#y-axis');
        const coordAttr = 'y';
        const barsCollection = document.querySelectorAll('.bar');
        const ticksCollection = axis.querySelectorAll('.tick');
        const shapeAttr = 'data-gdp';
        const dataType = 'thousand';
        const shapeAlign = 'topLeft';

        assert.isAbove(
          barsCollection.length,
          0,
          'there are no <rect> elements with the class of "bar" '
        );

        assert.isTrue(
          areShapesAlignedWithTicks(
            barsCollection,
            ticksCollection,
            coordAttr,
            shapeAttr,
            dataType,
            shapeAlign
          ),
          "y values don't line up with y locations "
        );
      });
    });

    // Tooltip tests.
    testToolTip(document.querySelectorAll('.bar'), 'data-date', 'data-date');
  });
}
