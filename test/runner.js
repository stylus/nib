
require.paths.unshift(__dirname + '/../support');

/**
 * Module dependencies.
 */

var fs = require('fs')
  , nib = require('../')
  , stylus = require('stylus');

console.error();

// files to test

var files = process.argv.slice(2);

// test files in sequence

(function next(){
  var file;
  if (file = files.shift()) {
    readFile(file, next);
  } else {
    console.error();
  }
})();

// read test files

function readFile(path, fn){
  process.stdout.write('  \033[90m- ' + path + ':\033[0m ');
  fs.readFile(path, 'utf8', function(err, styl){
    if (err) throw err;
    fs.readFile(path.replace('.styl', '.css'), 'utf8', function(err, css){
      if (err) throw err;
      testFile(path, styl, css, fn);
    });
  });
}

// perform comparison

function testFile(path, styl, expected, fn) {
  stylus(styl)
    .set('filename', path)
    .include(nib.path)
    .render(function(err, css){
      if (err) throw err;
      if (css.trim() == expected.trim()) {
        console.error('\033[36m✓\033[0m');
        fn();
      } else {
        console.error('\033[31m✘\033[0m');
        console.error('\n  \033[90mactual:\033[0m\n');
        console.error(css.replace(/^/gm, '  '));
        console.error('  \033[90mexpected:\033[0m\n');
        console.error(expected.replace(/^/gm, '  '));
        console.error();
        process.exit(1);
      }
    });
}