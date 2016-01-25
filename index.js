'use strict'

var fs = require('fs')
var tempfile = require('tempfile2')
var existsDefault = require('existential-default')

var streamErrorHandler = function (opts, stream, err) {
  if (err.code !== 'ENOENT' || opts.enoent) return stream.emit('error', err)
}

var paramsDefault = { enoent: true }

module.exports = function createWriteStream (params) {
  var path = tempfile(params)

  if (typeof params !== 'object')
    params = paramsDefault
  else
    params = existsDefault(params, 'paramsDefault')

  var writeStream = fs.createWriteStream(path)
  writeStream.path = path

  writeStream.cleanup = function (cb) {
    writeStream.end()
    fs.unlink(path, function (err) {
      if (err) streamErrorHandler(params, writeStream, err)
      if (cb) cb(err)
    })
  }

  writeStream.cleanupSync = function () {
    writeStream.end()
    try {
      fs.unlinkSync(path)
    } catch (err) {
      streamErrorHandler(params, writeStream, err)
    }
  }

  return writeStream
}
