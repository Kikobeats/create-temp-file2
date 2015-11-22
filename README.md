# create-temp-file2

![Last version](https://img.shields.io/github/tag/Kikobeats/create-temp-file2.svg?style=flat-square)
[![Build Status](http://img.shields.io/travis/Kikobeats/create-temp-file2/master.svg?style=flat-square)](https://travis-ci.org/Kikobeats/create-temp-file2)
[![Dependency status](http://img.shields.io/david/Kikobeats/create-temp-file2.svg?style=flat-square)](https://david-dm.org/Kikobeats/create-temp-file2)
[![Dev Dependencies Status](http://img.shields.io/david/dev/Kikobeats/create-temp-file2.svg?style=flat-square)](https://david-dm.org/Kikobeats/create-temp-file2#info=devDependencies)
[![NPM Status](http://img.shields.io/npm/dm/create-temp-file2.svg?style=flat-square)](https://www.npmjs.org/package/create-temp-file2)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://paypal.me/kikobeats)

> Creates a temporary file, returns a write stream, a path, and cleanup functions.

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

### createTempFile({options})

#### options.enoent

Type: `boolean`
Default: `true`

Prevent emit an error under `ENOENT` error. This error appear when you call `.cleanup` or `.cleanupSync` more than once.

The rest of the params provided will be passed to [tempFile2](https://github.com/Kikobeats/tempfile2).

### .cleanup

Alias to `fs.unlink` handling errors as stream.

### .cleanupSync

Sync version on `.cleanup`.

## Related

- [tempfile2](https://github.com/Kikobeats/tempfile2) – Get a random temp file path. much better.

## License

MIT © [Kiko Beats](http://www.kikobeats.com)
