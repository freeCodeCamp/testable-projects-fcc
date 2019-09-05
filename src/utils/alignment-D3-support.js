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

  if (!tick.querySelector('line')) {
    throw new Error('Tick does not contain the required line element.');
  }

  y = tick.querySelector('line').getBoundingClientRect().top;
  x = tick.querySelector('line').getBoundingClientRect().left;

  return { x: x, y: y };
}

export function getTickValue(item, dataType) {
  let val = item.querySelector('text').innerHTML;
  switch (dataType) {
    case 'minute':
      val =
        parseInt(val.split(':')[0], 10) + parseInt(val.split(':')[1], 10) / 60;
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
    case 'year':
      val = new Date(item.getAttribute(attribute)).getFullYear();
      break;
    case 'minute':
      val =
        new Date(item.getAttribute(attribute)).getMinutes() +
        new Date(item.getAttribute(attribute)).getSeconds() / 60;
      break;
    case 'month':
      val = isNaN(parseInt(item.getAttribute(attribute), 10))
        ? months.indexOf(item.getAttribute(attribute).toLowerCase())
        : item.getAttribute(attribute);
      break;
    default:
      val = item.getAttribute(attribute);
  }
  return parseFloat(val);
}

export function getShapePosition(item, dimension, positionType) {
  let bounds = item.getBoundingClientRect(),
    pos = /y/g.test(dimension) ? bounds.top : bounds.left;
  if (positionType === 'center') {
    pos += (/y/g.test(dimension) ? bounds.height : bounds.width) / 2;
  }
  return pos;
}
