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

  function override(owner) {
    var deps = owner.deps
      , params = owner.params
      , param

    deps = _.chain(deps)
            .map(function(d, i) { 
              if(d === module.name) {
                param = owner.params[i]
                return
              }
              return d 
            })
            .compact()
            .value()

    owner.deps = deps
    
    if(!param) return

    params = _.chain(params)
              .map(function(d) { return d === param ? null : d })
              .compact()
              .value()

    owner.params = params
  }

  function resolve(done) { done(module) }
}
