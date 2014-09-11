var _ = require('lodash') 
  , debug = require('debug')('re-define:transform:external-template')

module.exports = function(template) {
  return function(modules, config) {

    var descriptor = 
        { config: config
        , files: _.filter(modules.internal, function(f) { return !f.isNull() })
        , external: modules.external }

    return _.template(template
                     , _.extend(descriptor, config.helpers),
                     { imports: { _: _, util: config.helpers } })
  }
}

