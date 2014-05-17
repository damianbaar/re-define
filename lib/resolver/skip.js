var fs = require('fs')
  , _ = require('underscore')
  , utils = require('../utils/file')

module.exports = function (relativeTo, config, descriptor) {
  var module = {} 

  module.name = descriptor.ref 
  module.type = descriptor.alias || 'skip'
  module.resolved = true

  return { override: override
         , resolve: resolve }

  function override(deps) {
    return _.chain(deps)
            .map(function(d) { return d === module.name ? null : d })
            .compact()
            .value()
  }

  function resolve(done) { done(module) }
}
