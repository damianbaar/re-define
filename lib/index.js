var api = {
  convert: getRedefine,
  config: getConfig,
  wrapper: {
    fromString: require('./wrapper/external-template')
  },
  converter: {
    common_js: require('./converter/cjs')
  , amd_define: require('./converter/amd-define')
  , amd_require: require('./converter/amd-require')
  },
  resolver: {
    text: require('./resolver/file')
  , css: require('./resolver/css')
  , skip: require('./resolver/skip')
  },
  utils: {
    ast: require('./ast/ast-adapter')
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

  _.extend(config, {converters: api.converter})

  _.extend(config, {resolvers: api.resolver})

  var readFile = _.compose(
                    api.wrapper.fromString
                  ,  _.partialRight(require('fs').readFileSync, 'utf-8')
                  , require('path').resolve)

  _.extend(config, {wrappers: 
          { 'iife'        : readFile(__dirname, 'templates/iife.hbs')
          , 'amd-define'  : readFile(__dirname, 'templates/amd-define.hbs')
          , 'umd/amd-web' : readFile(__dirname, 'templates/amd-web.hbs')
          , 'umd/all'     : readFile(__dirname, 'templates/return-exports-global.hbs')
          , 'empty'       : readFile(__dirname, 'templates/empty.hbs')
          }})

  _.extend(config, { helpers: 
     { quotes: function() { return _.map(arguments, function(i) { return '\'' + i + '\'' }) }
     , join: function() { return _.toArray(arguments).join(',') }
     , escape: function() { return _.map(arguments, function(d) { return config.escape(d) }) }
     , remap: function() { 
         var refs = config.dependencies.references
         return _.map(arguments, function(e) { return (refs && refs[e]) || e })
     }
     }})

  return _.merge(config, userConfig)
}

