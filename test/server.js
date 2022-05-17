/**
 * Module dependencies.
 */

var stylus = require('stylus'),
    serveStatic = require('serve-static'),
    connect = require('connect'),
    pug = require('pug'),
    nib = require('../');

/**
 * Server.
 */

var server = connect();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

server.use(stylus.middleware({
    src: __dirname
  , dest: __dirname + '/public'
  , force: true
  , compile: compile
}));

server.use(serveStatic(__dirname + '/public'));

server.use(function(req, res){
  pug.renderFile(__dirname + '/index.pug', function(err, str){
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(str);
  });
});

server.listen(3000);
console.log('Server listening on port 3000');
