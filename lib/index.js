var _ = require('lodash')
  , combiner = require('stream-combiner')
  , through = require('through2')
  , Module = require('re-define-module')
  , debug = require('debug')('re-define:index')
  , path = require('path')

module.exports = {
  bundle      : bundle,
  config      : require('./config'),
  template    : require('./wrapper/external-template')
}

function bundle(config, transform) {
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
  , sort            = require('./transform/sort-modules')

  var converter
    , options = { objectMode: true }
    , stream
    , files = []
    , paths = []
    , pending = 0

  stream = through(options, function(file, enc, next) {
    if(!file.path) {
      throw new Error('Missing path for file!')
      debug('Missing path for file')
      return
    }

    if(file.path.indexOf(process.cwd()) === -1) file.path = path.resolve(file.path)

    file = Module(file)

    if(paths.indexOf(file.path) === -1) {
      if(files.indexOf(file) === -1) files.push(file)

      converter.write(file)
      paths.push(file.path)
    }
    else {
      var processing = _.find(files, function(p) { return p.path === file.path })

      if(processing) {
        processing.references = file
        _.merge(processing, {name: file.name, cwd: file.cwd, base: file.base, requiredAs: file.requiredAs})
      }
    }

    next()
  }, function(end) {
    this.push(files) 
    end()
  })

  converter = through(options, function(file, enc, next) {
    pending++
    this.push(file)
    next()
  })

  converter
    .pipe(loadFile(config))
    .pipe(defaultTransform(transform, stream))
    .pipe(through(options, function(file, enc, next) {
      pending--
      checkIfEnd()
      next()
    }))

  return combiner(
    [ stream
    , rewrite(config)
    , sort(config)
    , convertAST(config)
    , wrap(config)
    ])

  function checkIfEnd() {
    if(pending === 0) {
      converter.end()
      stream.end()
    }
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
            writer,
            (custom || []).concat(
              [ getAST
              , escapeRAW
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

