var fs = require('fs')
  , _ = require('underscore')

module.exports = function (relativeTo, config, descriptor) {
  var module = {type: 'removed', name: descriptor.ref, resolved: true}

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
