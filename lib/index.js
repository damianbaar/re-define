var _ = require('lodash')
  , combiner = require('stream-combiner')
  , through = require('through2')
  , fs = require('fs')
  , File = require('vinyl')
  , api

module.exports = api = {
  start       : start,
  config      : getConfig,
  template    : require('./wrapper/external-template'),
  split       : require('./util/split-stream'),

  transform: {
    includeFile   : require('./transform/include-file')
  , loadFile      : require('./transform/load-file')
  , setLocation   : require('./transform/set-location')
  , convert       : require('./converter')
  , excludeDeps   : require('./transform/exclude-deps')
  , rewriteDeps   : require('./transform/rewrite-deps')
  , concat        : require('./transform/concat-modules')
  , wrap          : require('./transform/wrap-modules')
  , sort          : require('./transform/sort-modules')
  , split         : require('./transform/split-modules')
  },

  converter: {
    common_js   : require('./converter/type/cjs')
  , amd_cjs     : require('./converter/type/amd-cjs')
  , amd_define  : require('./converter/type/amd-define')
  , amd_require : require('./converter/type/amd-require')
  , raw         : require('./converter/type/raw')
  }
}

function start(config, transform) {
  var converter
    , options = {objectMode: true}
    , stream
    , processing = []
    , pending = []
    , data = []
    , external = []

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
    .pipe(through(options, function(file, enc, next) {
      if (file.isNull())
        file.contents = fs.createReadStream(file.path)
                          .on('error', function(e) { console.log(e) })

      if (file.isBuffer()) next()
      if (file.isStream()) {
        file.pipe(through(function(content) {
          file.contents = content
          this.push(file)
          next()
        }.bind(this)))
      }
    }))
    .pipe(defaultTransform(transform))
    .pipe(through(options, function(file, enc, next) {
      var that = this
        , len = file.deps.length

      if(len === 0) {
        this.push(file)
        next()
      }

      _.each(file.deps, function(d, i) {
        fs.exists(d.path, function(exists) {
          if(!exists) {
            d.path = d.name
            _.pluck(external, 'name').indexOf(d.name) === -1 && external.push(d)
          }
          else stream.write(new File(_.extend(d, { base: file.base })))

          if(len === i + 1) {
            that.push(file)
            next()
          }
        })
      })
    }))
    .pipe(through(options, function(chunk, enc, next) {
      var idx = pending.indexOf(chunk.path)
      if(idx > -1) pending.splice(idx, 1)

      data.push(chunk)

      if(!pending.length) {
        converter.end()
        stream.end()
      }
      next()
    }))

  stream = through(options, function(chunk, enc, next) {
    if(_.isString(chunk)) chunk = new File({path: chunk})

    converter.write(chunk)
    next()
  }, function(end) {
    this.push('----->' + _.pluck(data, 'relative', 'exists').toString())
    end()
  })

  return stream
}

function defaultTransform(config, custom) {
  var t = api.transform

  return prepareStreams(
          config,
          [ t.convert
          , t.excludeDeps
          , t.rewriteDeps
          ].concat(custom || []))
}

function fromContent(config) { 
  var t = api.transform

  return prepareStreams(
          config,
          [ t.split
          , t.convert
          , t.excludeDeps
          , t.rewriteDeps
          , t.concat
          , t.sort
          , t.wrap
          ])
}

function fromPath(config) { 
  var t = api.transform

  return prepareStreams(
          config,
          [ t.includeFile
          , t.loadFile
          , t.setLocation
          , t.convert
          , t.excludeDeps
          , t.rewriteDeps
          , t.concat
          , t.sort
          // , t.wrap
          ])
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

  //ORDER matters
  _.extend(config, { converters: 
    { '\.js$': 
      { 'amd-cjs'     : c.amd_cjs
      , 'amd-define'  : c.amd_define
      , 'amd-require' : c.amd_require
      , 'common-js'   : c.common_js
    }

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
          , 'amd-define'  : readFile(__dirname, 'templates/amd-define.hbs')
          , 'umd/amd-web' : readFile(__dirname, 'templates/amd-web.hbs')
          , 'umd/4all'    : readFile(__dirname, 'templates/return-exports-global.hbs')
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
        var refs = _.chain(config.map)
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

