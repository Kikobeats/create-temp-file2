'use strict'

const nodeify = require('nodeify')
const path = require('path')
const test = require('tape')
const fs = require('fs')

const createTempFile = require('../')
require('string.prototype.startswith')
require('string.prototype.endswith')

const noop = function () {}

function ctf (ext) {
  var ws = createTempFile(ext)
  ws.on('error', function (err) {
    throw err
  })
  return ws
}

test('write stream works', function (t) {
  t.plan(2)
  var ws = ctf()
  fs
    .createReadStream(path.join(__dirname, '/do-not-change.txt'))
    .pipe(ws)
    .on('finish', testWS)

  function testWS () {
    fs.readFile(ws.path, {encoding: 'utf8'}, function (err, string) {
      t.notOk(err, err ? err.message : 'no error')
      t.ok(
        string.startsWith('do not delete or change this file'),
        'strings match'
      )
      ws.cleanupSync()
      t.end()
    })
  }
})

test('extension (backward compatibility)', function (t) {
  t.plan(1)
  var ws = ctf('.txt')
  t.equal(path.extname(ws.path), '.txt', 'file extension is ".txt"')
  ws.end('lolz')
  ws.cleanupSync()
  t.end()
})

test('extension', function (t) {
  t.plan(1)
  var ws = ctf({ext: '.txt'})
  t.equal(path.extname(ws.path), '.txt', 'file extension is ".txt"')
  ws.end('lolz')
  ws.cleanupSync()
  t.end()
})

function errorHandlingSync (opts, method, codes) {
  return function errhandle (t) {
    var ws = createTempFile(opts)

    ws.on('error', function (e) {
      t.notEqual(codes.indexOf(e.code), -1, 'Got ' + codes.join('/') + ' error')
      t.end()
    })
    setTimeout(function () {
      try {
        fs.unlinkSync(ws.path)
      } catch (e) {
        t.fail(String(e))
      }
      setTimeout(ws[method], 10)
    }, 10)
  }
}

function errorHandling (opts, method, codes) {
  return function errhandle (t) {
    var ws = createTempFile(opts)

    ws.on('error', function (e) {
      t.notEqual(codes.indexOf(e.code), -1, 'Got ' + codes.join('/') + ' error')
      t.end()
    })
    setTimeout(function () {
      try {
        fs.unlinkSync(ws.path)
      } catch (e) {
        t.fail(String(e))
      }
      setTimeout(ws[method], 10, noop)
    }, 10)
  }
}

test(
  'error handling sync default params',
  errorHandlingSync({}, 'cleanupSync', ['EPERM', 'ENOENT'])
)
test(
  'error handling sync explicit enoent',
  errorHandlingSync({enoent: true}, 'cleanupSync', ['EPERM', 'ENOENT'])
)

test(
  'error handling callback async default params',
  errorHandling({}, 'cleanup', ['EPERM', 'ENOENT'])
)

test(
  'error handling callback async explicit enoent',
  errorHandling({enoent: true}, 'cleanup', ['EPERM', 'ENOENT'])
)

test('cleanupSync() works', function (t) {
  t.plan(3)

  var ws = ctf()
  ws.end('lolz')

  setTimeout(function () {
    // timeout makes this test much more robust
    t.ok(fs.existsSync(ws.path), 'created file')
    t.doesNotThrow(ws.cleanupSync)
    t.notOk(fs.existsSync(ws.path), 'cleanupSync() deleted the file')
    t.end()
  }, 0)
})

test('cleanup() callback works', function (t) {
  t.plan(3)

  var ws = ctf()
  ws.end('lolz')

  setTimeout(function () {
    // timeout makes this test much more robust
    t.ok(fs.existsSync(ws.path), 'created file')
    ws.cleanup(function (err) {
      t.notOk(err, err ? err.message : 'no error during cleanup()')
      t.notOk(fs.existsSync(ws.path), 'cleanup() deleted the file')
      t.end()
    })
  }, 0)
})

test('cleanup() promise works', function (t) {
  t.plan(3)

  var ws = ctf()
  ws.end('lolz')

  setTimeout(function () {
    // timeout makes this test much more robust
    t.ok(fs.existsSync(ws.path), 'created file')
    nodeify(ws.cleanup(), function (err) {
      t.notOk(err, err ? err.message : 'no error during cleanup()')
      t.notOk(fs.existsSync(ws.path), 'cleanup() deleted the file')
      t.end()
    })
  }, 0)
})

function callsEndSync (method) {
  return function (t) {
    t.plan(1)
    var ws = ctf()
    ws.on('finish', function () {
      t.pass('ws.end() was called')
      t.end()
    })
    ws.write('lolz')
    setTimeout(ws[method], 0)
  }
}

function callsEnd (method) {
  return function (t) {
    t.plan(1)
    var ws = ctf()
    ws.on('finish', function () {
      t.pass('ws.end() was called')
      t.end()
    })
    ws.write('lolz')
    setTimeout(ws[method], 0, noop)
  }
}

callsEndSync('what')

test(
  'ws.end is called when cleanup is called and stream is still going',
  callsEnd('cleanup')
)
test(
  'ws.end is called when cleanupSync is called and stream is still going',
  callsEndSync('cleanupSync')
)
