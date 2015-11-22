'use strict';
var fs = require('fs');
var tempfile = require('tempfile2');
var existsDefault = require('existential-default');

var streamErrorHandler = function(opts, stream, err) {
  if (err.code !== 'ENOENT') stream.emit('error', err);
  else if (opts.enoent) stream.emit('error', err);
};

module.exports = function createWriteStream(params) {
  var path = tempfile(params);
  if (typeof params !== 'object') params = {};
  params.enoent = existsDefault(params.enoent, true);
  var writeStream = fs.createWriteStream(path);
  writeStream.path = path;

  writeStream.cleanup = function(cb) {
    writeStream.end();
    fs.unlink(path, function(err) {
      if (err) streamErrorHandler(params, writeStream, err);
      if (cb) cb(err);
    });
  };

  writeStream.cleanupSync = function() {
    writeStream.end();
    try {
      fs.unlinkSync(path);
    } catch (err) {
      streamErrorHandler(params, writeStream, err);
    }
  };

  return writeStream;
};
