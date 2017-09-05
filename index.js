'use strict'

const ensureFile = require('ensure-file')
const tempfile = require('tempfile2')
const fs = require('fs')

function streamErrorHandler (opts, stream, err) {
  if (err.code !== 'ENOENT' || opts.enoent) return stream.emit('error', err)
}

const DEFAULTS = {
  enoent: true
}

module.exports = opts => {
  const path = tempfile(opts)
  ensureFile.sync(path)

  opts = Object.assign({}, DEFAULTS, opts)
  const writeStream = fs.createWriteStream(path)

  writeStream.path = path

  writeStream.cleanup = cb => {
    writeStream.end()
    fs.unlink(path, err => {
      if (err) streamErrorHandler(opts, writeStream, err)
      if (cb) cb(err)
    })
  }

  writeStream.cleanupSync = () => {
    writeStream.end()
    try {
      fs.unlinkSync(path)
    } catch (err) {
      streamErrorHandler(opts, writeStream, err)
    }
  }

  return writeStream
}
