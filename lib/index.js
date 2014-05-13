var _ = require('underscore')

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
  deps_resolver: {
    text: require('./converter/deps/file')
  , skip: require('./converter/deps/skip')
  }
}

module.exports = api

function getRedefine(userConfig) { 
  return require('./redefine')(_.extend(getConfig(), userConfig)) 
}

function getConfig() {
  var config    = require('./config')
    , converter = api.converter
    , resolver  = api.deps_resolver
    , file      = api.wrapper.file

  config.registerASTConverter(converter.amd_define)
        .registerASTConverter(converter.amd_require)

  config.registerDepsResolver('text', resolver.text)
        .registerDepsResolver('skip', resolver.skip)

  config.registerWrapper('iife', file('./templates/iife.template'))
        .registerWrapper('amd-define', file('./templates/amd-define.template'))
        .registerWrapper('umd/amd-web', file('./templates/amd-web.template'))
        .registerWrapper('empty', require('./wrapper/empty'))

  return config
}

