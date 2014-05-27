var fs = require('fs')
  , _ = require('underscore')
  , utils = require('../utils/file')
  , template = require('handlebars').compile

module.exports = function (relativeTo, config, descriptor) {
  var module = {}

  // module.path  = utils.relativePath(descriptor.deps, descriptor.name)
  // module.base  = 'text/' + utils.relativeName(config.base, module.path)
  module.ref   = descriptor.ref
  module.name  = descriptor.ref
  module.type  = 'tree' 
  module.variable = true

  return { override: function() {} 
         , resolve: resolve }

  function override(owner) {
    owner.deps = _.map(owner.deps, function(d) { return d === module.ref ? module.path : d })
  }

  function resolve(done) { done() }
}
