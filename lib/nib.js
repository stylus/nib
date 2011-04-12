
/*!
 * nib
 * Copyright (c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var stylus = require('stylus')
  , nodes = stylus.nodes
  , utils = stylus.utils
  , Canvas;

// conditionally expose gradient api

try {
  require('canvas');
  exports.gradient = require('./nodes/gradient');
} catch (err) {
  // ignore
}

/**
 * Library version.
 */

exports.version = '0.0.3';

/**
 * Stylus path.
 */

exports.path = __dirname;
