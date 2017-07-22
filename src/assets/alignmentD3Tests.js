/**
 * @module alignmentD3Tests
 */
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep',
'oct', 'nov', 'dec']

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
 * @param {HTMLElement} axis - HTMLElement g
 * @param {String} dataAttr - data attribute to check: Ex. "data-yvalue"
 * @param {String} dataType - type of data represented by axis: Ex. "Months"
 * @param {String} coordAttr - respective feature coordinate attribute: Ex. "cy"
 * @param {Number} getBegin - pixel value of axis begin (either x or y)
 * @param {Number} getEnd - pixel value of axis end (either x or y)
 * @returns {Object} Size, begin and end coordinates, tick and text NodeLists
 */
 var getAxisInfo = function(
   axis,
   dataAttr,
   dataType,
   coordAttr,
   getBegin,
   getEnd
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
    dataType: dataType,
    coordAttr: coordAttr
  };
};

/**
 * Run getAxisInfo with y axis specified.
 * @function
 * @param {HTMLElement} yAxis - HTMLElement g for y axis
 * @returns {function} with y axis specified
 */
export function getYAxisInfo(yAxis, dataAttr, dataType, coordAttr) {
  return getAxisInfo(yAxis, dataAttr, dataType, coordAttr, getYBegin, getYEnd);
}

/**
 * Run getAxisInfo with x axis specified.
 * @function
 * @param {HTMLElement} xAxis - HTMLElement g for x axis
 * @returns {function} with x axis specified
 */
export function getXAxisInfo(xAxis, dataAttr, dataType, coordAttr) {
  return getAxisInfo(xAxis, dataAttr, dataType, coordAttr, getXBegin, getXEnd);
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
 * Parse one axis tick's label innerHTML
 * @function
 * @param {String} axisTick - innerHTML from text of single tick. Ex: "1990"
 * @returns {Number} integer
 */
var getTickValueInteger = function(axisTick) {
  return parseInt(axisTick, 10);
};

/**
 * Convert one axis tick's label innerHTML from month string to index
 * @function
 * @param {String} axisTick - innerHTML from text of a single tick. Ex: "March"
 * @returns {Number} integer
 */
var getTickValueMonths = function(axisTick) {
  var label = axisTick.substring(0, 3).toLowerCase();
  return months.indexOf(label);
};

/**
 * Convert feature data-yvalue attribute from date object to to decimal minutes
 * @function
 * @param {String} feature - HTMLElement circle (.dot)
 * @returns {Number} float
 */
var getFeatureValueMinutes = function(feature, dataAttr) {
  var value = feature.getAttribute(dataAttr);

  return new Date(value).getMinutes() +
    (new Date(value).getSeconds() / 60);
};

/**
 * Parse feature data-xvalue or data-year attribute
 * @function
 * @param {String} feature - HTMLElement circle (.dot)
 * @returns {Number} integer
 */
var getFeatureValueInteger = function(feature, dataAttr) {
  var value = feature.getAttribute(dataAttr);

  return parseInt(value, 10);
};

/**
 * Get feature data-month attribute
 * @function
 * @param {String} feature - HTMLElement rect (.cell)
 * @returns {Number} integer
 */
var getFeatureValueMonths = function(feature, dataAttr) {
  var value = parseInt(feature.getAttribute(dataAttr), 10);
  if (isNaN(value)) {
    value = feature.getAttribute(dataAttr).substring(0, 3).toLowerCase();
    return months.indexOf(value);
  } else {
    return value;
  }
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
 * @return {Number} Count of misaligned features via isFeatureAligned
*/
var getMisalignmentCount = function(
  tickPxCur,
  tickPxNext,
  tickValCur,
  tickValNext,
  axis,
  collection,
  getFeatureValue
) {
  var count = 0;

  for (var j = 0; j < collection.length - 1; j++) {
      // get values for given feature (j)
      var featureVal = getFeatureValue(collection.item(j), axis.dataAttr),
          featureCoord = getFeatureCoord(collection.item(j), axis.coordAttr);
      if (featureVal >= tickValCur && featureVal <= tickValNext) {
          if (!isFeatureAligned(featureCoord, axis, tickPxCur, tickPxNext)) {
            console.log(featureCoord, tickPxCur, tickPxNext)
            count++;
          }
      }
  }
  return count;
};

/**
 * Get coordinate of given feature
 * @function
 * @param {String} feature - HTMLElement (circle or rect)
 * @param {String} coordAttr - feature coordinate attribute
 * @returns {Number} float
 */
var getFeatureCoord = function(feature, coordAttr) {
  //var type = feature.tagName;
  var coord;
  if (coordAttr === 'cx' || coordAttr === 'cy') {
    coord = parseFloat(feature.getAttribute(coordAttr));
  } else {
    // the x, y attributes for each rect are from the top-left of the shape.
    // compute the mid-value for a coordinate to compare to axis tick
    var half;
    if (coordAttr === 'x') {
      half = parseFloat(feature.getAttribute('width')) / 2;
    } else {
      half = parseFloat(feature.getAttribute('height')) / 2;
    }
    coord = parseFloat(feature.getAttribute(coordAttr)) + half;
  }
  return coord;
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
 * passes getTickValueInteger, getTickValueMinutes, getTickValueMonths
 * via getXMisalignmentCount or getYMisalignmentCount
 * @param {Object} axis - constructed in getAxisInfo
 * @param {Array}  collection - HTMLCollection of features
 * @param {Number} i - index of axis tick
 * @param {Function} getFeatureValue -
 * passes either getFeatureValueInteger or getFeatureValueMinutes
 * via getXMisalignmentCount or getYMisalignmentCount
 * @returns {Function} getMisAlignmentCount with specified parameters
 */
var getMisalignmentCountCaller = function(
  getTickLocation,
  getTickValue,
  axis,
  collection,
  i,
  getFeatureValue
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
    getFeatureValue
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
  var getTickValueFunc, getFeatureValueFunc;
  switch(axis.dataType) {
    case 'Integer':
      getTickValueFunc = getTickValueInteger;
      getFeatureValueFunc = getFeatureValueInteger;
      break;
    case 'Minutes':
      getTickValueFunc = getTickValueMinutes;
      getFeatureValueFunc = getFeatureValueMinutes;
      break;
    case 'Months':
      getTickValueFunc = getTickValueMonths;
      getFeatureValueFunc = getFeatureValueMonths;
      break;
  }
  var count = getMisalignmentCountCaller(
    getXTickLocation,
    getTickValueFunc,
    axis,
    collection,
    i,
    getFeatureValueFunc
  );

  return count;

}

/**
 * Call getMisAlignmentCount via isAxisAlignedWithDataPoints
 * for a tick on the y axis
 * @function
 * @param {Object} axis - HTMLElement
 * @param {Array}  collection - HTMLCollection of features
 * @param {Number} i - index of axis tick
 * @returns {Number} Count of misalignments
 */
export function getYMisalignmentCount(axis, collection, i) {
  var getTickValueFunc, getFeatureValueFunc;
  switch(axis.dataType) {
    case 'Integer':
      getTickValueFunc = getTickValueInteger;
      getFeatureValueFunc = getFeatureValueInteger;
      break;
    case 'Minutes':
      getTickValueFunc = getTickValueMinutes;
      getFeatureValueFunc = getFeatureValueMinutes;
      break;
    case 'Months':
      getTickValueFunc = getTickValueMonths;
      getFeatureValueFunc = getFeatureValueMonths;
      break;
  }
  var count = getMisalignmentCountCaller(
    getYTickLocation,
    getTickValueFunc,
    axis,
    collection,
    i,
    getFeatureValueFunc
  );

  return count;
}
