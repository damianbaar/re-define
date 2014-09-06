var _ = require('lodash')
  , combiner = require('stream-combiner')
  , through = require('through2')
  , Module = require('re-define-module')
  , debug = require('debug')('re-define:index')
  , path = require('path')

var loadFile        = require('./file/load')
  , processIIFE     = require('./transform/process-iife')
  , getDeps         = require('./transform/get-deps')
  , overrideModule  = require('./transform/override-module-exports')
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
    if(file.path.indexOf(process.cwd()) === -1)
      file.path = path.resolve(file.path)

    if(processing.indexOf(file.path) > -1) {
      var alreadyLoaded = _.find(processing, function(d) { return file.paths.indexOf(d) > -1 })

      if(alreadyLoaded) {
        //TODO add dependendants field - gather all modules which depend on this module
        //also get all update functions related to modules and remove UpdateNames function 
        toUpdate.push(file)
        debug('File already loaded:', file)
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
    .pipe(loadFile(config).on('not-exists', function(d) { _.each(d.paths, resolve) }))
    .pipe(defaultTransform(transform, stream))
    .pipe(through(options, function(file, enc, next) {
      data.push(file)
      _.each(file.paths, resolve)
      checkIfEnd()
      next()
    }))

  return combiner(
    [ stream
    , convertAST(config)
    , combiner([sort(config), wrap(config)]) //TODO there needs to be strategy for it 
    ])

  function resolve(path) {
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

      if(l && !d.isNull()) {
        debug('Updating ref', d.name, l.name)
        d.update(l.name)
      } else {
        debug('Something is wrong ... for', JSON.stringify(d, null, 2))
      }
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
            , overrideModule
            ]))
  }
}

function prepareStreams(config, writer, streams) {
  config = config || require('./config')()

  return _.compose(combine, applyConfig)(streams)

  function combine(streams) { return combiner.apply(null, streams) }
  function applyConfig(streams) { return _.map(streams, function(s) { return s(config, writer) }) }
}

