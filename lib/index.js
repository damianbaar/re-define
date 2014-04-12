var _ = require('underscore')
  , converter = require('./converter')
  , defaults = require('./config')

module.exports = function() {

  return { convert: convert
         , bundle: bundle}

  function bundle() { }

  function convert(contents, config) {
    return converter.convert(
            _(defaults.create()).extend(config)
            , contents)
  }
}

