import {
  getTickValue,
  getTickPosition,
  getShapeValue,
  getShapePosition
} from '../utils/alignment-D3-support';

export function _getSurroundingTicks(
  shape,
  val,
  ticks,
  tickIndex,
  increment,
  dataType,
  normalTickOrder
) {
  let surroundingTicks = [],
    returnValue = null,
    nextIndex;
  do {
    // nextIndex is either one greater- or less-than according to sort order
    nextIndex = ( normalTickOrder ? (tickIndex + 1) : (tickIndex - 1) );

    let tickVal0 = (
      !ticks[tickIndex] ?
      // ticks[tickIndex] may be undefined. If so, calc mock tick value
      ( getTickValue(ticks[nextIndex], dataType) - increment ) :
      getTickValue(ticks[tickIndex], dataType) );

    let tickVal1 = (
      !ticks[nextIndex] ?
      ( getTickValue(ticks[tickIndex], dataType) + increment ) :
      getTickValue(ticks[nextIndex], dataType) );

    // In order to run a single comparison (if), ensure prevTickVal is smaller
    // than nextTickVal
    var prevTickVal = Math.min(tickVal0, tickVal1);
    var nextTickVal = Math.max(tickVal1, tickVal0);

    // each shape should only compare with one set (2) ticks and the shape's
    // value may equal one of the tick's value
    if (val >= prevTickVal && val < nextTickVal ) {
      let nextTick = (!ticks[nextIndex] ? null : ticks[nextIndex]);
      let prevTick = (!ticks[tickIndex] ? null : ticks[tickIndex]);
      surroundingTicks = [ prevTick, nextTick ];
    }

    if (normalTickOrder) {
      tickIndex++;
    } else {
      tickIndex--;
    }
  } while ( surroundingTicks.length < 2
    // stop when two surroundingTicks are captured and tick NodeList iterated
    && ( normalTickOrder ? tickIndex < ticks.length : tickIndex >= 0 )
  );
  if (surroundingTicks.length === 2) {
    returnValue = surroundingTicks;
  }
  // null if surroundingTicks is []
  return returnValue;
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

  const normalTickOrder =
    getTickValue(ticksCollection[ticksCollection.length - 1], dataType) >
    getTickValue(ticksCollection[0], dataType);

  // increment may be positive or negative based on axis sort order
  const increment = getTickValue(ticksCollection[1], dataType) -
    getTickValue(ticksCollection[0], dataType);

  // positionIncrement may be positive or negative based on axis sort order
  const positionIncrement = getTickPosition( ticksCollection[1] )[coord] -
    getTickPosition( ticksCollection[0] )[coord];

  shapeCollection.forEach(function(shape) {
    let pos = getShapePosition(shape, dimension, positionType);
    let val = getShapeValue(shape, dataAttribute, dataType);
    // index is initially off (either -1 or ticksCollection.length), then
    // _getSurroundingTicks increments or decrements according to sort order
    let tickIndex = ( !normalTickOrder ? ticksCollection.length : -1 );

    let surroundingTicks = _getSurroundingTicks(
      shape,
      val,
      ticksCollection,
      tickIndex,
      increment,
      dataType,
      normalTickOrder
    );

    if (surroundingTicks.length > 0) {
      let tickPos0 = ( !surroundingTicks[0] ?
        // surroundingTicks[0] may be null. if so, calc mock begin position
        ( getTickPosition( surroundingTicks[1] )[coord] - positionIncrement ) :
        // actual begin position
        getTickPosition( surroundingTicks[0] )[coord]
      );

      let tickPos1 = ( !surroundingTicks[1] ?
        // calc mock end position
        ( getTickPosition( surroundingTicks[0] )[coord] + positionIncrement ) :
        // actual position
        getTickPosition( surroundingTicks[1] )[coord]
      );
      let beforeTickPos = Math.min(tickPos0, tickPos1),
        afterTickPos = Math.max(tickPos0, tickPos1);

      // if shape is positioned between the two ticks plus or minus 11px
      // TODO reduce to 2px after Bar Chart is fixed. A leeway is necessary
      // for this code to work on all chart types.
      if ( (pos >= beforeTickPos - 11 ) && ( pos <= afterTickPos + 11 ) ) {
        aligned++;
      }
    }
  });
  return aligned === shapeCollection.length;
}
