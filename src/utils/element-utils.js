export function testHorizontallyCentered(elName, window) {
  const centeredElement = window.document.getElementById(elName);
  const centeredElementBounds = centeredElement.getBoundingClientRect();
  const leftGap = centeredElementBounds.left;
  const rightGap = window.innerWidth - centeredElementBounds.right;
  // allow for scrollbar width
  return Math.abs(leftGap - rightGap) < 20;
}

function getElements(elementIds) {
  return elementIds.map(elementId => document.getElementById(elementId));
}

export function clickButtonsById(buttonIds) {
  const keys = getElements(buttonIds);
  keys.forEach(key => {
    if (key && (typeof key.click === 'function')) {
      key.click();
    }
  });
}

// Determines if a collection of HTML elements has at least the specified number
// of unique colors.
export function hasUniqueColorsCount(elements, numberOfColors) {

  let uniqueColors = [];

  // Use a loop instead of 'foreach' so we can return early.
  for (let i = 0; i < elements.length; i++) {
    let color = elements[i].style.fill || elements[i].getAttribute('fill');

    // Make sure the color contains an actual value instead of something like
    // null or undefined.
    // If the current color isn't in the uniqueColors arr, push it.
    if (color && (uniqueColors.indexOf(color) === -1)) {
      uniqueColors.push(color);
    }

    if (uniqueColors.length >= numberOfColors) {
      return true;
    }

  }

  return false;
}
