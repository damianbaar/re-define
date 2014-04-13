var _ = require('underscore')
  , async = require('async')
  , converter = require('./converter/converter')
  , loader = require('./deps/dep-loader')
  , defaults = require('./config')

module.exports = {
   convert: convert
  , bundle: bundle
}

function bundle (config, done) {
  var contents

  config = extendConfig(config)

  //TODO different file resolver
  var resolver = require('./deps/dep-amd-resolver')

  async.series(
    [ function(done) { loader.load(config, contents, resolver, done) }
    , function(done) { converter.convert(config, contents, done)}
    ], done)
}

function convert (config, contents, done) {
  return converter.convert(extendConfig(config), contents, done)
}

function extendConfig (config) { return _(defaults()).extend(config) }

