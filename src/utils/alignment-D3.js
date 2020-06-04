import {
  getTickValue,
  getTickPosition,
  getShapeValue,
  getShapePosition
} from '../utils/alignment-D3-support';

export function _getSurroundingTicks(value, ticks, normalTickOrder) {
  let leftIndex = 0;
  let rightIndex = ticks.length;

  // Use binary search to find an index before which to insert the value
  while (leftIndex !== rightIndex) {
    let midIndex = Math.floor((leftIndex + rightIndex) / 2);
    if (ticks[midIndex] === value) {
      leftIndex = rightIndex = midIndex + 1;
    } else if (
      (normalTickOrder && ticks[midIndex] > value) ||
      (!normalTickOrder && ticks[midIndex] < value)
    ) {
      rightIndex = midIndex;
    } else {
      leftIndex = midIndex + 1;
    }
  }

  if (leftIndex === 0 || leftIndex === ticks.length) {
    return [];
  }
  return [leftIndex - 1, leftIndex];
}

export function areShapesAlignedWithTicks(
  // NodeList
  shapeCollection,
  // NodeList
  ticksCollection,
  // String: 'x', 'y', 'cx', or 'cy'
  dimension,
  // String: 'data-year', 'data-gdp', 'data-date', 'data-xvalue', 'data-yvalue'
  dataAttribute,
  // String: 'year', 'minute', 'thousand', 'month'
  dataType,
  // Shape vertex to compare to axis: String: 'topLeft' or 'center'
  positionType
) {
  // return early if no shapes
  if (shapeCollection.length === 0) {
    return false;
  }
  let aligned = 0;

  // get either 'x' or 'y' in case of 'cx' or 'cy'
  const coord = dimension.match(/c/g) ? dimension.split('c')[1] : dimension;

  let tickValues = [].map.call(ticksCollection, (tick) =>
    getTickValue(tick, dataType)
  );
  const normalValueOrder = tickValues[tickValues.length - 1] > tickValues[0];

  // increment may be positive or negative based on axis sort order
  const increment = tickValues[1] - tickValues[0];
  tickValues = [
    tickValues[0] - increment,
    ...tickValues,
    tickValues[tickValues.length - 1] + increment
  ];

  let tickPositions = [].map.call(
    ticksCollection,
    (tick) => getTickPosition(tick)[coord]
  );
  const normalPositionOrder = tickPositions[1] > tickPositions[0];
  // positionIncrement may be positive or negative based on axis sort order
  const positionIncrement = tickPositions[1] - tickPositions[0];
  tickPositions = [
    tickPositions[0] - positionIncrement,
    ...tickPositions,
    tickPositions[tickPositions.length - 1] + positionIncrement
  ];

  shapeCollection.forEach(function (shape) {
    let pos = getShapePosition(shape, dimension, positionType);
    let val = getShapeValue(shape, dataAttribute, dataType);
    // index is initially off (either -1 or ticksCollection.length), then
    // _getSurroundingTicks increments or decrements according to sort order

    let surroundingTicks = _getSurroundingTicks(
      val,
      tickValues,
      normalValueOrder
    );

    if (surroundingTicks.length > 0) {
      let prevTick, nextTick;
      if (normalPositionOrder) {
        [prevTick, nextTick] = surroundingTicks;
      } else {
        [nextTick, prevTick] = surroundingTicks;
      }

      let prevPos = tickPositions[prevTick];
      let nextPos = tickPositions[nextTick];

      // If shape is positioned between the two ticks plus or minus 3px
      // A leeway is necessary for this code to work on all chart types.
      if (prevPos - 3 <= pos && pos <= nextPos + 3) {
        aligned++;
      }
    }
  });
  return aligned === shapeCollection.length;
}
