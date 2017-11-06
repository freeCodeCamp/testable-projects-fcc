// D3 Alignment test supporting functions. These functions fetch values
// and positions of both axis ticks and chart shapes (bars, dots, rects).
// TODO: Documentation.

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

export function getTickPosition(tick) {
  let x, y;

  if (!tick.hasAttribute('transform')) {
    throw new Error('Element does not have the required transform attribute.');
  }

  y = parseFloat(tick.getAttribute('transform').split(',')[1].split(')')[0]);
  x = parseFloat(tick.getAttribute('transform').split(',')[0].split('(')[1]);

  return { x: x, y: y};
}

export function getTickValue(item, dataType) {
  let val = item.querySelector('text').innerHTML;
  switch (dataType) {
    case null:
      break;
    case 'minute':
      val = parseInt(val.split(':')[0], 10) +
        (parseInt(val.split(':')[1], 10) / 60);
      break;
    case 'month':
      val = months.indexOf(val.toLowerCase());
      break;
    case 'thousand':
      val = val.split(',').join('');
      break;
    default:
      break;
  }
  return parseFloat(val);
}

export function getShapeValue(item, attribute, dataType) {
  let val;
  switch (dataType) {
    case null:
      val = item.getAttribute(attribute);
      break;
    case 'year':
      val = new Date(item.getAttribute(attribute)).getFullYear();
      break;
    case 'minute':
      val = new Date(item.getAttribute(attribute)).getMinutes() +
        (new Date(item.getAttribute(attribute)).getSeconds() / 60);
      break;
    case 'month':
      val = ( isNaN(parseInt(item.getAttribute(attribute), 10)) ?
        months.indexOf(item.getAttribute(attribute).toLowerCase()) :
        item.getAttribute(attribute)
      );
      break;
    default:
      val = item.getAttribute(attribute);
  }
  return parseFloat(val);
}

export function getShapePosition(item, dimension, positionType) {
  let half,
    pos = parseFloat(item.getAttribute(dimension));
  switch (positionType) {
    case 'topLeft':
      // bar
      half = 0;
      break;
    case 'center':
      // get either 'width' or 'height' if dimension is 'x', 'cx', 'y', or 'cy'
      let attr = dimension.match(/y/g) ? 'height' : 'width';
      // circle elements have 'r' attributes instead of 'height' or 'width'.
      // The half variable is for rect elements we want the midpoint from
      // so item.getAttribute(attr) will be null for circles.
      half = ( !item.getAttribute(attr) ?
        0 :
        parseFloat(item.getAttribute(attr)) / 2
      );
      break;
    default:
      half = 0;
  }
  pos += half;
  return pos;
}
