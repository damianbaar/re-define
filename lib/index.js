var api = {
  convert: getRedefine,
  config: getConfig,
  wrapper: {
    file: require('./wrapper/external-template')
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
    , file      = api.wrapper.file

  _.extend(config, {converters: api.converter})

  _.extend(config, {resolvers: api.resolver})

  _.extend(config, {wrappers: 
          { 'iife'        : file('./templates/iife.template')
          , 'amd-define'  : file('./templates/amd-define.template')
          , 'umd/amd-web' : file('./templates/amd-web.template')
          , 'empty'       : require('./wrapper/empty')
          }})

  _.extend(config, { helpers: 
     { escape: function() { return _.map(arguments, function(i) { return '\'' + i + '\'' }) }
     , join: function() { return _.toArray(arguments).join(',') } }})

  return _.merge(config, userConfig)
}

