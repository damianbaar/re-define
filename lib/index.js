var _ = require('underscore')
  , convert = require('./converter/converter')
  , fileLoader = require('./deps/dep-file-loader')
  , streamLoader = require('./deps/dep-stream-loader')
  , depsTree = require('./deps/dep-order')
  , defaults = require('./config')

module.exports = {
  convert: {
    files: files
  , stream: stream
  }
}

function files (userConfig, cb) {
  var config = extendConfig(userConfig)
    , tree = depsTree.tree()

  fileLoader.load(
    config.main
  , config.base
  , { onModule: resolveModule(config, tree)
    , done: done(cb, tree)})
}

function stream (userConfig, input, cb) {
  var config = extendConfig(userConfig)
    , tree = depsTree.tree()

  streamLoader.load(
    input
  , { onModule: resolveModule(config, tree)
    , done: done(cb, tree)})
}

function resolveModule(config, tree) {
  return function (module) {
    convert(config.converters, module)
    tree.add(module.name, module.deps)
  }
}

function done(cb, tree) {
  return function(modules) {
    cb(setOrder(tree.resolve(), modules))
  }
}


function setOrder(order, modules) {
  return _.map(order, function(m) {
    return modules[m] || 'external'
  })
}

function extendConfig (config) {
  return _(defaults()).extend(config)
}

