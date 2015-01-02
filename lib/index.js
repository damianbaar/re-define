var _ = require('lodash')
  , combiner = require('stream-combiner')
  , through = require('through2')
  , Module = require('re-define-module')
  , debug = require('debug')('re-define:index')
  , path = require('path')
  , config = require('./config')

module.exports = {
  bundle      : bundle,
  config      : config,
  template    : require('./wrapper/external-template'),
  fromFile    : function(filePath, userConfig, transforms) {

    var b = bundle(config(userConfig), transforms)

    b.write({ path: filePath })

    return b.pipe(through.obj(function(file, enc, next) {
      this.push(file.contents)
      next()
    }))
  }
}

function bundle(config, transform, globalTransforms) {
var loadFile        = require('./transform/load')
  , getDeps         = require('./transform/get-deps')
  , getAST          = require('./transform/get-ast')
  , resolveDir      = require('./transform/resolve-dir')
  , processAMD      = require('./transform/amd-to-cjs')
  , escapeRAW       = require('./transform/escape-raw')
  , amdPlugin       = require('./transform/amd-plugin')
  , convertAST      = require('./transform/convert-ast')
  , globals         = require('./transform/globals')
  , vars            = require('./transform/reformat-vars')

  //GLOBALS
  , wrap            = require('./transform/wrap-modules')
  , rewrite         = require('./transform/rewrite-require')
  , sort            = require('./transform/sort-modules')
  , cache           = require('./transform/cache')(config)
  , remap           = require('./transform/remap-from-cache')(config)

  var converter
    , options = { objectMode: true }
    , stream
    , files = []
    , paths = []
    , pending = 0
    , cwd = process.cwd()

  stream = through(options, function(file, enc, next) {
    file = Module(file)

    if(!file.path) {
      throw new Error('Missing path for file! ' + file.requiredAs)
      return
    }

    if(file.path.indexOf(cwd) === -1) file.path = path.resolve(file.path)

    if(paths.indexOf(file.path) === -1) {
      if(files.indexOf(file) === -1) files.push(file)

      converter.write(file)
      paths.push(file.path)
    } else {
      var processing = _.find(files, function(p) {
        return _.find(p.paths, function(d) {
          if(d.indexOf(cwd) > -1 && d === file.path) return p
        })
      })

      if(processing) processing.references = file
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
    .pipe(resolveDir(config))
    .pipe(cache.load(stream))
    .pipe(loadFile(config))
    .pipe(globals(config))
    .pipe(defaultTransform(transform, stream))
    .pipe(through(options, function(file, enc, next) {
      pending--
      if(pending === 0) stream.end()
      next()
    }))

  //TODO consider adding global stream support
  return prepareStreams(
          config,
          [ stream
          , rewrite
          , remap
          , convertAST
          , cache.save
          , sort
          , wrap
          ])

  function defaultTransform(transform, writer) {
    var custom = _.map(transform, function(t) { 
      if (typeof t === 'function') return t

      return require(t)
    })

    return prepareStreams(
            config,
            (custom || []).concat(
              [ getAST
              , escapeRAW
              , processAMD
              , amdPlugin
              , vars
              , getDeps
              ])
            , writer 
            )
  }
}

function prepareStreams(config, streams, writer) {
  config = config || require('./config')()

  return _.compose(combine, applyConfig)(streams)

  function combine(streams) { 
    return combiner.apply(null, streams.before.concat(streams.after)) 
  }

  function applyConfig(streams) { 
    var resolved = { before: [], after: [] }

    _.each(streams, function(s) {
      var reorder = s.order && s.order == 'after'

      if (typeof s === 'function') s = s(s.name && config[s.name] || config, writer)
      if (typeof s === 'function') s = s(config, writer)

      if(reorder) return resolved.after.push(s)

      resolved.before.push(s)
    })

    return resolved
  }
}


