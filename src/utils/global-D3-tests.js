import { assert } from 'chai';
import $ from 'jquery';

import { timeout } from './threading';

function isToolTipHidden(tooltip) {
  // jQuery's :hidden selector checks if the element or its parents have a
  // display of none, a type of hidden, or height/width set to 0.
  // If the element is hidden with opacity=0 or visibility=hidden, jQuery's
  // :hidden will return false because it takes up space in the DOM.
  // This test combines jQuery's :hidden with tests for opacity and visibility
  // to cover most use cases (z-index and potentially others are not tested).
  let style = window.getComputedStyle(tooltip, null);
  return (
    $(tooltip).is(':hidden') ||
    style.opacity === '0' ||
    style.visibility === 'hidden' ||
    // It is needed only for svg, jQuery does not support it.
    style.display === 'none'
  );
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

/*
  JQuery's mouse events don't work for non IE browsers in these tests.
  This is a workaround to handle IE and non IE mouse events.
*/
function triggerMouseEvent(area, mouseEvent) {
  var event;
  if (document.createEvent) {
    // Internet Explorer.
    event = document.createEvent('MouseEvent');
    // TODO: Provide a link where all the parameters for initMouseEvent are
    // documented.
    event.initMouseEvent(
      mouseEvent,
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
  } else {
    // Non IE browser
    event = new MouseEvent(mouseEvent);
  }
  area.dispatchEvent(event);
}

/*
  Mouses over random areas to see if a tooltip appears.
*/
export function testToolTip(areas, toolTipDataName, areaDataName) {
  describe('#TooltipTests', function () {
    it(
      'I can mouse over an area and see a tooltip with a corresponding ' +
        'id="tooltip" which displays more information about the area ',
      async function () {
        const firstRequestTimeout = 500;
        const secondRequestTimeout = 2000;

        this.timeout(firstRequestTimeout + secondRequestTimeout + 1000);

        // Place mouse on random bar and check if tooltip is visible.
        const randomIndex = getRandomIndex(areas.length);
        const randomArea = areas[randomIndex];
        triggerMouseEvent(randomArea, 'mouseover');
        triggerMouseEvent(randomArea, 'mousemove');
        triggerMouseEvent(randomArea, 'mouseenter');

        // Timeout is used to accommodate tooltip transitions.
        await timeout(firstRequestTimeout);

        const tooltip = document.getElementById('tooltip');
        try {
          assert.isNotNull(
            tooltip,
            'There should be an element with id="tooltip"'
          );

          const hidden = isToolTipHidden(tooltip);
          assert.isFalse(
            hidden,
            'Tooltip should be visible when mouse is on an area'
          );
        } finally {
          // Remove mouse from cell and check if tooltip is hidden again.
          triggerMouseEvent(randomArea, 'mouseout');
          triggerMouseEvent(randomArea, 'mouseleave');
        }

        await timeout(secondRequestTimeout);

        const hidden = isToolTipHidden(tooltip);
        assert.isTrue(
          hidden,
          'Tooltip should be hidden when mouse is not on an area'
        );
      }
    );

    it(`My tooltip should have a "${toolTipDataName}" property that corresponds
    to the "${areaDataName}" of the active area.`, async function () {
      const randomIndex = getRandomIndex(areas.length);
      const randomArea = areas[randomIndex];

      triggerMouseEvent(randomArea, 'mouseover');
      triggerMouseEvent(randomArea, 'mousemove');
      triggerMouseEvent(randomArea, 'mouseenter');

      // Timeout is used to accommodate tooltip transitions.
      await timeout(500);

      try {
        const tooltip = document.getElementById('tooltip');
        assert.isNotNull(
          tooltip,
          'There should be an element with id="tooltip"'
        );

        assert.isNotNull(
          tooltip.getAttribute(toolTipDataName),
          `Could not find property "${toolTipDataName}" in tooltip `
        );

        assert.equal(
          tooltip.getAttribute(toolTipDataName),
          randomArea.getAttribute(areaDataName),
          `Tooltip's "${toolTipDataName}" property should be equal to the ` +
            `active area's "${areaDataName}" property`
        );
      } finally {
        // Clear out tooltip.
        triggerMouseEvent(randomArea, 'mouseout');
        triggerMouseEvent(randomArea, 'mouseleave');
      }
    });
  });
}
