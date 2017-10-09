// D3 Alignment testing.
// Used to determine if all the shapes on a chart are correctly aligned with
// the ticks on an axis.

// This is the main function you should be using in tests.
// Given an axis that has ticks, and a list of data shapes, it determines if
// each shape is aligned with the correct ticks on the axis.
export function isAxisAlignedWithDataPoints(
  axis,
  dimension,
  dataShapes,
  getShapeValue,
  getTickValue,
  getShapePosition,
  getTickPosition
) {
  const dataShapesArray = [].slice.call(dataShapes);
  const allTicks = axis.querySelectorAll('.tick');

  const tickOrderNormal =
    _getTickOrdering(allTicks, getTickValue, getTickPosition, dimension);

  const outside = dataShapesArray.every(shape =>
    _isShapeAlignedWithTicks(
      shape,
      allTicks,
      dimension,
      tickOrderNormal,
      getShapeValue,
      getTickValue,
      getShapePosition,
      getTickPosition
    )
  );

  return outside;
}

// If the first tick is less than the second tick, and the first tick has
// a lower position then the ordering is considered "normal". If the order is
// normal, we return true. False otherwise.
function _getTickOrdering(allTicks, getTickValue, getTickPosition, dimension) {
  let returnValue;

  // Compare the first and second tick to see which is greater in value.
  if (getTickValue(allTicks[0]) < getTickValue(allTicks[1])) {
    returnValue = true;
  } else {
    returnValue = false;
  }

  // Now look at the position of the ticks to understand the order.
  if (getTickPosition(allTicks[0])[dimension] >
    getTickPosition(allTicks[1])[dimension]
  ) {
    return !returnValue;
  }

  return returnValue;
}


// TODO: Only exported so we can test it.
// Given an axis and one shape, it will find the surrounding ticks based on
// the position of the shape, and then it will determine if the value of the
// shape is between the tick values
export function _isShapeAlignedWithTicks(
  shape,
  allTicks,
  dimension,
  tickOrderNormal,
  getShapeValue,
  getTickValue,
  getShapePosition,
  getTickPosition
) {

  const position = getShapePosition(shape);

  const enclosingTicks = _getSurroundingTicks(
    allTicks,
    dimension,
    position,
    getTickPosition
  );

  let within = _isShapeValueWithinTickValues(
    shape,
    enclosingTicks,
    tickOrderNormal,
    getShapeValue,
    getTickValue
  );

  return within;
}

// Gets the nearest tick to a given position.
// The way it does this is not obvious. First it filters all the ticks to only
// get the ticks before or after the given position. The filtering is based
// on the "filterCompare" function parameter. Then it performs a reduce on the
// filtered ticks to find which one is closest to the given postion. The reduce
// function uses the "compare" parameter which is a function to compare ticks.
// See the "_getSurroundingTicks" function for an example of how this is used.
function getNearestTick(
  allTicks,
  filterCompare,
  dimension,
  position,
  getTickPosition,
  compare
) {

  // Function to finds the tick that is closest to the given position, based on
  // the compare function.
  const reduceFunction = function(result, tick) {
    const position = getTickPosition(tick)[dimension];
    if (result && compare(getTickPosition(result)[dimension], position)) {
      return result;
    }
    return tick;
  };

  // First filter the ticks to get only the ticks that are before or after
  // the given position.
  let ticks = allTicks.filter(tick => {
    let tickPosition = getTickPosition(tick)[dimension];
    return filterCompare(tickPosition, position[dimension]);
  });

  // Finally, run the reduce operation to get the closest tick.
  let closestTick = ticks.reduce(reduceFunction, null);

  return closestTick;
}

// TODO: Only exported so we can test it.
// Given a list of ticks it will find the ticks closest to the given position.
// This also works when there is no beforeTick or afterTick. I.e. sometimes some
// of the small values appear before the first tick, or the largest values
// appear after the last tick. In those cases it will return null for the
// tick in question.
export function _getSurroundingTicks(
  ticksList,
  dimension,
  position,
  getTickPosition,
) {

  let ticks;
  let afterTick;
  let beforeTick;
  let lessThanFilter = (tickPosition, position) => tickPosition <= position;
  let greaterThanCompare = (prevPosition, position) => prevPosition > position;
  let greaterThanFilter = (tickPosition, position) => tickPosition > position;
  let lessThanCompare = (prevPosition, position) => prevPosition < position;

  if (!ticksList) {
    throw new Error('The list of ticks must not be empty.');
  }

  ticks = [].slice.call(ticksList);

  // The filter function finds all ticks less than or equal to the position.
  // The compare function then finds the largest of the filtered ticks.
  beforeTick = getNearestTick(
    ticks,
    lessThanFilter,
    dimension,
    position,
    getTickPosition,
    greaterThanCompare
  );

  // The filter function finds all ticks greater than the position.
  // The compare function then finds the smallest of the filtered ticks.
  afterTick = getNearestTick(
    ticks,
    greaterThanFilter,
    dimension,
    position,
    getTickPosition,
    lessThanCompare
  );

  return [ beforeTick, afterTick ];
}

// TODO: Only exported so we can test it.
// Given an array of two ticks, it determines the values of the ticks and
// whether or not the value of the given shape is within the tick values.
export function _isShapeValueWithinTickValues(
  shape,
  ticks,
  tickOrderNormal,
  getShapeValue,
  getTickValue
) {

  const shapeValue = getShapeValue(shape);

  // beforeTick and afterTick have only to do with the position of the ticks
  // in relation to the position of the shape.
  let beforeTickValue;
  let afterTickValue;
  let returnValue;

  // The beforeTick could be null.
  if (!ticks[0]) {
    afterTickValue = getTickValue(ticks[1]);
    if (tickOrderNormal) {
      returnValue = shapeValue <= afterTickValue;
    } else {
      returnValue = shapeValue >= afterTickValue;
    }
  // The afterTick could be null.
  } else if (!ticks[1]) {
    beforeTickValue = getTickValue(ticks[0]);
    if (tickOrderNormal) {
      returnValue = beforeTickValue <= shapeValue;
    } else {
      returnValue = beforeTickValue >= shapeValue;
    }
  // Neither the beforeTick or afterTick are null, so we use both to compare.
  } else {
    beforeTickValue = getTickValue(ticks[0]);
    afterTickValue = getTickValue(ticks[1]);
    if (tickOrderNormal) {
      returnValue = (beforeTickValue <= shapeValue) &&
        (shapeValue <= afterTickValue);
    } else {
      returnValue = (beforeTickValue >= shapeValue) &&
        (shapeValue >= afterTickValue);
    }
  }

  return returnValue;
}
