/**
 * Module dependencies.
 */
var stylus = require('stylus'),
    nib = require('../'),
    fs = require('fs');

/**
 * Read test/cases directory and filter all `.styl` files, then remove
 * this extension for each file in the collection and prepare to test.
 */
var cases = fs.readdirSync('test/cases').filter(function(file){
  return ~file.indexOf('.styl'); // bitwise flip to treat result as truthy.
}).map(function(file){
  return file.replace('.styl', '');
});

/*
 * For each `.styl` and `.css` pair in `test/cases`, compile stylus to css
 * and compare actual result to expected css.
 */
describe('integration', function(){
  cases.forEach(function(test){
    var name = test.replace(/[-.]/g, ' ');
    it(name, function(){
      var path = 'test/cases/' + test + '.styl';
      var styl = fs.readFileSync(path, 'utf8').replace(/\r/g, '');
      var css = fs.readFileSync('test/cases/' + test + '.css', 'utf8').replace(/\r/g, '').trim();

      var style = stylus(styl)
        .use(nib())
        .set('filename', path)
        .define('url', stylus.url());

      if (~test.indexOf('compress')) style.set('compress', true);

      style.render(function(err, actual){
        if (err) throw err;
        actual.trim().should.equal(css);
      });
    });
  });
});
