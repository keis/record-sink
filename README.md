# record-sink

[![NPM Version][npm-image]](https://npmjs.org/package/record-sink)
[![Build Status][travis-image]](https://travis-ci.org/keis/record-sink)
[![Coverage Status][coveralls-image]](https://coveralls.io/r/keis/record-sink?branch=master)

Sink for records where the final processing and serialization happens.

## Installation

```bash
npm install --save record-sink
```

## Usage

This module is building block for creating message logging system and as such
doesn't do much on it's own. By combining it with some stream magic it's
possible to create a quick and dirty log method that writes neatly formatted
log entries to stderr and to a file.

```javascript
var Sink = require('record-sink')
  , Record = require('log-record')
  , through2 = require('through2')
  , fs = require('fs')
  , logger

logger = through2.obj({objectMode: true}, function (data, enc, cb) {
  cb(null, data)
})

logger.pipe(new Sink())
logger.pipe(new Sink(fs.createWriteStream('application.log')))

function log() {
  var args = Array.prototype.slice.call(arguments)
    , msg = args.shift()
    , record = new Record('main', 20, new Date(), msg, args)

  logger.write(record)
}

log("hello %s", "world")
```

[npm-image]: https://img.shields.io/npm/v/record-sink.svg?style=flat
[travis-image]: https://img.shields.io/travis/keis/record-sink.svg?style=flat
[coveralls-image]: https://img.shields.io/coveralls/keis/record-sink.svg?style=flat
