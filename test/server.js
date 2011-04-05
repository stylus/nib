
/**
 * Module dependencies.
 */

var stylus = require('../support/stylus')
  , connect = require('../support/connect')
  , nib = require('../');

/**
 * Server.
 */

var server = connect.createServer();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('paths', [nib.path]);
}

server.use(stylus.middleware({
    src: __dirname
  , dest: __dirname + '/public'
  , force: true
  , compile: compile
}));

server.use(connect.static(__dirname + '/public'));

server.listen(3000);
console.log('Server listening on port 3000');