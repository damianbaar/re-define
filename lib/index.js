var api = {
  convert: getRedefine,
  config: getConfig,
  wrapper: {
    fromString: require('./wrapper/external-template')
  },
  converter: {
    common_js: require('./converter/cjs')
  , amd_cjs: require('./converter/amd-cjs')
  , amd_define: require('./converter/amd-define')
  , amd_require: require('./converter/amd-require')
  , raw: require('./converter/raw.js')
  }
}

module.exports = api

function getRedefine(userConfig) { 
  return require('./redefine')
                (userConfig || getConfig())
}

function getConfig(userConfig) {
  var _         = require('lodash')
    , config    = _.clone(require('./defaults'))

  _.extend(config, { converters: 
    { '.js': 
      { "common-js": api.converter.common_js
      , "amd-cjs": api.converter.amd_cjs
      , "amd-define": api.converter.amd_define
      , "amd-require": api.converter.amd_require
    }
    , '.html': 
      { "text": api.converter.raw(function(d) { 
        return "'" + d.replace(/\r?\n|\r/g,'') + "'" })
    }
    , '*.*':
      { "external": api.converter.raw(function(d) { return d }) } 
  }})

  var readFile = _.compose(
                    api.wrapper.fromString
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

