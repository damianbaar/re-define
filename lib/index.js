var _ = require('underscore')
  , convert = require('./converter/converter')
  , loader = require('./deps/dep-loader')
  , defaults = require('./config')

module.exports = {
  convert: {
    files: files
  , stream: stream
  }
}

function files (config, cb) {
  config = extendConfig(config)

  loader.load(config.main, config.base, {file: resolveModule, done: done})

  function resolveModule(module) { convert.file(config.converters, module) }
  function done(modules) { cb(modules) }
}

function stream (config, modules, done) {
  return convert.stream(extendConfig(config), modules, done)
}

function extendConfig (config) { return _(defaults()).extend(config) }

