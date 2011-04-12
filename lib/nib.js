
/*!
 * nib
 * Copyright (c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var stylus = require('stylus')
  , nodes = stylus.nodes
  , utils = stylus.utils
  , Canvas;

try {
  Canvas = require('canvas');
} catch (err) {
  // ignore
}

/**
 * Library version.
 */

exports.version = '0.0.3';

/**
 * Stylus path.
 */

exports.path = __dirname;

function posInStops(i, stops) {
  if (0 == i) return 0;
  if (stops.length - 1 == i) return 1;
  return i / stops.length;
}

// normalize color stops
//   - (color pos) -> (pos color)
//   - (color) -> (implied-pos color)

function normalizeStops(stops) {
  return stops.map(function(stop, i){
    var stop = utils.unwrap(stop)
      , color
      , pos;

    if (stop.nodes.length > 1) {
      if ('unit' == stop.nodes[1].nodeName) {
        color = stop.nodes[0].toString();
        pos = stop.nodes[1].val / 100;
      } else {
        pos = stop.nodes[0].val / 100;
        color = stop.nodes[1].toString();
      }
    } else {
      pos = posInStops(i, stops);
      color = stop.first.toString();
    }

    return [pos, color];
  });
}

// conditional canvas support

if (Canvas) {
  exports.linearGradientImage = function(){
    function linearGradientImage(){
      // TODO: type checking
      var canvas, width, height
        , arg = utils.unwrap(arguments[0])
        , size = arg.first.val
        , start = arg.nodes[1]
          ? arg.nodes[1].string
          : 'top';

      // start
      switch (start) {
        case 'top':
          canvas = new Canvas(1, size);
          from = [canvas.width / 2, 0];
          to = [canvas.width / 2, canvas.height];
          break;
        case 'bottom':
          canvas = new Canvas(1, size);
          from = [canvas.width / 2, canvas.height];
          to = [canvas.width / 2, 0];
          break;
        case 'left':
          canvas = new Canvas(size, 1);
          from = [0, 0];
          to = [canvas.width, canvas.height];
          break;
        case 'right':
          canvas = new Canvas(size, 1);
          from = [canvas.width, canvas.height];
          to = [0, 0];
          break;
        default:
          throw new Error('invalid start position "' + start + '"');
      }

      var ctx = canvas.getContext('2d');

      // setup gradient
      var grad = ctx.createLinearGradient(from[0], from[1], to[0], to[1])
        , stops = normalizeStops(Array.prototype.slice.call(arguments, 1))
        , expr
        , color
        , pos;

      // color stops
      stops.forEach(function(stop){
        grad.addColorStop(stop[0], stop[1]);
      });

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      return new nodes.Literal('url(' + canvas.toDataURL() + ')');
    }

    linearGradientImage.raw = true;

    return linearGradientImage;
  };
} else {
  exports.linearGradientImage = function(){
    throw new Error('please install node-canvas to use this function.');
  };
}