var _ = require('lodash')
  , combiner = require('stream-combiner')
  , through = require('through2')
  , fs = require('fs')
  , File = require('vinyl')
  , api

var findFile = require('./core/find-file')
  , loadFile = require('./core/load-file')
  , convert = require('./converter')
  , getDeps = require('./transform/get-deps')
  , rewriteDeps = require('./transform/rewrite-deps')
  , wrap = require('./transform/wrap-modules')
  , sort = require('./transform/sort-modules')

module.exports = api = {
  start       : start,
  config      : getConfig,
  template    : require('./wrapper/external-template'),

  converter: {
    cjs : require('./converter/type/cjs')
  , amd : require('./converter/type/amd')
  , raw : require('./converter/type/raw')
  }
}

function start(config, transform) {
  var converter
    , options = {objectMode: true}
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
    .pipe(defaultTransform(transform))
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

  function defaultTransform(config, custom) {
    return prepareStreams(
            config,
            [ convert
            , getDeps
            , rewriteDeps
            ].concat(custom || []))
  }
}

function prepareStreams(config, streams) {
  config = config || getConfig()

  return _.compose(combine, applyConfig)(streams)

  function combine(streams) { return combiner.apply(null, streams) }
  function applyConfig(streams) { return _.map(streams, function(s) { return s(config) }) }
}

function getConfig(userConfig) {
  var _         = require('lodash')
    , config    = _.clone(require('./defaults'))
    , c = api.converter

  _.extend(config, { converters: 
    { '\.js$': 
      { 'amd': c.amd , 'cjs': c.cjs }
    , '\.html$': 
      { 'text': c.raw(function(d) { return '\'' + d.replace(/\r?\n|\r/g,'') + '\'' }) }
    , '.*':
      { 'raw': api.converter.raw(function(d) { return d }) } 
  }})

  var readFile = _.compose(
                    api.template
                  , _.partialRight(require('fs').readFileSync, 'utf-8')
                  , require('path').resolve)

  _.extend(config, { wrappers: 
          { 'iife'        : readFile(__dirname, 'templates/iife.hbs')
          , 'umd'         : readFile(__dirname, 'templates/umd.hbs')
          , 'empty'       : readFile(__dirname, 'templates/empty.hbs')
          , 'report'      : require('./wrapper/report')
          }})

  _.extend(config, { helpers: 
    { reduce: function() { return _.toArray(arguments).join(',') }
    , escape: function() { return _.map(arguments, function(d) { return config.escape(d) }) }
    , map: function(pattern) { 
        var args = _.flatten(_.rest(arguments))

        return _.map(args, function(d) { 
          return pattern.replace('|', d) 
        }) 
    }
    , toString: function(val) { return val.toString() }
    , global: function() { 
        var refs = _.chain(config.glob)
        .map(function(d) { 
          var fileAlias = d.split('#')
          return {name: fileAlias[0], ref: fileAlias[1]}
        })
        .reduce(function(memo, d) {
          memo[d.name] = d.ref
          return memo
        }, {})
        .value()

        return _.map(arguments, function(e) { 
          return (refs && refs[e]) || e 
        })
    }
    }})

  return _.extend(config, userConfig, function(a,b) {
    if(_.isArray(a) && _.isArray(b)) return b.concat(a)
    if(_.isObject(a) && _.isObject(b)) return _.extend(a, b)

    return b ? b : a
  })
}

