// BDD tests for the alignment-D3-support module.

// TODO: Most functions are not tested yet. The following functions need tests:
// getShapeValue
// getTickValue
// getShapePosition with 'topLeft' alignment
// getShapePosition with <circle> elements
import {
  getShapePosition,
  getTickPosition
} from '../src/utils/alignment-D3-support';

import { assert } from 'chai';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

describe('D3 Alignment support tests', function() {

  describe('getTickPosition function', function() {

    it('should get a position from the transform attribute',
    function() {

      const dom = new JSDOM(`
        <g class="tick" transform="translate(0,16.5)">
        </g>`
      );

      const tick = dom.window.document.querySelector('.tick');

      const position = getTickPosition(tick);

      assert.equal(position.x, 0);
      assert.equal(position.y, 16.5);

    });

    it('should throw an error if there is no transform attribute',
    function() {

      const dom = new JSDOM(`
        <g class="tick">
        </g>`
      );

      const tick = dom.window.document.querySelector('.tick');

      assert.throws(
        function() { getTickPosition(tick); },
        Error
      );

    });

  });

  describe('getShapePosition function', function() {
    it('should return the center position of a rectangle, taking the width ' +
    'and height into account',
    function() {

      const dom = new JSDOM(`
        <rect class="cell" x="2" y="4" width="5" height="33">
        </rect>`
      );
      const shape = dom.window.document.querySelector('.cell');
      const positionX = getShapePosition(shape, 'x', 'center');
      const positionY = getShapePosition(shape, 'y', 'center');
      assert.strictEqual(positionX, 4.5);
      assert.strictEqual(positionY, 20.5);
    });
  });

});
