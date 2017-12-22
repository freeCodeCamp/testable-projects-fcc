// D3 Alignment test supporting functions. Anything that is chart specific
// should go here. For example, the getTickValueMonth function is only used for
// testing the Heatmap D3 Chart, so it belongs here.

// TODO: Documentation.

export function getTickPosition(tick) {
  let x, y;

  if (!tick.hasAttribute('transform')) {
    throw new Error('Element does not have the required transform attribute.');
  }

  y = parseFloat(tick.getAttribute('transform').split(',')[1].split(')')[0]);
  x = parseFloat(tick.getAttribute('transform').split(',')[0].split('(')[1]);

  return { x: x, y: y};
}

export function getTickValueMonth(tick) {
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
  ];

  const value = tick.querySelector('text').innerHTML.toLowerCase();
  return months.indexOf(value);
}

export function getTickValueYear(tick) {
  return parseInt(tick.querySelector('text').innerHTML, 10);
}

export function getShapeValueMonthHeatMap(shape) {
  return parseInt(shape.getAttribute('data-month'), 10);
}

export function getShapeValueYearHeatMap(shape) {
  return parseInt(shape.getAttribute('data-year'), 10);
}

export function getShapeValueYearScatter(shape) {
  return parseInt(shape.getAttribute('data-xvalue'), 10);
}

export function getShapeValueYearBar(shape) {
  // Number from String. Example from dataset: '2015-01-01'
  return parseInt(shape.getAttribute('data-date').split('-')[0], 10);
}

export function getShapeValueDecimal(shape) {
  return parseFloat(shape.getAttribute('data-gdp'));
}

export function getTickValueThousands(tick) {
  // Number from String. Example from dataset: '2,000'
  return parseInt(tick.querySelector('text').innerHTML.split(',').join(''), 10);
}

export function getShapeValueMinutes(shape) {
  const value = shape.getAttribute('data-yvalue');
  return new Date(value).getMinutes() +
    (new Date(value).getSeconds() / 60);
}

export function getTickValueMinutes(tick) {
  const value = tick.querySelector('text').innerHTML;
  return parseInt(value.split(':')[0], 10) +
    (parseInt(value.split(':')[1], 10) / 60);
}

export function getShapePositionRect(shape) {
  // the x, y attributes for each rect are from the top-left of the shape.
  // compute the mid-value for a coordinate to compare to axis tick
  let half, x, y;

  half = parseFloat(shape.getAttribute('width')) / 2;
  x = parseFloat(shape.getAttribute('x')) + half;

  half = parseFloat(shape.getAttribute('height')) / 2;
  y = parseFloat(shape.getAttribute('y')) + half;

  return { x: x, y: y};
}

export function getShapePositionRectBar(shape) {
  // the x, y attributes for each rect are from the top-left of the shape.
  // compute the mid-value for a coordinate to compare to x-axis tick

  // TODO: rects are computed at y + 6 because
  // the fCC Bar Chart appears to have misalignment.
  let x, y, width;

  width = parseFloat(shape.getAttribute('width'));
  x = parseFloat(shape.getAttribute('x')) + (width / 2);
  // fCC Bar Chart pen is at most 6px off on the y-axis
  y = parseFloat(shape.getAttribute('y')) + 5.5;

  return { x: x, y: y, width: width };
}

export function getShapePositionCircle(shape) {
  let x, y;

  x = parseFloat(shape.getAttribute('cx'));

  y = parseFloat(shape.getAttribute('cy'));

  return { x: x, y: y};
}
