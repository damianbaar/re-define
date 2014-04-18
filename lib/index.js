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

function files (config, cb) {
  config = extendConfig(config)

  var tree = depsTree.tree()

  fileLoader.load(config.main, config.base, {onModule: resolveModule, done: done})

  function resolveModule(module) {
    converter.convert(config.converters, module)
    tree.add(module.name, module.deps)
  }

  function done(modules) {
    cb(setOrder(tree.resolve(), modules))
  }
}

function stream (config, input, cb) {
  config = extendConfig(config)

  var tree = depsTree.tree()

  streamLoader.load(input, {onModule: resolveModule, done: done})

  function resolveModule(module) {
    converter.convert(config.converters, module)
    tree.add(module.name, module.deps)
  }

  function done(modules) {
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

