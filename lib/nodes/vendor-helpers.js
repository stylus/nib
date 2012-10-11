
/**
 * Module dependencies.
 */

var stylus = require('stylus')
  , nodes = stylus.nodes
  , utils = stylus.utils

/**
 * Expose `normalize`.
 */

module.exports = function(property,value,prefix) {
  var result = value.toString();

  /* Fixing the gradients */
  if (result.indexOf('gradient(') > -1) {

    /* Normalize color stops */
    if (result.indexOf('%') > -1) {
      result = result.replace(/([\(\,]\s*)(-?(?:\d*\.)?\d+%)(\s+)((hsl|rgb)a?\([^\)]+\)|#[^\)\,]+)/g,'$1$4$3$2');
    }

    if (prefix) {
      result = result.replace(/(\(\s*)(?:(-?(\d*\.)?\d+)deg|to (top|bottom|left|right)( (top|bottom|left|right))?)/g,function(match,p1,p2,p3,p4,p5,p6){
        /* Fix the degrees to the legacy syntax */
        var result = p1;
        if (p2) {
          result += parseFloat((Math.abs(450 - p2) % 360).toFixed(3)) + 'deg';
        }
        /* Fix the directions to the legacy syntax */
        var sides = {'top':'bottom','bottom':'top','left':'right','right':'left'};
        if (p4) {
          result += sides[p4];
        }
        if (p5) {
          result += ' ' + sides[p6];
        }
        return result;
      });

      /* Adding prefixes to the legacy gradients */
      result = result.replace(/((repeating-)?(linear|radial)-gradient\()/g,'-' + prefix + '-$1');
    }
  }

  /* Adding prefixes to the `transform` values of legacy `transition` property */
  if (prefix && (property == "'transition'" || property == "'transition-property'")) {
    result = result.replace(/\b(transform)\b/g,'-' + prefix + '-$1');
  }

  /* Removing `fill` keyword from the legacy `border-image` property */
  if (prefix && (property == "'border-image'" || property == "'border-image-slice'")) {
    result = result.replace(/\s*\b(fill)\b\s*/g,' ');
  }

  return new nodes.Ident(result);
}
