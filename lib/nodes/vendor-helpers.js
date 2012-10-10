
/**
 * Module dependencies.
 */

var stylus = require('stylus')
  , nodes = stylus.nodes
  , utils = stylus.utils

/**
 * Expose `vendorize`.
 */

module.exports = function(value) {
  var result = value.toString();

  if (result.indexOf('gradient(') > -1) {
    result = result.replace(/(\(\s*)(?:(-?(\d*\.)?\d+)deg|to (top|bottom|left|right))/g,function(match,p1,p2,p3,p4){
      var result = p1;
      if (p2) {
        result += parseFloat((Math.abs(450 - p2) % 360).toFixed(3)) + 'deg';
      }
      if (p4) {
        result += {'top':'bottom','bottom':'top','left':'right','right':'left'}[p4];
      }
      return result;
    });
  }

  return new nodes.Ident(result);
}
