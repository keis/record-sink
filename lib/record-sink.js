var stream = require('readable-stream')
  , sculpt = require('sculpt')
  , inherits = require('util').inherits
  , createFormatter = require('dullstring')
  , defaultFormat
  , defaultWrite

// # Exports
module.exports = Sink

// Default formatter used by sinks when nothing else is specified that tries
// to provide a human friendly format that contains most information without
// being to verbose
defaultFormat = createFormatter('[:date :time] - :levelName - :message')

// # Sink

// Default sink write stream that expects a stream of formatted log messages
// that will be written to STDERR joined with newlines.
defaultWrite = sculpt.append('\n')
defaultWrite.pipe(process.stderr)
defaultWrite.setMaxListeners(0)

// Constructor for a sink object that couples a write stream and a format
// function. A sink may also have a log level associated that is inspected by
// the log methods. If the sink defines a `reset` function it will be called to
// indicated that any associated file streams etc should be reopened.
function Sink(write, format, level) {
  stream.Transform.call(this, {objectMode: true})
  this.format = format || defaultFormat
  this.setLevel(level)
  this.pipe(write || defaultWrite)
}

inherits(Sink, stream.Transform)

Sink.prototype._transform = function (obj, enc, done) {
  if (this.level == null || obj.level >= this.level) {
    this.push(this.format(obj))
  }
  done()
}

Sink.prototype.setLevel = require('standard-levels').setLevel
