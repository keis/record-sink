terminus = require 'terminus'

capture = ->
  chunks = []
  stream = terminus (chunk, enc, callback) ->
    chunks.push chunk.toString()
    callback()
  {chunks, stream}


describe "Sink", ->
  Sink = require '../../lib/record-sink'

  it "accepts level as symbolic name", ->
    sink = new Sink null, null, 'ERROR'

    assert.equal sink.level, 40

  describe "setLevel", ->
    it "updates the level of the sink", ->
      sink = new Sink null, null, 'ERROR'
      sink.setLevel 20
      assert.equal sink.level, 20

    it "updates the level of the sink from symbolic name", ->
      sink = new Sink null, null, 30
      sink.setLevel 'DEBUG'
      assert.equal sink.level, 10

  describe "write", ->
    it "transforms record before writing to stream", (done) ->
      {chunks, stream} = capture()

      record =
        date: 'Date'
        time: 'Time'
        levelName:'INFO'
        message: 'The message'

      sink = new Sink stream, null, 'INFO'
      sink.write record
      setImmediate ->
        assert.deepEqual chunks, [
          '[Date Time] - INFO - The message'
        ]
        done()
