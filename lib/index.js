var _ = require('underscore')
  , converter = require('./converter')
  , defaults = require('./config')
  , async = require('async')
  , loader = require('./deps/dep-loader')

module.exports = {
   convert: convert
  , bundle: bundle
}

function bundle (config, done) {
  var contents

  config = extendConfig(config)

  async.series(
    [ function(done) { loader.load(config, contents, done) }
    , function(done) { converter.convert(config, contents, done)}
    ], done)
}

function convert (config, contents, done) {
  return converter.convert(extendConfig(config), contents, done)
}

function extendConfig (config) { return _(defaults()).extend(config) }

