
/**
 * Module dependencies.
 */

var stylus = require('stylus')
  , nodes = stylus.nodes
  , utils = stylus.utils

/**
 * Expose `hello`.
 */

module.exports = function(value) {
  if (value) {
    return 'Hello ' + value.toString().toUpperCase()
  } else {
    return 'Hello World'
  }
}
