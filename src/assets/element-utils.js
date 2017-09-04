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
