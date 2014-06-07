var _ = require('underscore')
  , match = require('minimatch')

  module.exports = function(config) {
    return function(module, done) {
      var deps = config.dependencies
        , toResolve = _.chain(module.deps)
                       .map(alias)
                       .compact()
                       .map(resolve)
                       .each(override)
                       .value()

      console.log('resolver', deps)
      function alias(p) {
        var m
          
        _.each(deps.alias, function(resolver, pattern) { 
          console.log(match(p, pattern))
          console.log(resolver, pattern)
        })

        return m && { resolver: config.resolvers[m.r]
                    , ref: p
                    , args: m.a
                    , name: p.replace(new RegExp(m.p), '') }
      }

      function resolve(m) { return m.resolver && m.resolver(module.base, config, m) }

      function override(m) { m && m.override && m.override(module) }

        // resolver.resolve(function(m) {
        //   resolved[m.name] = m
        //   callback()
        // })
    }
  }
