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
          { 'iife'        : readFile(__dirname, 'templates/iife.template')
          , 'amd-define'  : readFile(__dirname, 'templates/amd-define.template')
          , 'umd/amd-web' : readFile(__dirname, 'templates/amd-web.template')
          , 'empty'       : readFile(__dirname, 'templates/empty.template')
          }})

  _.extend(config, { helpers: 
     { quotes: function() { return _.map(arguments, function(i) { return '\'' + i + '\'' }) }
     , join: function() { return _.toArray(arguments).join(',') }
     , escape: function() { return _.chain(arguments).map(function(d) { return config.escape(d) }) }
     }})

  return _.merge(config, userConfig)
}

