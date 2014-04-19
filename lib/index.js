var _ = require('underscore')
  , converter = require('./converter/converter')
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
  , converter(config.converters)
  , { onModule: resolveModule(config, tree)
    , done: done(cb, tree)})
}

function stream (userConfig, input, cb) {
  var config = extendConfig(userConfig)
    , tree = depsTree.tree()

  streamLoader.load(
    input
  , converter(config.converters)
  , { onModule: resolveModule(config, tree)
    , done: done(cb, tree)})
}

function resolveModule(config, tree) {
  return function (module) {
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
    return modules[m] || {name: m, external: true}
  })
}

function extendConfig (config) {
  return _(defaults()).extend(config)
}

