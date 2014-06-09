var combiner = require('stream-combiner')
  , api

module.exports = api = {
  fromContent : fromContent,
  fromPath    : fromPath,
  config      : getConfig,
  template    : require('./wrapper/external-template'),

  transform: {
    includeFile   : require('./transform/include-file')
  , loadFile      : require('./transform/load-file')
  , setLocation   : require('./transform/set-location')
  , convert       : require('./converter')
  , excludeDeps   : require('./transform/exclude-deps')
  , rewriteDeps   : require('./transform/rewrite-deps')
  , concat        : require('./transform/concat-modules')
  , wrap          : require('./transform/wrap-modules')
  , splitModules  : require('./transform/split-modules')
  , splitPaths    : require('./transform/split-paths')
  },

  converter: {
    common_js   : require('./converter/type/cjs')
  , amd_cjs     : require('./converter/type/amd-cjs')
  , amd_define  : require('./converter/type/amd-define')
  , amd_require : require('./converter/type/amd-require')
  , raw         : require('./converter/type/raw')
  }
}


function fromContent(config, done) { 
  var t = api.transform

  config = config || getConfig()

  return combiner(
          t.splitModules(config)
        , t.includeFile(config)
        , t.setLocation(config)
        , t.convert(config.converters)
        , t.excludeDeps(config)
        , t.rewriteDeps(config)
        , t.concat(config)
        , t.wrap(config)
        )
}

function fromPath(config, done) { 
  var t = api.transform

  config = config || getConfig()

  return combiner(
          t.splitPaths(config)
        , t.includeFile(config)
        , t.loadFile(config)
        , t.setLocation(config)
        , t.convert(config.converters)
        , t.excludeDeps(config)
        , t.rewriteDeps(config)
        , t.concat(config)
        , t.wrap(config)
        )
}

function getConfig(userConfig) {
  var _         = require('lodash')
    , config    = _.clone(require('./defaults'))
    , c = api.converter

  _.extend(config, { converters: 
    { '\.js$': 
      { "common-js": c.common_js
      , "amd-cjs": c.amd_cjs
      , "amd-define": c.amd_define
      , "amd-require": c.amd_require
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

  _.extend(config, {wrappers: 
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
         var refs = _.chain(config.external)
         .map(function(d) { 
           var fileAlias = d.split('#')
           return {name: config.escape(fileAlias[0]), ref: fileAlias[1]}
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

