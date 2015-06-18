var Sink = require('./lib/record-sink')
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
