
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
    result = result.replace(/([\(\,]\s*)(-?(?:\d*\.)?\d+(?:%|px|em))(\s+)((hsl|rgb)a?\([^\)]+\)|#[^\)\,]+)/g,'$1$4$3$2');

    /* Normalize legacy gradients */
    result = result.replace(/(\(\s*)(?:(-?(\d*\.)?\d+)deg|((to )?(top|bottom|left|right)( (top|bottom|left|right))?))/g,function(match,p1,p2,p3,p4,p5,p6,p7,p8){
      /* Fix the degrees to the legacy syntax */
      var result = p1;
      if (p2) {
        result += (prefix ? parseFloat((Math.abs(450 - p2) % 360).toFixed(3)) : p2) + 'deg';
      }

      /* Fix the directions to the legacy syntax */
      var sides = {'top':'bottom','bottom':'top','left':'right','right':'left'};
      if (prefix && p5) {
        // `to top` to `bottom` etc.
        if (p6) {
          result += sides[p6];
        }
        if (p7) {
          result += ' ' + sides[p8];
        }
      } else if (!prefix && !p5) {
        // `top` to `to bottom` etc.
        if (p6) {
          result += 'to ' + sides[p6];
        }
        if (p7) {
          result += ' ' + sides[p8];
        }
      } else if (p4) {
        result += p4;
      }
      return result;
    });

    /* Adding prefixes to the legacy gradients */
    if (prefix) {
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
