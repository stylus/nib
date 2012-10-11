
/**
 * Module dependencies.
 */

var stylus = require('stylus')
  , nodes = stylus.nodes
  , utils = stylus.utils

/**
 * Expose `vendorize`.
 */

module.exports = function(property,value,prefix) {
  var result = value.toString();

  if (result.indexOf('gradient(') > -1) {
    result = result.replace(/(\(\s*)(?:(-?(\d*\.)?\d+)deg|to (top|bottom|left|right)( (top|bottom|left|right))?)/g,function(match,p1,p2,p3,p4,p5,p6){
      var result = p1;
      var sides = {'top':'bottom','bottom':'top','left':'right','right':'left'};
      if (p2) {
        result += parseFloat((Math.abs(450 - p2) % 360).toFixed(3)) + 'deg';
      }
      if (p4) {
        result += sides[p4];
      }
      if (p5) {
        result += ' ' + sides[p6];
      }
      return result;
    });
    result = result.replace(/((repeating-)?(linear|radial)-gradient\()/g,'-' + prefix + '-$1');
  }

  if (property == "'transition'" || property == "'transition-property'") {
    result = result.replace(/\b(transform)\b/g,'-' + prefix + '-$1');
  }

  if (property == "'border-image'" || property == "'border-image-slice'") {
    result = result.replace(/\b(fill)\b/g,'');
  }

  return new nodes.Ident(result);
}
