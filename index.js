'use strict';
var fs       = require('fs');
var tempfile = require('tempfile2');

module.exports = function createWriteStream(params) {
  var path = tempfile(params);
  var ws = fs.createWriteStream(path);
  var close = function() {
    ws.end();
    fs.close(ws.fd);
  };

  ws.path = path;

  ws.cleanup = function(cb) {
    close();
    fs.unlink(path, function(err) {
      if (err) ws.emit('error', err);
      if (cb) cb(err);
    });
  };

  ws.cleanupSync = function() {
    close();
    try {
      fs.unlinkSync(path);
    } catch (err) {
      ws.emit('error', err);
    }
  };

  return ws;
};
