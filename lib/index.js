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

    b.write({
        path: filePath
      , cwd: (userConfig.cwd && path.resolve(userConfig.cwd)) || process.cwd()
      , base: path.dirname(filePath)
      })

    return b.pipe(through.obj(function(file, enc, next) {
      this.push(file.contents)
      next()
    }))
  }
}

function bundle(config, transform) {
var loadFile        = require('./transform/load')
  , getDeps         = require('./transform/get-deps')
  , getAST          = require('./transform/get-ast')
  , resolveDir      = require('./transform/resolve-dir')
  , getCache        = require('./transform/get-from-cache')
  , processAMD      = require('./transform/amd-to-cjs')
  , escapeRAW       = require('./transform/escape-raw')
  , amdPlugin       = require('./transform/amd-plugin')
  , convertAST      = require('./transform/convert-ast')
  //GLOBALS
  , wrap            = require('./transform/wrap-modules')
  , rewrite         = require('./transform/rewrite-require')
  , sort            = require('./transform/sort-modules')
  , cache           = require('./transform/cache')

  var converter
    , options = { objectMode: true }
    , stream
    , files = []
    , paths = []
    , pending = 0
    , cwd = process.cwd()

  stream = through(options, function(file, enc, next) {
    if(!(file instanceof Module)) file = Module(file)

    if(!file.path) {
      throw new Error('Missing path for file! ' + file.requiredAs)
      return
    }

    if(file.path.indexOf(cwd) === -1) file.path = path.resolve(file.path)

    file = Module(file)

    if(paths.indexOf(file.path) === -1) {
      if(files.indexOf(file) === -1) files.push(file)

      converter.write(file)
      paths.push(file.path)
    }
    else {
      //take only those which path points to right location and compare against it
      //files with altered path to index: n-1 path most likely === file.path as n could be index or main
      var processing = _.find(files, function(p) {
        return _.find(p.paths, function(d) {
          if(d.indexOf(process.cwd()) > -1 && d === file.path) return p
        })
      })

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
    .pipe(resolveDir(config))
    .pipe(getCache(config, stream))
    .pipe(loadFile(config).on('alreadyLoaded', function(f) {
      var ref = _.find(files, function(d) { if(d != f && d.path === f.path) return d })

      if(ref) ref.references = f

      _.remove(files, f)
    }))
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
    , cache(config)
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
      if (typeof t === 'function') return t

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

  function combine(streams) { 
    return combiner.apply(null, streams.before.concat(streams.after)) 
  }

  function applyConfig(streams) { 
    var resolved = { before: [], after: [] }

    _.each(streams, function(s) {
      var s = s(config, writer)
        , reorder

      reorder = s.order && s.order == 'after'

      //WORKAROUND: external transforms have own config, so to bypass it 
      //we trying to reach stream, mode could be checked via globalConfig === config
      //inside the stream
      if (typeof s === 'function') s = s(config, writer)

      if(reorder) return resolved.after.push(s)

      resolved.before.push(s)
    })

    return resolved
  }
}

