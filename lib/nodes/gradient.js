
/**
 * Module dependencies.
 */

var stylus = require('stylus')
  , canvas = require('canvas')
  , nodes = stylus.nodes
  , utils = stylus.utils;

/**
 * Expose `Gradient`.
 */

exports = module.exports = Gradient;

/**
 * Create a new `Gradient` node with the given `size`.
 *
 * @param {Number} size
 * @api public
 */

exports.create = function(size){
  utils.assertType(size, 'unit', 'size');
  return new Gradient(size.val);
};

/**
 * Initialize a new `Gradient` node with the given `size`.
 *
 * @param {Number} size
 * @api private
 */

function Gradient(size) {
  this.size = size;
  this.stops = [];
};

Gradient.prototype.setStartPosition = function(start){
  var canvas
    , from
    , to;

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

  this.canvas = canvas;
  this.from = from;
  this.to = to;
};

Gradient.prototype.addColorStop = function(stop){
  if (!this.canvas) throw new Error('must set start position before adding color-stops');
  this.stops.push(stop);
};

Gradient.prototype.toDataURL = function(){
  if (!this.canvas) throw new Error('must set start position before rendering gradient'); 
  if (!this.stops.length) throw new Error('must add color stops before rendering gradient'); 

  var canvas = this.canvas
    , from = this.from
    , to = this.to
    , ctx = canvas.getContext('2d')
    , grad = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL();
};


/**
 * Inherit from `nodes.Node.prototype`.
 */

Gradient.prototype.__proto__ = nodes.Node.prototype;
