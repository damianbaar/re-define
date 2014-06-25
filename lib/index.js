var _ = require('lodash')
  , combiner = require('stream-combiner')
  , api

module.exports = api = {
  fromPath    : fromPath,
  fromContent : fromContent,
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

