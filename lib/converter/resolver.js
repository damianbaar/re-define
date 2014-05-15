var async = require('async')
  , _ = require('underscore')

  module.exports = function(config, base) {
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
            m = { r:resolver
                , p:pattern }
          }
        })

        return m && { resolver: config.resolvers[m.r]
                    , ref: p
                    , name: p.replace(new RegExp(m.p), '') }
      }

      function resolve(m) {
        return m.resolver(module.path, config, m.name, m.ref)
      }

      function override(m) { module.deps = m.override(module.deps) }

      function skip(m) { return !m[m.name] }

      async.reduce(toResolve, {}, function(memo, mixin, callback) {
        mixin.resolve(function(m) {
          memo[m.name] = m
          callback(null, memo)
        })
      }
      , function (err, result) { done(result) })
    }
  }
