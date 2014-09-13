var _ = require('lodash')
  , combiner = require('stream-combiner')
  , through = require('through2')
  , Module = require('re-define-module')
  , debug = require('debug')('re-define:index')
  , path = require('path')

var loadFile        = require('./file/load')
  , getDeps         = require('./transform/get-deps')
  , getAST          = require('./transform/get-ast')
  , processAMD      = require('./transform/amd-to-cjs')
  , escapeRAW       = require('./transform/escape-raw')
  , amdPlugin       = require('./transform/amd-plugin')
  , convertAST      = require('./transform/convert-ast')
  //GLOBALS
  , wrap            = require('./transform/wrap-modules')
  , rewrite         = require('./transform/rewrite-require')
  , slice           = require('./transform/slice-bundles')
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
    , files = []

  stream = through(options, function(file, enc, next) {
    file.pending = true
    converter.write(Module(file))
    next()
  }, function(end) {
    this.push(files) 
    end()
  })

  converter = through(options, function(file, enc, next) {
    if(file.path.indexOf(process.cwd()) === -1)
      file.path = path.resolve(file.path)

    var alredyInQueue = _.find(files, function(p) { return p.path === file.path })

    if(alredyInQueue && alredyInQueue.exists) {
      alredyInQueue.references = file

      next()
      return
    }

    if(files.indexOf(file) === -1) files.push(file) 

    this.push(file)
    next()

    file.exists = true
  })

  converter
    .pipe(loadFile(config)
    .on('exists', function(exists, m) { 
      m.exists = exists

      if(!exists) {
        m.revert && m.revert()
        m.stopProcessing = true
        m.external = true
      } 
    }))
    .pipe(defaultTransform(transform, stream))
    .pipe(through(options, function(file, enc, next) {
      file.pending = false
      next()
      checkIfEnd()
    }))

  return combiner(
    [ stream
    , sort(config)
    , rewrite(config)
    , convertAST(config)
    , slice(config)
    , wrap(config)
    ])

  function checkIfEnd() {
    var a = _.map(files, function(a) {
      if(a.exists && !a.pending && !a.isNull()) return false
      if(!a.exists && a.isNull()) return false

      return true 
    })

    if(_.any(a)) return

    converter.end()
    stream.end()
  }

  function defaultTransform(transform, writer) {
    var custom = _.map(transform, function(t) { 
      //TODO check EventEmitter
      if (typeof t === 'function') return t
      if (typeof t === 'object') return _.partial(t)

      return require(t)
    })

    return prepareStreams(
            config,
            writer
            , [ getAST ]
              .concat(custom || [])
              .concat(
                [ escapeRAW
                , processAMD
                , amdPlugin
                , getDeps
                ])
            )
  }
}

function prepareStreams(config, writer, streams) {
  config = config || require('./config')()

  return _.compose(combine, applyConfig)(streams)

  function combine(streams) { return combiner.apply(null, streams) }
  function applyConfig(streams) { return _.map(streams, function(s) { return s(config, writer) }) }
}

