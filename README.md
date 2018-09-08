# create-temp-file2
# ARCHIVED: Use [temperment](https://github.com/jamiebuilds/temperment), same functionality, smarter implementation

![Last version](https://img.shields.io/github/tag/Kikobeats/create-temp-file2.svg?style=flat-square)
[![Build Status](http://img.shields.io/travis/Kikobeats/create-temp-file2/master.svg?style=flat-square)](https://travis-ci.org/Kikobeats/create-temp-file2)
[![Coverage Status](https://img.shields.io/coveralls/Kikobeats/create-temp-file2.svg?style=flat-square)](https://coveralls.io/github/Kikobeats/create-temp-file2)
[![Dependency status](http://img.shields.io/david/Kikobeats/create-temp-file2.svg?style=flat-square)](https://david-dm.org/Kikobeats/create-temp-file2)
[![Dev Dependencies Status](http://img.shields.io/david/dev/Kikobeats/create-temp-file2.svg?style=flat-square)](https://david-dm.org/Kikobeats/create-temp-file2#info=devDependencies)
[![NPM Status](http://img.shields.io/npm/dm/create-temp-file2.svg?style=flat-square)](https://www.npmjs.org/package/create-temp-file2)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://paypal.me/kikobeats)

> Creates a temporal file and returns a write stream with path and cleanup methods.

## Install

```bash
npm install create-temp-file2 --save
```

## Usage

```js
var createTempFile = require('create-temp-file2');
var temp = createTempFile({enoent: false}) // Prevent ENOENT error.
```

## API

### createTempFile([options])

The parameters providers are passed first to [tempFile2](https://github.com/Kikobeats/tempfile2).

#### options.enoent

Type: `boolean`
Default: `true`

Emit stream error under `ENOENT` error. This error appear when you call `.cleanup` or `.cleanupSync` more than once.

### .cleanup

Alias to `fs.unlink` handling errors as stream.

### .cleanupSync

Sync version on `.cleanup`. Alias to fs.unlinkSync.

## Related

- [tempfile2](https://github.com/Kikobeats/tempfile2) – Get a random temp file path. much better.

## License

MIT © [Kiko Beats](http://www.kikobeats.com)
