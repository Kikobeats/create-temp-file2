'use strict'

var fs = require('fs')
var tempfile = require('tempfile2')

function streamErrorHandler (opts, stream, err) {
  if (err.code !== 'ENOENT' || opts.enoent) return stream.emit('error', err)
}

var DEFAULTS = {
  enoent: true
}

function createWriteStream (params) {
  var path = tempfile(params)
  var sources = [{}, DEFAULTS]
  if (typeof params === 'object') sources.push(params)
  params = Object.assign.apply(null, sources)

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
      console.log(err)
      streamErrorHandler(params, writeStream, err)
    }
  }

  return writeStream
}

module.exports = createWriteStream
