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
 * Given axis x or y, return an object with size info, tick elements and labels.
 * @function
 * @param {HTMLElement} axis - HTMLElement g
 * @param {Number} getBegin - pixel value of axis begin (either x or y)
 * @param {Number} getEnd - pixel value of axis end (either x or y)
 * @param {Number} getEnd - pixel value of axis end (either x or y)
 * @param {Function} getTickLocation -
 * passes either getXTickLocation or getYTickLocation
 * via getXMisalignmentCount or getYMisalignmentCount
 * @returns {Object} Size, begin and end coordinates, tick and text NodeLists
 */
 var getAxisInfo = function(axis, getBegin, getEnd, getTickLocation) {
  var pathDesc = axis.querySelector('path').getAttribute('d'),
    begin = getBegin(pathDesc),
    end = getEnd(pathDesc);
  return {
    size: end - begin,
    begin: begin,
    end: end,
    ticks: axis.querySelectorAll('.tick'),
    text: axis.querySelectorAll('.tick text')
  };
};

/**
 * Run getAxisInfo with y axis specified.
 * @function
 * @param {HTMLElement} yAxis - HTMLElement g for y axis
 * @returns {function} with y axis specified
 */
export function getYAxisInfo(yAxis) {
  return getAxisInfo(yAxis, getYBegin, getYEnd, getYTickLocation);
}

/**
 * Run getAxisInfo with x axis specified.
 * @function
 * @param {HTMLElement} xAxis - HTMLElement g for x axis
 * @returns {function} with x axis specified
 */
export function getXAxisInfo(xAxis) {
  return getAxisInfo(xAxis, getXBegin, getXEnd, getXTickLocation);
}

/**
 * Get y coordinate of tick
 * @function
 * @param {HTMLElement} tick - HTMLElement g for given tick
 * @returns {Number} pixel value of y translate coordinate
 */
var getYTickLocation = function(tick) {
  return tick.getAttribute('transform').split(',')[1].split(')')[0];
};

/**
 * Get x coordinate of tick
 * @function
 * @param {HTMLElement} tick - HTMLElement g for given tick
 * @returns {Number} pixel value of x translate coordinate
 */
var getXTickLocation = function(tick) {
  return tick.getAttribute('transform').split(',')[0].split('(')[1];
};

/**
 * Convert one axis tick's label innerHTML from mm:ss to decimal
 * @function
 * @param {String} axisTick - innerHTML from text of a single tick. Ex: "37:00"
 * @returns {Number} float
 */
var getTickValueMinutes = function(axisTick) {
  return parseInt(axisTick.split(':')[0], 10) +
    (parseInt(axisTick.split(':')[1], 10) / 60);
};

/**
 * Convert feature data-yvalue attribute from date object to to decimal minutes
 * @function
 * @param {String} feature - HTMLElement circle (.dot)
 * @returns {Number} float
 */
var getFeatureValueMinutes = function(feature) {
  var value = feature.getAttribute('data-yvalue');

  return new Date(value).getMinutes() +
    (new Date(value).getSeconds() / 60);
};

/**
 * Parse feature data-xvalue attribute
 * @function
 * @param {String} feature - HTMLElement circle (.dot)
 * @returns {Number} integer
 */
var getFeatureValueYears = function(feature) {
  var value = feature.getAttribute('data-xvalue');

  return parseInt(value, 10);
};

/**
 * Compare feature coordinate to tick[i] and tick[i+1] and return true if
 * feature coordinate is greater than or equal to the coordinate for tick[i]
 * and less than or equal to the coordinate for tick[i+1]
 * @function
 * @param {Number} featureCoord - x or y coordinate per feature per axis
 * @param {Object} axis - Object constructed from getAxisInfo
 * @param {Number} tickPxCur - Coordinate (x or y) for tick[i]
 * @param {Number} tickPxNext - Coordinate (x or y) for tick[i+1]
 * @returns {Boolean} true if feature position is between (inclusive) tick[i]
 * and tick[i+1]
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
  return featureCoord >= (minTickCoord - 1) && featureCoord <= (maxTickCoord + 1)
};

/**
 * For given tick i and i+1, get features whose associated values are
 * between (inclusive) tick i and i+1 values and runs isFeatureAligned on each.
 * @param {Number} tickPxCur - Coordinate (x or y) for tick[i]
 * @param {Number} tickPxNext - Coordinate (x or y) for tick[i+1]
 * @param {Number} tickValCur - parsed from getTickValue(getTickText())
 * @param {Number} tickValNext - parsed from getTickValue(getTickText())
 * @param {Object} axis - object created from getAxisInfo
 * @param {Array} collection - HTMLCollection of features
 * @param {Function} getFeatureValue - (x or y) via getMisalignmentCountCaller
 * @param {Function} getFeatureCoord - (x or y) via getMisalignmentCountCaller
 * @return {Number} Count of misaligned features via isFeatureAligned
*/
var getMisalignmentCount = function(
  tickPxCur,
  tickPxNext,
  tickValCur,
  tickValNext,
  axis,
  collection,
  getFeatureValue,
  getFeatureCoord
) {
  var count = 0;

  for (var j = 0; j < collection.length - 1; j++) {
      // get values for given feature (j)
      var featureVal = getFeatureValue(collection.item(j)),
          featureCoord = getFeatureCoord(collection.item(j));
      if (featureVal >= tickValCur && featureVal <= tickValNext) {
          if (!isFeatureAligned(featureCoord, axis, tickPxCur, tickPxNext)) {
            count++;
          }
      }
  }
  return count;
};

/**
 * Get x coordinate of given feature
 * @function
 * @param {String} feature - HTMLElement circle (.dot)
 * @returns {Number} float
 */
var getXFeatureCoord = function(feature) {
  return parseFloat(feature.getAttribute('cx'));
};

/**
 * Get y coordinate of given feature
 * @function
 * @param {String} feature - HTMLElement circle (.dot)
 * @returns {Number} float
 */
var getYFeatureCoord = function(feature) {
  return parseFloat(feature.getAttribute('cy'));
};

/**
 * Parse y axis label (year)
 * @function
 * @param {String} axisTick - innerHTML from text element on y axis (year)
 * @returns {Number} integer
 */
var getTickValueYears = function(axisTick) {
  return parseInt(axisTick, 10);
};

/**
 * get innerHTML from text element inside a given <g class=".tick">
 * @function
 * @param {String} axisTick - HTMLElement g (.tick)
 * @returns {String} Label from axis
 */
var getTickText = function(axisTick) {
  return axisTick.querySelector('text').innerHTML;
};

/**
 * Run getMisalignmentCount with parameters for either x or y axis /
 * x or y feature coordinate
 * @function
 * @param {Function} getTickLocation -
 * passes either getXTickLocation or getYTickLocation
 * via getXMisalignmentCount or getYMisalignmentCount
 * @param {Function} getTickValue -
 * passes either getTickValueYears or getTickValueMinutes
 * via getXMisalignmentCount or getYMisalignmentCount
 * @param {Object} axis - constructed in getAxisInfo
 * @param {Array}  collection - HTMLCollection of features
 * @param {Number} i - index of axis tick
 * @param {Function} getFeatureValue -
 * passes either getFeatureValueYears or getFeatureValueMinutes
 * via getXMisalignmentCount or getYMisalignmentCount
 * @param {Function} getFeatureCoord -
 * passes either getXFeatureCoord or getYFeatureCoord
 * via getXMisalignmentCount or getYMisalignmentCount
 * @returns {Function} getMisAlignmentCount with specified parameters
 */
var getMisalignmentCountCaller = function(
  getTickLocation,
  getTickValue,
  axis,
  collection,
  i,
  getFeatureValue,
  getFeatureCoord
) {
  var tickValCur = getTickValue(getTickText(axis.ticks[i])),
    tickValNext = getTickValue(getTickText(axis.ticks[i + 1])),
    // d3 adds 0.5px to ends of axes, so subtract 0.5 to accurately compare
    // position to feature position.
    tickPxCur = getTickLocation(axis.ticks[i]) - 0.5,
    tickPxNext = getTickLocation(axis.ticks[i+1]) - 0.5;
  return getMisalignmentCount(
    tickPxCur,
    tickPxNext,
    tickValCur,
    tickValNext,
    axis,
    collection,
    getFeatureValue,
    getFeatureCoord
  );
};

/**
 * Run either getXMisalignmentCount or getYMisalignmentCount for all ticks on
 * that axis and keep a count
 * @function
 * @param {Object} axis - constructed in getAxisInfo
 * @param {Array}  collection - HTMLCollection of features
 * @param {Function} getMisalignmentCountFunc -
 * passes either getXMisalignmentCount or getYMisalignmentCount
 * @returns {Boolean} true if no misalignments are counted
 */
export function isAxisAlignedWithDataPoints(
  axis,
  collection,
  getMisalignmentCountFunc
) {
    var count = 0;

    for (var i = 0; i < axis.ticks.length - 1; i++) {
      count += getMisalignmentCountFunc(axis, collection, i);
    }

    return count === 0;
}

/**
 * Call getMisAlignmentCount via isAxisAlignedWithDataPoints
 * for a tick on the x axis
 * @function
 * @param {Object} axis - constructed in getAxisInfo
 * @param {Array}  collection - HTMLCollection of features
 * @param {Number} i - index of axis tick
 * @returns {Number} Count of misalignments
 */
export function getXMisalignmentCount(axis, collection, i) {
  var count = getMisalignmentCountCaller(
    getXTickLocation,
    getTickValueYears,
    axis,
    collection,
    i,
    getFeatureValueYears,
    getXFeatureCoord
  );

  return count;

}

/**
 * Call getMisAlignmentCount via isAxisAlignedWithDataPoints
 * for a tick on the y axis
 * @function
 * @param {Object} axis - constructed in getAxisInfo
 * @param {Array}  collection - HTMLCollection of features
 * @param {Number} i - index of axis tick
 * @returns {Number} Count of misalignments
 */
export function getYMisalignmentCount(axis, collection, i) {
  var count = getMisalignmentCountCaller(
    getYTickLocation,
    getTickValueMinutes,
    axis,
    collection,
    i,
    getFeatureValueMinutes,
    getYFeatureCoord
  );

  return count;
}
