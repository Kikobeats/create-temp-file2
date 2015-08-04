'use strict';
var fs       = require('fs');
var tempfile = require('tempfile2');

module.exports = function createWriteStream(params) {
  var path = tempfile(params);
  var writeStream = fs.createWriteStream(path);

  writeStream.path = path;

  writeStream.cleanup = function(cb) {
    writeStream.end();
    fs.unlink(path, function(err) {
      if (err) writeStream.emit('error', err);
      if (cb) cb(err);
    });
  };

  writeStream.cleanupSync = function() {
    writeStream.end();
    try {
      fs.unlinkSync(path);
    } catch (err) {
      writeStream.emit('error', err);
    }
  };

  return writeStream;
};
