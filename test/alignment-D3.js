// BDD tests for the alignment-D3 module.

import {
  _getSurroundingTicks,
  _isShapeAlignedWithTicks,
  _isShapeValueWithinTickValues,
  isAxisAlignedWithDataPoints
} from '../src/utils/alignment-D3';

import {
  getShapePositionCircle,
  getShapePositionRect,
  getShapePositionRectBar,
  getShapeValueDecimal,
  getShapeValueMinutes,
  getShapeValueMonthHeatMap,
  getShapeValueYearHeatMap,
  getShapeValueYearScatter,
  getShapeValueYearBar,
  getTickPosition,
  getTickValueThousands,
  getTickValueMinutes,
  getTickValueMonth,
  getTickValueYear
} from '../src/utils/alignment-D3-support';

import { assert } from 'chai';
import { JSDOM } from 'jsdom';

describe('D3 Alignment module tests', function() {

  // Test data.
  const heatMapDom = new JSDOM(`
  <g id="y-axis" transform="translate(144,16)">
    <g class="tick" transform="translate(0,16.5)">
      <text>January</text>
    </g>
    <g class="tick" transform="translate(0,49.5)">
      <text>February</text>
    </g>
    <g class="tick" transform="translate(0,79.5)">
      <text>March</text>
    </g>
    <g class="tick" transform="translate(0,99.5)">
      <text>April</text>
    </g>
  </g>

  <g id="x-axis" transform="translate(144,412)">
    <g class="tick" transform="translate(37.5,0)">
      <text>1760</text>
    </g>
    <g class="tick" transform="translate(87.5,0)">
      <text>1770</text>
    </g>
    <g class="tick" transform="translate(137.5,0)">
      <text>1780</text>
    </g>
  </g>

  <rect class="cell" data-month="0" data-year="1753"
    data-temp="7.2940000000000005" x="0" y="0" width="5" height="33">
  </rect>
  <rect class="cell" data-month="1" data-year="1765"
    data-temp="7.2940000000000005" x="50" y="51" width="5" height="33">
  </rect>
  <rect class="cell-misaligned" data-month="2" data-year="1765"
    data-temp="7.2940000000000005" x="0" y="0" width="5" height="33">
  </rect>
  `);

  const scatterPlotDom = new JSDOM(`
  <g id="y-axis">
    <g class="tick" transform="translate(0,27.777777777777775)">
      <text>37:00</text>
    </g>
    <g class="tick" transform="translate(0,69.44444444444444)">
      <text>37:15</text>
    </g>
    <g class="tick" transform="translate(0,111.1111111111111)">
      <text>37:30</text>
    </g>
  </g>

  <g id="x-axis" transform="translate(0,500)">
    <g class="tick" transform="translate(36.52173913043478,0)">
      <text>1994</text>
    </g>
    <g class="tick" transform="translate(109.56521739130434,0)">
      <text>1996</text>
    </g>
    <g class="tick" transform="translate(182.6086956521739,0)">
      <text>1998</text>
    </g>
  </g>

  <circle class="dot" r="6" cx="36.52173913043478" cy="69.44444444444444"
    data-xvalue="1994" data-yvalue="Mon Jan 01 1900 00:37:15 GMT-0200 (BRST)">
  </circle>
  <circle class="dot-misaligned" r="6" cx="0" cy="0"
    data-xvalue="1996" data-yvalue="Mon Jan 01 1900 00:38:00 GMT-0200 (BRST)">
  </circle>
  `);

  const scatterPlotReverseAxisDom = new JSDOM(`
  <g id="y-axis">
    <g class="tick" transform="translate(0,290.5)">
      <text>37:45</text>
    </g>
    <g class="tick" transform="translate(0,320.5)">
      <text>37:30</text>
    </g>
    <g class="tick" transform="translate(0,350.5)">
      <text>37:15</text>
    </g>
    <g class="tick" transform="translate(0,380.5)">
      <text>37:00</text>
    </g>
  </g>

  <g id="x-axis">
    <g class="tick" transform="translate(36.52173913043478,0)">
      <text>1994</text>
    </g>
    <g class="tick" opacity="1" transform="translate(109.56521739130434,0)">
      <text>1996</text>
    </g>
    <g class="tick" opacity="1" transform="translate(182.6086956521739,0)">
      <text>1998</text>
    </g>
  </g>

  <circle class="dot" r="6" cx="36.52173913043478" cy="300"
    data-xvalue="1994" data-yvalue="Mon Jan 01 1900 00:37:40 GMT-0200 (BRST)">
  </circle>
  <circle class="dot" r="6" cx="73.04347826086956" cy="360" data-xvalue="1995"
    data-yvalue="Mon Jan 01 1900 00:37:01 GMT-0200 (BRST)">
  </circle>
  <circle class="dot" r="6" cx="146.08695652173913" cy="400"
    data-xvalue="1997" data-yvalue="Mon Jan 01 1900 00:36:55 GMT-0200 (BRST)">
  </circle>

  <circle class="dot-misaligned" r="6" cx="0"
    cy="355" data-xvalue="1997"
    data-yvalue="Mon Jan 01 1900 00:37:25 GMT-0200 (BRST)">
  </circle>
  `);

  const barChartDom = new JSDOM(`
    <g id="y-axis">
      <path class="domain" stroke="#000" d="M-6,400.5H0.5V5.882873781463295H-6">
      </path>
      <g class="tick" opacity="1" transform="translate(0,317.31234673147077)">
        <text fill="#000" x="-9" dy="0.32em">4,000</text>
      </g>
      <g class="tick" opacity="1" transform="translate(0,361.597610256467)">
        <text fill="#000" x="-9" dy="0.32em">2,000</text>
      </g>
    </g>
    
    <g fill="none" id="x-axis">
      <path class="domain" stroke="#000" d="M0.5,6V0.5H800.5V6"></path>
      <g class="tick" opacity="1" transform="translate(329.9117647058823,0)">
        <text fill="#000" y="9" dy="0.71em">1975</text>
      </g>
      <g class="tick" opacity="1" transform="translate(388.7352941176471,0)">
        <text fill="#000" y="9" dy="0.71em">1980</text>
      </g>
      <g class="tick" opacity="1" transform="translate(447.55882352941177,0)">
        <text fill="#000" y="9" dy="0.71em">1985</text>
      </g>
      <g class="tick" opacity="1" transform="translate(506.38235294117646,0)">
        <text fill="#000" y="9" dy="0.71em">1990</text>
      </g>
    </g>
    
    <rect data-date="1978-01-01" data-gdp="2208.7" class="bar" 
      x="360.72727272727275" y="351.09356922617036" 
      width="2.909090909090909" height="48.90643077382962"></rect>
    <rect data-date="2015-04-01" data-gdp="0" class="bar-misaligned" 
      x="0" y="350" width="2.909090909090909" 
      height="6.436863053358206"></rect>
  `);
  // Some of the tests will be performed on all the sets of data above.
  const tests = [
    {
      name: 'Heat Map',
      dom: heatMapDom,
      shapeClassName: '.cell',
      getYShapeValueFunction: getShapeValueMonthHeatMap,
      getXShapeValueFunction: getShapeValueYearHeatMap,
      getYTickValueFunction: getTickValueMonth,
      getXTickValueFunction: getTickValueYear,
      getShapePositionFunction: getShapePositionRect,
      tickOrderNormalYAxis: true
    },
    {
      name: 'Scatter Plot',
      dom: scatterPlotDom,
      shapeClassName: '.dot',
      getYShapeValueFunction: getShapeValueMinutes,
      getXShapeValueFunction: getShapeValueYearScatter,
      getYTickValueFunction: getTickValueMinutes,
      getXTickValueFunction: getTickValueYear,
      getShapePositionFunction: getShapePositionCircle,
      tickOrderNormalYAxis: true
    },
    {
      name: 'Scatter Plot Reverse Axis',
      dom: scatterPlotReverseAxisDom,
      shapeClassName: '.dot',
      getYShapeValueFunction: getShapeValueMinutes,
      getXShapeValueFunction: getShapeValueYearScatter,
      getYTickValueFunction: getTickValueMinutes,
      getXTickValueFunction: getTickValueYear,
      getShapePositionFunction: getShapePositionCircle,
      tickOrderNormalYAxis: false
    },
    {
      name: 'Bar Chart',
      dom: barChartDom,
      shapeClassName: '.bar',
      getYShapeValueFunction: getShapeValueDecimal,
      getXShapeValueFunction: getShapeValueYearBar,
      getYTickValueFunction: getTickValueThousands,
      getXTickValueFunction: getTickValueYear,
      getShapePositionFunction: getShapePositionRectBar,
      tickOrderNormalYAxis: false
    }
  ];

  describe('_getSurroundingTicks function', function() {
    it('should return before and after ticks from a position',
    function() {
      const ticks = barChartDom.window.document.querySelectorAll(
        '#y-axis .tick'
      );

      const alignedTicks = _getSurroundingTicks(
        ticks,
        'y',
        { x: 361, y: 351 },
        getTickPosition
      );

      assert.strictEqual(
        alignedTicks[0].getAttribute('transform'),
        'translate(0,317.31234673147077)'
      );

      assert.strictEqual(
        alignedTicks[1].getAttribute('transform'),
        'translate(0,361.597610256467)'
      );
    });

    it('should return before and after ticks from a middle position',
    function() {
      const ticks = barChartDom.window.document.querySelectorAll(
        '#y-axis .tick'
      );

      const alignedTicks = _getSurroundingTicks(
        ticks,
        'y',
        { x: 361, y: 351 },
        getTickPosition
      );

      assert.strictEqual(
        alignedTicks[0].getAttribute('transform'),
        'translate(0,317.31234673147077)'
      );

      assert.strictEqual(
        alignedTicks[1].getAttribute('transform'),
        'translate(0,361.597610256467)'
      );
    });

    it('should return null for the before tick when the position is before ' +
    'the first tick',
    function() {
      const allTicks =
        barChartDom.window.document.querySelectorAll('#x-axis .tick');

      const alignedTicks = _getSurroundingTicks(
        allTicks,
        'x',
        { x: 0, y: 395 },
        getTickPosition
      );

      assert.strictEqual(
        alignedTicks[0],
        null
      );

    });

    it('should return the first tick as the after tick when the position is ' +
    'before the first tick',
    function() {
      const ticks =
        barChartDom.window.document.querySelectorAll('#x-axis .tick');

      const alignedTicks = _getSurroundingTicks(
        ticks,
        'x',
        { x: 0, y: 395 },
        getTickPosition
      );

      assert.strictEqual(
        alignedTicks[1].getAttribute('transform'),
        'translate(329.9117647058823,0)'
      );
    });

    it('should return null for the after tick when the position is after ' +
    'the last tick',
    function() {
      const ticks =
        barChartDom.window.document.querySelectorAll('#x-axis .tick');

      const alignedTicks = _getSurroundingTicks(
        ticks,
        'x',
        { x: 558, y: 232 },
        getTickPosition
      );

      assert.strictEqual(
        alignedTicks[1],
        null
      );
    });

    it('should return the last tick as the before tick when the position ' +
    'is after the last tick',
    function() {
      const ticks =
        barChartDom.window.document.querySelectorAll('#x-axis .tick');

      const alignedTicks = _getSurroundingTicks(
        ticks,
        'x',
        { x: 558, y: 232 },
        getTickPosition
      );

      assert.strictEqual(
        alignedTicks[0].getAttribute('transform'),
        'translate(506.38235294117646,0)'
      );
    });

    it('should throw an error if no ticks are provided',
    function() {
      const ticks = null;

      const enclosingTicks = _getSurroundingTicks.bind(
        null,
        ticks,
        'x',
        { x: 558, y: 232 },
        getTickPosition
      );

      assert.throws(
        enclosingTicks,
        Error
      );
    });

  });

  // Perform the following tests on each set of test data.
  tests.forEach(function(test) {

    describe(`Using ${test.name} data`, function() {

      describe('isAxisAlignedWithDataPoints function', function() {
        it('should return true when all datapoints are aligned with a y axis',
        function() {
          const axis = test.dom.window.document.querySelector('#y-axis'),
            dataPoints = test.dom.window.document.querySelectorAll(
              test.shapeClassName
            );
          const dimension = 'y';

          assert.isTrue(isAxisAlignedWithDataPoints(
            axis,
            dimension,
            dataPoints,
            test.getYShapeValueFunction,
            test.getYTickValueFunction,
            test.getShapePositionFunction,
            getTickPosition
          ));
        });

        it('should return true when all datapoints are aligned with an x axis',
        function() {
          const axis = test.dom.window.document.querySelector('#x-axis'),
            dataPoints = test.dom.window.document.querySelectorAll(
              test.shapeClassName
            );
          const dimension = 'x';

          assert.isTrue(isAxisAlignedWithDataPoints(
            axis,
            dimension,
            dataPoints,
            test.getXShapeValueFunction,
            test.getXTickValueFunction,
            test.getShapePositionFunction,
            getTickPosition
          ));
        });

        it('should return false when one datapoint is not aligned with the x ' +
        'axis',
        function() {
          const axis = test.dom.window.document.querySelector('#x-axis'),
            dataPoints = test.dom.window.document.querySelectorAll(
              test.shapeClassName + '-misaligned'
            );
          const dimension = 'x';

          assert.isFalse(isAxisAlignedWithDataPoints(
            axis,
            dimension,
            dataPoints,
            test.getXShapeValueFunction,
            test.getXTickValueFunction,
            test.getShapePositionFunction,
            getTickPosition
          ));
        });

      });

      describe('_isShapeAlignedWithTicks function', function() {
        it('should return true when one shape is aligned',
        function() {
          const axis = test.dom.window.document.querySelector('#y-axis');
          const cells = test.dom.window.document.querySelectorAll(
              test.shapeClassName
            );
          const allTicks = axis.querySelectorAll('.tick');
          const shape = cells[0];
          const dimension = 'y';

          assert.isTrue(_isShapeAlignedWithTicks(
            shape,
            allTicks,
            dimension,
            test.tickOrderNormalYAxis,
            test.getYShapeValueFunction,
            test.getYTickValueFunction,
            test.getShapePositionFunction,
            getTickPosition
          ));
        });

        it('should return false when one shape is not aligned',
        function() {
          const axis = test.dom.window.document.querySelector('#y-axis'),
            cells = test.dom.window.document.querySelectorAll(
              test.shapeClassName + '-misaligned'
            );
          const allTicks = axis.querySelectorAll('.tick');
          const shape = cells[0];
          const dimension = 'y';

          assert.isFalse(_isShapeAlignedWithTicks(
            shape,
            allTicks,
            dimension,
            test.tickOrderNormalYAxis,
            test.getYShapeValueFunction,
            test.getYTickValueFunction,
            test.getShapePositionFunction,
            getTickPosition
          ));
        });


      });

      describe('_isShapeValueWithinTickValues function', function() {

        it('should return true when the shape value is within the tick values',
        function() {
          const cells = test.dom.window.document.querySelectorAll(
            test.shapeClassName
          );
          const shape = cells[0];

          const ticks = test.dom.window.document.querySelectorAll('.tick');
          const tick1 = ticks[0];
          const tick2 = ticks[1];

          assert.isTrue(_isShapeValueWithinTickValues(
            shape,
            [tick1, tick2],
            test.tickOrderNormalYAxis,
            test.getYShapeValueFunction,
            test.getYTickValueFunction
          ));
        });

        it('should return false when the shape value is not within the tick ' +
        'values',
        function() {
          const cells = test.dom.window.document.querySelectorAll(
            test.shapeClassName + '-misaligned'
          );
          const shape = cells[0];

          const ticks = test.dom.window.document.querySelectorAll('.tick');
          const tick1 = ticks[0];
          const tick2 = ticks[1];

          assert.isFalse(_isShapeValueWithinTickValues(
            shape,
            [tick1, tick2],
            test.tickOrderNormalYAxis,
            test.getYShapeValueFunction,
            test.getYTickValueFunction
          ));
        });
      });
    });
  });
});
