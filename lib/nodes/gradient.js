
/**
 * Module dependencies.
 */

var stylus = require('stylus')
  , Canvas
  , jade = require('jade')
  , readFileSync = require('fs').readFileSync
  , nodes = stylus.nodes
  , utils = stylus.utils
  , renderSVGLinearGradient = jade.compile(readFileSync(__dirname + '/../templates/linearGradient.jade', 'utf8'));
  
try {
  Canvas = require('canvas');
} catch (err) {
  // ignore
}  
  
/**
 * Expose `Gradient`.
 */

exports = module.exports = Gradient;

/**
 * Create a new `Gradient` node with the given `size`
 * and `start` position.
 *
 * @param {String|Ident|Literal} start
 * @return {Gradient}
 * @api public
 */

exports.create = function(start){
  utils.assertString(start, 'start');
  return new Gradient(start.string);
};

/**
 * Set gradient size
 *
 * @param {Gradient} grad
 * @param {Number} size
 * @return {Null}
 * @api public
 */
exports.setSize = function(grad, size){
  utils.assertType(size, 'unit', 'size');
  grad.size = size.val;
  return nodes.null;
};

/**
 * Add color stop to `grad`.
 *
 * @param {Gradient} grad
 * @param {Unit} pos
 * @param {HSLA|RGBA} color
 * @return {Null}
 * @api public
 */

exports.addColorStop = function(grad, pos, color){
  utils.assertType(grad, 'gradient', 'grad');
  utils.assertType(pos, 'unit', 'pos');
  utils.assertColor(color, 'color');
  grad.addColorStop(pos.val / 100, color.rgba.toString());
  return nodes.null;
};

/**
 * Return the data URI for `grad`.
 *
 * @param {Gradient} grad
 * @return {String}
 * @api public
 */

exports.dataURL = function(grad){
  utils.assertType(grad, 'gradient');
  return new nodes.String(grad.toDataURL());
};

exports.svgDataURL = function(grad){
  utils.assertType(grad, 'gradient');
  return new nodes.String(grad.toSVGDataURL());
};

/**
 * Initialize a new `Gradient` node with the given `size`
 * and `start` position.
 *
 * @param {String} start
 * @api private
 */

function Gradient(start) {
  this.start = start;
  this.colorStops = [];
};

/**
 * Inspect the gradient.
 *
 * @return {String}
 * @api private
 */

Gradient.prototype.toString = function(){
  var size = this.size ? ' ' + this.size + 'px ' : '';
  return 'Gradient(' + size
    + this.stops.map(function(stop){
    return stop[0] + ' ' + stop[1];
  }).join(', ') + ')';
};

/**
 * Add color stop `pos` / `color`.
 *
 * @param {Number} pos
 * @param {String} color
 * @api private
 */

Gradient.prototype.addColorStop = function(pos, color){
  this.colorStops.push({ pos: pos, color: color })
};

/**
 * Return a PNG data URI string.
 *
 * @return {String}
 * @api private
 */

Gradient.prototype.toDataURL = function(){
  return this.toPNGDataURL();
};

/**
 * Return a PNG data URI string.
 *
 * @return {String}
 * @api private
 */

Gradient.prototype.toPNGDataURL = function() {
  var canvas = new Canvas(1, 1)
    , from
    , to
    , ctx
    , grad;
  
  if (!this.size) throw new Error('Size required for PNG data URL');
  
  switch (this.start) {
    case 'top':
      canvas.height = this.size;
      from = [canvas.width / 2, 0];
      to = [canvas.width / 2, canvas.height];
      break;
    case 'bottom':
      canvas.height = this.size;
      from = [canvas.width / 2, canvas.height];
      to = [canvas.width / 2, 0];
      break;
    case 'left':
      canvas.width = this.size;
      from = [0, 0];
      to = [canvas.width, canvas.height];
      break;
    case 'right':
      canvas.width = this.size;
      from = [canvas.width, canvas.height];
      to = [0, 0];
      break;
    default:
      throw new Error('invalid start position "' + start + '"');
  }
  
  ctx = canvas.getContext('2d');
  grad = ctx.createLinearGradient(
      from[0], from[1]
    , to[0], to[1]); 
    
  this.colorStops.forEach(function(colorStop) {
     grad.addColorStop(colorStop.pos, colorStop.color);
  });
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
}

/**
 * Return a SVG data URI string.
 *
 * @return {String}
 * @api private
 */

Gradient.prototype.toSVGDataURL = function() {
  var x1 = y1 = x2 = y2 = "0%"
    , svg
    , height = '100%'
    , width = '100%';
  
  switch (this.start) {
    case 'top':
      y2 = '100%';
      height = this.size || height;
      break;
    case 'bottom':
      y1 = '100%';
      height = this.size || height;
      break;
    case 'left':
      x2 = '100%';
      width = this.size || width;
      break;
    case 'right':
      x1 = '100%';
      width = this.size || width;
      break;
    default:
      throw new Error('invalid start position "' + start + '"');
  }
  
   svg = renderSVGLinearGradient.call(this, { height: height, width: width, colorStops: this.colorStops, x1: x1, x2: x2, y1: y1, y2: y2 })  
   return 'data:image/svg+xml;base64,' + new Buffer(svg).toString('base64');
}

/**
 * Inherit from `nodes.Node.prototype`.
 */

Gradient.prototype.__proto__ = nodes.Node.prototype;
