var _ = require('lodash')
  , combiner = require('stream-combiner')
  , through = require('through2')
  , Module = require('./module')

var findExternal    = require('./transform/find-external')
  , loadFile        = require('./file/load')
  , processIIFE     = require('./transform/process-iife')
  , getDeps         = require('./transform/get-deps')
  , overrideExports = require('./transform/override-exports')
  , getAST          = require('./transform/get-ast')
  , processAMD      = require('./transform/amd-to-cjs')
  , escapeRAW       = require('./transform/escape-raw')
  , amdPlugin       = require('./transform/amd-plugin')
  , convertAST      = require('./transform/convert-ast')
  , wrap            = require('./transform/wrap-modules')
  , sort            = require('./transform/sort-modules')

module.exports = {
  start       : start,
  config      : require('./config'),
  template    : require('./wrapper/external-template')
}

function start(config, transform) {
  var converter
    , options = { objectMode: true }
    , stream
    , processing = []
    , external = []
    , pending = []
    , data = []

  stream = through(options, function(file, enc, next) {
    converter.write(Module(file))
    next()
  }, function(end) {
    this.push(data) 
    end()
  })

  converter = through(options, function(file, enc, next) {
      if(processing.indexOf(file.path) > -1) {
        next()
        return
      }

      processing.push(file.path)
      pending.push(file.path)

      this.push(file)
      next()
    })

  converter
    .pipe(loadFile(config))
    .pipe(defaultTransform(stream))
    .pipe(through(options, function(file, enc, next) {
      data.push(file)
      _.each(file.paths, resolved)
      checkIfEnd()
      next()
    }))

  return combiner(
    [ stream
    , convertAST(config)
    , sort(config)
    , wrap(config)])

  function resolved(path) {
    var idx = pending.indexOf(path)
    if(idx > -1) pending.splice(idx, 1)
  }

  function checkIfEnd() {
    if(pending.length) return

    converter.end()
    stream.end()
  }

function defaultTransform(writer) {
  var custom = _.map(config.transform, function(r) { return require(r) })

  return prepareStreams(
          config,
          writer,
          (custom || []).concat(
          [ findExternal
          , amdPlugin
          , getAST
          , processIIFE 
          , processAMD
          , escapeRAW
          , getDeps
          , overrideExports
          ]))
  }
}

function prepareStreams(config, writer, streams) {
  config = config || require('./config')()

  return _.compose(combine, applyConfig)(streams)

  function combine(streams) { return combiner.apply(null, streams) }
  function applyConfig(streams) { return _.map(streams, function(s) { return s(config, writer) }) }
}

