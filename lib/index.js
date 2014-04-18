var _ = require('underscore')
  , convert = require('./converter/converter')
  , loader = require('./deps/dep-loader')
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

  loader.load(config.main, config.base, {onModule: resolveModule, done: done})

  function resolveModule(module) {
    convert.file(config.converters, module)
    tree.add(module.name, module.deps)
  }

  function done(modules) {
    cb(setOrder(tree.resolve(), modules))
  }
}

function stream (config, input, cb) {
  var modules = []
  return convert.stream(config.converters, input, {onModule: resolveModule, done: done})

  function resolveModule(module) { convert.file(config.converters, module) }
  function done(modules) { cb(modules) }
}

function setOrder(order, modules) {
  return _.map(order, function(m) {
    return modules[m]
  })
}

function extendConfig (config) {
  return _(defaults()).extend(config)
}

