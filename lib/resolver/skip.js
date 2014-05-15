var fs = require('fs')
  , _ = require('underscore')

module.exports = function (relativeTo, config, name, ref) {
  var module = {name: 'skip'} 

  return { override: override
         , resolve: resolve }

  function override(deps) {
    return _.chain(deps)
            .map(function(d) { return d === ref ? null : d })
            .compact()
            .value()
  }

  function resolve(done) { done(module) }
}
