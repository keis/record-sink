var stream = require('readable-stream')
  , assign = require('object-assign')
  , through = require('through2')
  , inherits = require('util').inherits
  , defaultFormat
  , defaultWrite
  , WithNewLine

// # Exports
exports.Sink = Sink
exports.createFormatter = createFormatter
exports.writableStream = writableStream

// # Formatter

// Create a formatter function from pattern string
function createFormatter(pattern) {
  var tokens = pattern.split(/(:[a-zA-Z]+)/)

  return function format(record) {
    return tokens.map(function (token) {
      // if it's not a placeholder return the token right away
      if (token[0] !== ':') {
        return token
      }

      // grab the value from the record, if it is a function call it
      // and then coerce it all to a string
      var val = record[token.substr(1)]

      if (val && val.call) {
        val = val.call(record)
      }

      return val !== void 0 ? '' + val : '-'
    }).join('')
  }
}

// # writableStream

// A helper to create a write a stream from a function
function writableStream(options, write) {
  function Writable (override) {
    if (!(this instanceof Writable)) {
      return new Writable()
    }
    this.options = assign({}, options, override)
    stream.Writable.call(this, this.options)
  }

  inherits(Writable, stream.Writable)

  Writable.prototype._write = write

  return Writable
}

// Default formatter used by sinks when nothing else is specified that tries
// to provide a human friendly format that contains most information without
// being to verbose
defaultFormat = createFormatter('[:date :time] - :levelName - :message')

// # Sink

// Default sink write stream that expects a stream of formatted log messages
// that will be written to STDERR joined with newlines.
WithNewLine = through.ctor({objectMode: true}, function (obj, enc, done) {
  this.push(obj + '\n')
  done()
})

defaultWrite = new WithNewLine()
defaultWrite.pipe(process.stderr)

// Constructor for a sink object that couple a write function and a format
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
  this.push(this.format(obj))
  done()
}

Sink.prototype.setLevel = require('standard-levels').setLevel
