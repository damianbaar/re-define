var _ = require('lodash')
  , combiner = require('stream-combiner')
  , through = require('through2')
  , File = require('vinyl')

var findFile   = require('./core/find-file')
  , loadFile   = require('./core/load-file')
  , stop       = require('./transform/stop-processing')
  , getDeps    = require('./transform/get-deps')
  , getExports = require('./transform/get-exports')
  , getAST     = require('./transform/get-ast')
  , convertAMD = require('./transform/amd-to-cjs')
  , escapeHTML = require('./transform/escape-html')
  , alignNames = require('./transform/align-names')
  , wrap       = require('./transform/wrap-modules')
  , sort       = require('./transform/sort-modules')

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

  var ff = findFile(config)
    , lf = loadFile(config)

  ff.on('external', function(d) { 
    external.push(d.path) 
    resolved(d.path)
    checkIfEnd()
  })

  converter
    .pipe(ff)
    .pipe(lf)
    .pipe(defaultTransform())
    .pipe(through(options, function(file, enc, next) {
      _.each(file.deps, function(dep, i) {
        stream.write(
          _.merge(
            new File(
              { base: file.base, path: dep.path })
            , { parent: file.parent }
            , dep ))
      })

      this.push(file)
      next()
    }))
    .pipe(through(options, function(file, enc, next) {
      data.push(file)

      resolved(file.path)
      file.orgPath && resolved(file.orgPath)

      checkIfEnd()
      next()
    }))

  stream = through(options, function(file, enc, next) {
    converter.write(file)
    next()
  }, function(end) {
    this.push({internal: data, external: external}) 
    end()
  })

  return combiner(
    [ stream
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

  function defaultTransform() {
    custom = _.map(config.transform, function(r) { return require(r) })

    return prepareStreams(
            config,
            [ getAST
            , stop
            , convertAMD
            , escapeHTML
            , getDeps
            , alignNames
            , getExports
            ].concat(custom || []))
  }
}

function prepareStreams(config, streams) {
  config = config || require('./config')()

  return _.compose(combine, applyConfig)(streams)

  function combine(streams) { return combiner.apply(null, streams) }
  function applyConfig(streams) { return _.map(streams, function(s) { return s(config) }) }
}

