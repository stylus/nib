
/**
 * Module dependencies.
 */

var stylus = require('stylus')
  , Canvas = require('canvas')
  , jade = require('jade')
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
 * @return {Gradient}
 * @api public
 */

exports.create = function(size, start){
  utils.assertType(size, 'unit', 'size');
  utils.assertString(start, 'start');
  return new Gradient(size.val, start.string);
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
 * @param {Number} size
 * @param {String} start
 * @api private
 */

function Gradient(size, start) {
  this.size = size;
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
  return 'Gradient(' + this.size + 'px '
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
  var x1
    , y1
    , x2
    , y2;
  
  switch (this.start) {
    case 'top':
      x1 = x2 = y1 = '0%';
      y2 = '100%';
      break;
    case 'bottom':
      x1 = x2 = y2 = '0%';
      y1 = '100%';
      break;
    case 'left':
      x1 = y1 = y1 = '0%';
      x2 = '100%';
      break;
    case 'right':
      x2 = y1 = y1 = '0%';
      x1 = '100%';
      break;
    default:
      throw new Error('invalid start position "' + start + '"');
  }
  
  var svg = jade.render('svg(xmlns="http://www.w3.org/2000/svg", viewBox="0 0 1 1", preserveAspectRatio="none", version="1.1")\n'
    + ' defs\n'
    + '   linearGradient(id="g", x1=x1, y1=y1, x2=x2, y2=y2)\n'
    + '     - colorStops.forEach(function(colorStop) {\n'
    + '       stop(offset=colorStop.pos, stop-color=colorStop.color)\n'
    + '     - })\n'
    + ' rect(fill="url(#g)", width="1", height="1")\n', { locals: { colorStops: this.colorStops, x1: x1, x2: x2, y1: y1, y2: y2 }});
    
   console.log(svg);
   return 'data:image/svg+xml;base64,' + new Buffer(svg).toString('base64');
}

/**
 * Inherit from `nodes.Node.prototype`.
 */

Gradient.prototype.__proto__ = nodes.Node.prototype;
