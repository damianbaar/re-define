var async = require('async')
  , _ = require('underscore')

  module.exports = function(config, base) {
    var resolved = {}

    return function(module, modules, done) {
      var deps = config.dependencies
        , toResolve = _.chain(module.deps)
                       .map(match)
                       .compact()
                       .map(resolve)
                       .each(override)
                       .filter(skip)
                       .value()

      function match(p) {
        var m
          
        _.each(deps.resolve, function(resolver, pattern) { 
          if(new RegExp(pattern).test(p)) {
            m = {p: pattern, r: resolver} 

            if(resolver.indexOf(':') > -1) {
              var withAlias = resolver.split(':')
              m.r = withAlias[0]
              m.a = withAlias[1]
            }
          }
        })

        return m && { resolver: config.resolvers[m.r]
                    , ref: p
                    , alias: m.a
                    , name: p.replace(new RegExp(m.p), '') }
      }

      function resolve(m) { return m.resolver(module.path, config, m) }

      function override(m) { m.override(module) }

      function skip(m) { return !_.has(m, m.name) }

      async.each(toResolve, function(resolver, callback) {
        resolver.resolve(function(m) {
          resolved[m.name] = m
          callback()
        })
      }
      , function (err) { done(resolved) })
    }
  }
