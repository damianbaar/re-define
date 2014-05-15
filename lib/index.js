var api = {
  convert: getRedefine,
  config: getConfig,
  wrapper: {
    file: require('./wrapper/external-template')
  },
  converter: {
    amd_define:  {
      resolver: require('./converter/amd-define-resolver')
    , transformer: require('./converter/amd-define-transformer')
    }
    , amd_require: {
      resolver: require('./converter/amd-require-resolver')
    , transformer: require('./converter/amd-require-transformer')
    }
  },
  resolver: {
    text: require('./converter/deps/file')
  , css: require('./converter/deps/css')
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

  return _.merge(config, userConfig)
}

