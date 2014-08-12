var _ = require('lodash')
  , combiner = require('stream-combiner')
  , through = require('through2')
  , Module = require('./Module')
  , debug = require('debug')('re-define:index')

var loadFile        = require('./file/load')
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
  bundle      : bundle,
  config      : require('./config'),
  template    : require('./wrapper/external-template')
}

function bundle(config, transform) {
  var converter
    , options = { objectMode: true }
    , stream
    , processing = []
    , pending = []
    , data = []
    , toUpdate = []

  stream = through(options, function(file, enc, next) {
    converter.write(Module(file))
    next()
  }, function(end) {
    this.push(data) 
    end()
  })

  converter = through(options, function(file, enc, next) {
    if(processing.indexOf(file.path) > -1) {
      var alreadyLoaded = _.find(processing, function(d) { return file.paths.indexOf(d) > -1 })

      if(alreadyLoaded) {
        toUpdate.push(file)

        debug('File already loaded:', file)

        _.each(file.paths, function(d) { if(d !== alreadyLoaded) resolved(d) })
        checkIfEnd()
      }

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
    .pipe(defaultTransform(transform, stream))
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

    updateModuleNames()
    converter.end()
    stream.end()
  }

  function updateModuleNames() {
    _.each(toUpdate, function(d) {
      var l = _.find(data, function(f) { return f.paths.indexOf(d.path) > -1 })

      debug('Updating ref', d.name, l.name)
      d.update(l.name)
    })
  }

  function defaultTransform(transform, writer) {
    var custom = _.map(transform, function(t) { 
      if (typeof t === 'function') return t
      if (typeof t === 'object') return _.partial(t)

      return require(t)
    })

    return prepareStreams(
            config,
            writer,
            (custom || []).concat(
            [ escapeRAW
            , getAST
            , processIIFE 
            , processAMD
            , amdPlugin
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

