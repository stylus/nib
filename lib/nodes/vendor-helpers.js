
/**
 * Module dependencies.
 */

var stylus = require('stylus')
  , nodes = stylus.nodes
  , utils = stylus.utils

/**
 * Expose `gradients-syntax-fix`.
 */

module.exports = function(value) {
  if (value) {
    return 'Hello ' + value.toString().toUpperCase()
  } else {
    return 'Hello World'
  }
}
