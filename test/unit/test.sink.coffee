sinks = require '../../lib/record-sink'

describe "Sink", ->
  {Sink} = sinks

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
