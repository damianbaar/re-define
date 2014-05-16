var fs = require('fs')
  , _ = require('underscore')
  , utils = require('../utils/file')

module.exports = function (relativeTo, config, descriptor) {
  var module = {} 

  module.path = utils.relativePath(relativeTo || config.base, descriptor.name)
  module.name = utils.relativeName(config.base, module.path)
  module.type = descriptor.alias || 'skip'
  module.ref  = descriptor.ref 
  module.resolved = true

  return { override: override
         , resolve: resolve }

  function override(deps) {
    return _.chain(deps)
            .map(function(d) { return d === module.ref ? null : d })
            .compact()
            .value()
  }

  function resolve(done) { done(module) }
}
