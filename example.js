'use strict';

var createTempFile = require('./index.js');
var temp = createTempFile({enoent: false});
temp.cleanupSync();
temp.cleanupSync();
