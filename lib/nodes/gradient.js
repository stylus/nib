
/**
 * Module dependencies.
 */

var stylus = require('stylus')
  , Canvas = require('canvas')
  , nodes = stylus.nodes
  , utils = stylus.utils;

/**
 * Expose `Gradient`.
 */

exports = module.exports = Gradient;

/**
 * Create a new `Gradient` node with the given `size`
 * and `start` position.
 *
 * @param {Number} size
 * @param {String|Ident|Literal} start
 * @api public
 */

exports.create = function(size, start){
  utils.assertType(size, 'unit', 'size');
  utils.assertString(start, 'start');
  return new Gradient(size.val, start.string);
};

exports.addColorStop = function(grad, pos, color){
  utils.assertType(grad, 'gradient', 'grad');
  utils.assertType(pos, 'unit', 'pos');
  utils.assertColor(color, 'color');
  grad.addColorStop(pos.val / 100, color.toString());
  return nodes.null;
};

exports.dataURL = function(grad){
  utils.assertType(grad, 'gradient');
  return new nodes.String(grad.toDataURL());
};

/**
 * Initialize a new `Gradient` node with the given `size`
 * and `start` position.
 *
 * @param {Number} size
 * @param {String} start
 * @api private
 */

function Gradient(size, start) {
  this.size = size;
  this.canvas = new Canvas(1, 1);
  this.setStartPosition(start);
  this.stops = [];
};

Gradient.prototype.toString = function(){
  return 'Gradient(' + this.size + 'px '
    + this.stops.map(function(stop){
    return stop[0] + ' ' + stop[1];
  }).join(', ') + ')';
};

Gradient.prototype.setStartPosition = function(start){
  var size = this.size
    , canvas = this.canvas;

  switch (start) {
    case 'top':
      canvas.height = size;
      this.from = [canvas.width / 2, 0];
      this.to = [canvas.width / 2, canvas.height];
      break;
    case 'bottom':
      canvas.height = size;
      this.from = [canvas.width / 2, canvas.height];
      this.to = [canvas.width / 2, 0];
      break;
    case 'left':
      canvas.width = size;
      this.from = [0, 0];
      this.to = [canvas.width, canvas.height];
      break;
    case 'right':
      canvas.width = size;
      this.from = [canvas.width, canvas.height];
      this.to = [0, 0];
      break;
    default:
      throw new Error('invalid start position "' + start + '"');
  }
};

Gradient.prototype.addColorStop = function(pos, color){
  if (!this.canvas) throw new Error('must set start position before adding color-stops');
  this.stops.push([pos, color]);
};

Gradient.prototype.toDataURL = function(){
  if (!this.canvas) throw new Error('must set start position before rendering gradient'); 
  if (!this.stops.length) throw new Error('must add color stops before rendering gradient'); 

  var canvas = this.canvas
    , from = this.from
    , to = this.to
    , ctx = canvas.getContext('2d')
    , grad = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);

  this.stops.forEach(function(stop){
    grad.addColorStop(stop[0], stop[1]);
  });

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL();
};


/**
 * Inherit from `nodes.Node.prototype`.
 */

Gradient.prototype.__proto__ = nodes.Node.prototype;
