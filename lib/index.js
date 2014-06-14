var _ = require('lodash')
  , combiner = require('stream-combiner')
  , log = require('./util/logger')
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

  config = config || getConfig()

  return combiner(
          t.split(config)
        , t.setLocation(config)
        , t.convert(config)
        , t.excludeDeps(config)
        , t.rewriteDeps(config)
        , t.concat(config)
        , t.sort(config)
        , t.wrap(config)
        )
}

function fromPath(config) { 
  var t = api.transform

  config = config || getConfig()

  var s = { includeFile : t.includeFile
          , loadFile    : t.loadFile
          , setLocation : t.setLocation
          , convert     : t.convert
          , excludeDeps : t.excludeDeps
          , rewriteDeps : t.rewriteDeps
          , concat      : t.concat
          , sort        : t.sort
          , wrap        : t.wrap
          }

  var streams = _.values(s)
    , names = _.keys(s)

  return config.debug 
          ? _.compose(combine, appendDebug, applyConfig)(streams)
          : _.compose(combine, applyConfig)(streams)

  function combine(streams) { 
    return combiner.apply(null, streams) }

  function applyConfig(streams) {
    return _.map(streams, function(s) { return s(config) })
  }

  function appendDebug(streams) {
    return _.reduce(streams, function(result, stream, index) {
      result.push(stream)
      result.push(log(names[index]))

      return result
    },[])
  }
}

function getConfig(userConfig) {
  var _         = require('lodash')
    , config    = _.clone(require('./defaults'))
    , c = api.converter

  //ORDER matters
  _.extend(config, { converters: 
    { '\.js$': 
      { "amd-define"  : c.amd_define
      , "amd-require" : c.amd_require
      , "common-js"   : c.common_js
      , "amd-cjs"     : c.amd_cjs
    }
    , '\.html$': 
      { "text": c.raw(function(d) { 
        return "'" + d.replace(/\r?\n|\r/g,'') + "'" })
      }
    , '.*':
      { "external": api.converter.raw(function(d) { return d }) } 
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
          , 'empty'       : readFile(__dirname, 'templates/empty.hbs')
          , 'report'      : require('./wrapper/report')
          }})

  _.extend(config, { helpers: 
     { join: function() { return _.toArray(arguments).join(',') }
     , escape: function() { return _.map(arguments, function(d) { return config.escape(d) }) }
     , append: function(pattern) { 
        var args = _.flatten(_.rest(arguments))

        return _.map(args, function(d) { 
          return pattern.replace('|', d) 
        }) 
     }
     , ref: function() { 
         var refs = _.chain(config.externals)
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

