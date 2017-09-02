/**
 * @module alignmentD3Tests
 */

/**
 * Given the below path description example, we are trying to extract
 * M(1), which is 0.5, or the y coordinate at the top of the y axis.
 * @function
 * @param {String} pathDesc - d attribute. Ex: "M-6,0.5H0.5V500.5H-6"

 * @returns {Number} y coordinate at top of y axis
 */
var getYBegin = function(pathDesc) {
  var begin = pathDesc.split(',')[1].split('H')[0];
  return parseFloat(begin - 0.5);
};

/**
 * Given the below path description example, we are trying to extract
 * V, which is 500.5 (pixels), or the y coordinate at the bottom of the
 * y axis.
 * @function
 * @param {String} pathDesc - d attribute. Ex: "M-6,0.5H0.5V500.5H-6"

 * @returns {Number} y coordinate at bottom of y axis
 */
var getYEnd = function(pathDesc) {
  var end = pathDesc.split(',')[1].split('V')[1].split('H')[0];
  return parseFloat(end + 0.5);
};

/**
 * Given the below path description example, we are trying to extract
 * M(0), which is 0.5 (pixels), or the x coordinate at the beginning
 * (left side) of the x axis.
 * @function
 * @param {String} pathDesc - d attribute. Ex: "M0.5,6V0.5H840.5V6"

 * @returns {Number} x coordinate at beginning of x axis
 */
var getXBegin = function(pathDesc) {
  var begin = pathDesc.split(',')[0].split('M')[1];
  return parseFloat(begin - 0.5);
};

/**
 * Given the below path description example, we are trying to extract
 * H, which is 840.5 (pixels), or the x coordinate at the end
 * (right side) of the x axis.
 * @function
 * @param {String} pathDesc - d attribute. Ex: "M0.5,6V0.5H840.5V6"

 * @returns {Number} x coordinate at end of x axis
 */
var getXEnd = function(pathDesc) {
  var end = pathDesc.split(',')[1].split('H')[1].split('V')[0];
  return parseFloat(end + 0.5);
};

/**
 * Given axis x or y, return an object with size info, tick elements, labels,
 * and indicators for getting feature data attributes and coordinates.
 * @function
 * @param {HTMLElement} axis - HTMLElement g from
 * Ex. document.querySelector('#y-axis')
 * @param {String} dataAttr - data attribute to check: Ex. "data-yvalue"
 * @param {String} coordAttr - respective feature coordinate attribute: Ex. "cy"
 * @param {Function} getBegin - pass getBegin function (getXBegin or getYBegin)
 * @param {Function} getEnd - pass getEnd function (getXEnd or getYEnd)
 * @param {Array} units - Array of month names
 * @returns {Object} Size, begin and end coordinates, tick and text NodeLists
 */
 var getAxisInfo = function(
   axis,
   dataAttr,
   coordAttr,
   getBegin,
   getEnd,
   units
 ) {
  var pathDesc = axis.querySelector('path').getAttribute('d'),
    begin = getBegin(pathDesc),
    end = getEnd(pathDesc);
  return {
    size: end - begin,
    begin: begin,
    end: end,
    ticks: axis.querySelectorAll('.tick'),
    text: axis.querySelectorAll('.tick text'),
    dataAttr: dataAttr,
    coordAttr: coordAttr,
    units: units ? units : ''
  };
};

/**
 * Run getAxisInfo with y axis specified.
 * @function
 * @param {HTMLElement} yAxis - HTMLElement g for y axis
 * @param {String} dataAttr - feature data attribute to check: Ex. "data-yvalue"
 * @param {String} coordAttr - feature y coordinate attribute: Ex. "cy"

 * @returns {function} with y axis specified
 */
export function getYAxisInfo(yAxis, dataAttr, coordAttr) {
  return getAxisInfo(yAxis, dataAttr, coordAttr, getYBegin, getYEnd);
}

/**
 * Run getAxisInfo with x axis specified.
 * @function
 * @param {HTMLElement} xAxis - HTMLElement g for x axis
 * @param {String} dataAttr - feature data attribute to check: Ex. "data-xvalue"
 * @param {String} coordAttr - feature x coordinate attribute: Ex. "cx"

 * @returns {function} with x axis specified
 */
export function getXAxisInfo(xAxis, dataAttr, coordAttr) {
  return getAxisInfo(xAxis, dataAttr, coordAttr, getXBegin, getXEnd);
}

/**
 * Get y coordinate of tick
 * @function
 * @param {HTMLElement} tick - HTMLElement g for given tick iterated from
 * axis.querySelectorAll('.tick') in getAxisInfo

 * @returns {Number} pixel value of y translate coordinate
 */
var getYTickLocation = function(tick) {
  return tick.getAttribute('transform').split(',')[1].split(')')[0];
};

/**
 * Get x coordinate of tick
 * @function
 * @param {HTMLElement} tick - HTMLElement g for given tick iterated from
 * axis.querySelectorAll('.tick') in getAxisInfo

 * @returns {Number} pixel value of x translate coordinate
 */
var getXTickLocation = function(tick) {
  return tick.getAttribute('transform').split(',')[0].split('(')[1];
};

/**
 * Convert one axis tick's label innerHTML from mm:ss to decimal
 * @function
 * @param {String} axisTick - innerHTML from text of a single tick. Ex: "37:00"
 * from axis.querySelectorAll('.tick text') in getAxisInfo

 * @returns {Number} float
 */
export function getTickValueMinutes(axisTick) {
  return parseInt(axisTick.split(':')[0], 10) +
    (parseInt(axisTick.split(':')[1], 10) / 60);
}

/**
 * Parse one axis tick's label innerHTML
 * @function
 * @param {String} axisTick - innerHTML from text of single tick. Ex: "1990"
 * from axis.querySelectorAll('.tick text') in getAxisInfo

 * @returns {Number} integer
 */
export function getTickValueInteger(axisTick) {
  return parseInt(axisTick, 10);
}

/**
 * Convert one axis tick's label innerHTML from month string to index
 * @function
 * @param {String} axisTick - innerHTML from text of a single tick. Ex: "March"
 * from axis.querySelectorAll('.tick text') in getAxisInfo
 * @param {Object} axis - constructed in getAxisInfo
 * @returns {Number} integer
 */
export function getTickValueMonths(axisTick, axis) {
  var label = axisTick.toLowerCase();
  return axis.units.indexOf(label);
}

/**
 * Convert feature data-* attribute from date object to to decimal minutes
 * @function
 * @param {HTMLElement} feature - HTMLElement iterated from HTMLCollection from
 * project test, Ex. document.querySelectorAll('.cell').item(i) via
 * getMisalignmentCount
 * @param {Object} axis - constructed in getAxisInfo

 * @returns {Number} float
 */
export function getFeatureValueMinutes(feature, axis) {
  var value = feature.getAttribute(axis.dataAttr);

  return new Date(value).getMinutes() +
    (new Date(value).getSeconds() / 60);
}

/**
 * Parse feature data-* or data-year attribute
 * @function
 * @param {HTMLElement} feature - HTMLElement iterated from HTMLCollection from
 * project test, Ex. document.querySelectorAll('.cell').item(i) via
 * getMisalignmentCount
 * @param {Object} axis - constructed in getAxisInfo

 * @returns {Number} integer
 */
export function getFeatureValueInteger(feature, axis) {
  var value = feature.getAttribute(axis.dataAttr);

  return parseInt(value, 10);
}

/**
 * Get feature data-* attribute
 * @function
 * @param {HTMLElement} feature - HTMLElement iterated from HTMLCollection from
 * project test, Ex. document.querySelectorAll('.cell').item(i) via
 * getMisalignmentCount
 * @param {Object} axis - constructed in getAxisInfo

 * @returns {Number} integer
 */
export function getFeatureValueMonths(feature, axis) {
  var value = parseInt(feature.getAttribute(axis.dataAttr), 10);
  if (isNaN(value)) {
    value = feature.getAttribute(axis.dataAttr).toLowerCase();
    return axis.units.indexOf(value);
  } else {
    return value;
  }
}

/**
 * Compare feature coordinate to tick[i] and tick[i+1] and return true if
 * feature coordinate is greater than or equal to the coordinate for tick[i]
 * and less than the coordinate for tick[i+1]
 * @function
 * @param {Number} featureCoord - x or y pixel coordinate per feature per axis
 * @param {Object} axis - Object constructed from getAxisInfo
 * @param {Number} tickPxCur - Coordinate (x or y) for tick[i]
 * @param {Number} tickPxNext - Coordinate (x or y) for tick[i+1]

 * @returns {Boolean} true if feature position is between tick[i] (inclusive)
 * and tick[i+1] (exclusive)
 */
var isFeatureAligned = function(featureCoord, axis, tickPxCur, tickPxNext) {
  // Determine lower / higher coordinate size between two ticks
  // This is to account for reverse tick order (see issue #70)
  var minTickCoord = Math.min(tickPxCur, tickPxNext);
  var maxTickCoord = Math.max(tickPxCur, tickPxNext);
  // getMisalignmentCount checked whether the feature's attribute data-xvalue or
  // data-yvalue is between (inclusive) two ticks' labeled values.
  // If that is true, the feature's pixel coordinates should also be between
  // (inclusive) the two ticks' axis coordinates, plus-or-minus 1px.
  // Codepen and regular browser had 0.5px differences for these coordinates,
  // hence the 1px buffer.
  return featureCoord >= minTickCoord - 1 && featureCoord <= maxTickCoord + 1;
};

/**
 * For given tick i and i+1, get features whose associated values are
 * between (inclusive) tick i and i+1 values and runs isFeatureAligned on each.
 * @param {Object} axis - object created from getAxisInfo
 * @param {Array} collection - HTMLCollection of features from project test,
 * Ex. document.querySelectorAll('.cell')
 * @param {Function} getFeatureValueFunc - via getMisalignmentCountCaller
 * @param {Number} tickPxCur - Coordinate (x or y) for tick[i]
 * @param {Number} tickPxNext - Coordinate (x or y) for tick[i+1]
 * @param {Number} tickValCur - parsed from getTickValue(getTickText())
 * @param {Number} tickValNext - parsed from getTickValue(getTickText())

 * @return {Number} Count of misaligned features via isFeatureAligned
*/
var getMisalignmentCount = function(
  axis,
  collection,
  getFeatureValueFunc,
  tickPxCur,
  tickPxNext,
  tickValCur,
  tickValNext
) {
  var count = 0;

  for (var j = 0; j < collection.length - 1; j++) {
    // get values for given feature (j)
    var featureVal = getFeatureValueFunc(collection.item(j), axis),
      featureCoord = getFeatureCoord(collection.item(j), axis);
    if (featureVal >= tickValCur && featureVal < tickValNext) {
      if (!isFeatureAligned(featureCoord, axis, tickPxCur, tickPxNext)) {
        count++;
      }
    }
  }
  return count;
};

/**
 * Get x or y coordinate of given feature
 * @function
 * @param {HTMLElement} feature - HTMLElement (circle or rect) iterated from
 * collection of features in getMisalignmentCount
 * @param {Object} axis - constructed in getAxisInfo

 * @returns {Number} float
 */
var getFeatureCoord = function(feature, axis) {
  var coord;
  if (axis.coordAttr === 'cx' || axis.coordAttr === 'cy') {
    coord = parseFloat(feature.getAttribute(axis.coordAttr));
  } else {
    // the x, y attributes for each rect are from the top-left of the shape.
    // compute the mid-value for a coordinate to compare to axis tick
    var half;
    if (axis.coordAttr === 'x') {
      half = parseFloat(feature.getAttribute('width')) / 2;
    } else {
      half = parseFloat(feature.getAttribute('height')) / 2;
    }
    coord = parseFloat(feature.getAttribute(axis.coordAttr)) + half;
  }
  return coord;
};

/**
 * get innerHTML from text element inside a given <g class=".tick">
 * @function
 * @param {HTMLElement} axisTick - HTMLElement g (.tick) iterated from
 * axis in getMisalignmentCountCaller

 * @returns {String} Label from axis
 */
var getTickText = function(axisTick) {
  return axisTick.querySelector('text').innerHTML;
};

/**
 * Run getMisalignmentCount with parameters for either x or y axis /
 * x or y feature coordinate
 * @function
 * @param {Object} axis - constructed in getAxisInfo
 * @param {Array}  collection - HTMLCollection of features from project test,
 * Ex. document.querySelectorAll('.cell') or document.querySelectorAll('.dot')
 * @param {Function} getFeatureValueFunc - getFeatureValueInteger or
 * getFeatureValueMinutes
 * @param {Function} getTickLocationFunc - getXTickLocation or getYTickLocation
 * @param {Function} getTickValueFunc - getTickValueInteger,
 * getTickValueMinutes, or getTickValueMonths
 * @param {Number} i - index of axis tick

 * @returns {Function} getMisAlignmentCount with specified parameters
 */
var getMisalignmentCountCaller = function(
  axis,
  collection,
  getFeatureValueFunc,
  getTickLocationFunc,
  getTickValueFunc,
  i
) {
  var tickValCur = getTickValueFunc(getTickText(axis.ticks[i]), axis),
    tickValNext = getTickValueFunc(getTickText(axis.ticks[i + 1]), axis),
    // d3 adds 0.5px to ends of axes, so subtract 0.5 to accurately compare
    // position to feature position.
    tickPxCur = getTickLocationFunc(axis.ticks[i]) - 0.5,
    tickPxNext = getTickLocationFunc(axis.ticks[i + 1]) - 0.5;
  return getMisalignmentCount(
    axis,
    collection,
    getFeatureValueFunc,
    tickPxCur,
    tickPxNext,
    tickValCur,
    tickValNext
  );
};

/**
 * Run either getXMisalignmentCount or getYMisalignmentCount for all ticks on
 * that axis and keep a count
 * @function
 * @param {Object} axis - constructed in getAxisInfo
 * @param {Array}  collection - HTMLCollection of features from project test,
 * Ex. document.querySelectorAll('.cell') or document.querySelectorAll('.dot')
 * @param {Function} getMisalignmentCountFunc -
 * passes either getXMisalignmentCount or getYMisalignmentCount
 * @param {Function} getFeatureValueFunc - getFeatureValueInteger or
 * getFeatureValueMinutes
 * @param {Function} getTickValueFunc - getTickValueInteger,
 * getTickValueMinutes, or getTickValueMonths

 * @returns {Boolean} true if no misalignments are counted
 */
export function isAxisAlignedWithDataPoints(
  axis,
  collection,
  getMisalignmentCountFunc,
  getFeatureValueFunc,
  getTickValueFunc
) {
    var count = 0;
    for (var i = 0; i < axis.ticks.length - 1; i++) {
      count += getMisalignmentCountFunc(
        axis,
        collection,
        getFeatureValueFunc,
        getTickValueFunc,
        i
      );
    }

    return count === 0;
}

/**
 * Call getMisAlignmentCount via isAxisAlignedWithDataPoints
 * for a tick on the x axis
 * @function
 * @param {Object} axis - constructed in getAxisInfo
 * @param {Array}  collection - HTMLCollection of features from project test,
 * Ex. document.querySelectorAll('.cell') or document.querySelectorAll('.dot')
 * @param {Function} getFeatureValueFunc - getFeatureValueInteger or
 * getFeatureValueMinutes
 * @param {Function} getTickValueFunc - getTickValueInteger,
 * getTickValueMinutes, or getTickValueMonths
 * @param {Number} i - index of axis tick

 * @returns {Number} Count of misalignments
 */
export function getXMisalignmentCount(
  axis,
  collection,
  getFeatureValueFunc,
  getTickValueFunc,
  i
) {
  var count = getMisalignmentCountCaller(
    axis,
    collection,
    getFeatureValueFunc,
    getXTickLocation,
    getTickValueFunc,
    i
  );

  return count;

}

/**
 * Call getMisAlignmentCount via isAxisAlignedWithDataPoints
 * for a tick on the y axis
 * @function
 * @param {Object} axis - HTMLElement
 * @param {Array}  collection - HTMLCollection of features from project test,
 * Ex. document.querySelectorAll('.cell') or document.querySelectorAll('.dot')
 * @param {Function} getFeatureValueFunc - getFeatureValueInteger or
 * getFeatureValueMinutes
 * @param {Function} getTickValueFunc - getTickValueInteger,
 * getTickValueMinutes, or getTickValueMonths
 * @param {Number} i - index of axis tick

 * @returns {Number} Count of misalignments
 */
export function getYMisalignmentCount(
  axis,
  collection,
  getFeatureValueFunc,
  getTickValueFunc,
  i
) {
  var count = getMisalignmentCountCaller(
    axis,
    collection,
    getFeatureValueFunc,
    getYTickLocation,
    getTickValueFunc,
    i
  );

  return count;
}
